import { readFileSync, readdirSync } from 'node:fs'
import { basename, dirname, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import ts from 'typescript'

const repositoryRoot = fileURLToPath(new URL('..', import.meta.url))
const sourceExtensions = new Set(['.cjs', '.js', '.jsx', '.mjs', '.ts', '.tsx'])
const domLibraryFilePattern = /^lib\.dom(?:\.[^.]+)*\.d\.ts$/u

const policies = {
  core: {
    packageName: 'core',
    packageDirectory: resolve(repositoryRoot, 'packages/core'),
    forbiddenGlobals: new Set(['window', 'document', 'localStorage']),
    forbiddenModules: [
      'react',
      'react-dom',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
    ],
    forbiddenLlmModules: [],
    forbidDom: false,
  },
  simulation: {
    packageName: 'simulation',
    packageDirectory: resolve(repositoryRoot, 'packages/simulation'),
    forbiddenGlobals: new Set(['window', 'document', 'localStorage']),
    forbiddenModules: [
      'react',
      'react-dom',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
    ],
    forbiddenLlmModules: [
      { kind: 'exact', value: 'openai' },
      { kind: 'exact', value: 'ai' },
      { kind: 'prefix', value: '@ai-sdk/' },
      { kind: 'exact', value: 'groq-sdk' },
      { kind: 'exact', value: '@azure/openai' },
    ],
    forbidDom: true,
  },
}

function sourceExtension(fileName) {
  const dotIndex = fileName.lastIndexOf('.')
  return dotIndex === -1 ? '' : fileName.slice(dotIndex)
}

function collectSourceFiles(directory) {
  const files = []
  const entries = readdirSync(directory, { withFileTypes: true }).sort(
    (left, right) => left.name.localeCompare(right.name, 'en'),
  )

  for (const entry of entries) {
    const entryPath = resolve(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...collectSourceFiles(entryPath))
    } else if (
      entry.isFile() &&
      sourceExtensions.has(sourceExtension(entry.name))
    ) {
      files.push(entryPath)
    }
  }

  return files
}

function collectBindingNames(name, names) {
  if (ts.isIdentifier(name)) {
    names.push(name)
    return
  }

  for (const element of name.elements) {
    if (ts.isBindingElement(element)) {
      collectBindingNames(element.name, names)
    }
  }
}

function loadDomSymbolNames() {
  const libraryDirectory = dirname(ts.getDefaultLibFilePath({}))
  const names = new Set()

  for (const libraryName of [
    'lib.dom.d.ts',
    'lib.dom.iterable.d.ts',
    'lib.dom.asynciterable.d.ts',
  ]) {
    const libraryPath = resolve(libraryDirectory, libraryName)
    const source = readFileSync(libraryPath, 'utf8')
    const sourceFile = ts.createSourceFile(
      libraryPath,
      source,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS,
    )

    for (const statement of sourceFile.statements) {
      if (ts.isVariableStatement(statement)) {
        for (const declaration of statement.declarationList.declarations) {
          const bindings = []
          collectBindingNames(declaration.name, bindings)
          for (const binding of bindings) {
            names.add(binding.text)
          }
        }
      } else if (
        (ts.isClassDeclaration(statement) ||
          ts.isEnumDeclaration(statement) ||
          ts.isFunctionDeclaration(statement) ||
          ts.isInterfaceDeclaration(statement) ||
          ts.isModuleDeclaration(statement) ||
          ts.isTypeAliasDeclaration(statement)) &&
        statement.name !== undefined &&
        ts.isIdentifier(statement.name)
      ) {
        names.add(statement.name.text)
      }
    }
  }

  return names
}

const domSymbolNames = loadDomSymbolNames()

function getPolicy(packageName) {
  const policy = policies[packageName]
  if (policy === undefined) {
    throw new Error(`Unknown source-boundary package: ${packageName}`)
  }
  return policy
}

function parsePackageConfig(policy) {
  const configPath = resolve(policy.packageDirectory, 'tsconfig.json')
  const configResult = ts.readConfigFile(configPath, ts.sys.readFile)
  if (configResult.error !== undefined) {
    throw new Error(
      ts.flattenDiagnosticMessageText(configResult.error.messageText, '\n'),
    )
  }

  return ts.parseJsonConfigFileContent(
    configResult.config,
    ts.sys,
    policy.packageDirectory,
    undefined,
    configPath,
  )
}

function createProgram(packageName, rootNames, virtualSources = new Map()) {
  const policy = getPolicy(packageName)
  const config = parsePackageConfig(policy)
  const host = ts.createCompilerHost(config.options, true)
  const defaultFileExists = host.fileExists.bind(host)
  const defaultGetSourceFile = host.getSourceFile.bind(host)
  const defaultReadFile = host.readFile.bind(host)

  host.fileExists = (fileName) =>
    virtualSources.has(resolve(fileName)) || defaultFileExists(fileName)
  host.readFile = (fileName) =>
    virtualSources.get(resolve(fileName)) ?? defaultReadFile(fileName)
  host.getSourceFile = (
    fileName,
    languageVersion,
    onError,
    shouldCreateNewSourceFile,
  ) => {
    const source = virtualSources.get(resolve(fileName))
    if (source !== undefined) {
      return ts.createSourceFile(
        fileName,
        source,
        languageVersion,
        true,
        ts.getScriptKindFromFileName(fileName),
      )
    }
    return defaultGetSourceFile(
      fileName,
      languageVersion,
      onError,
      shouldCreateNewSourceFile,
    )
  }

  return ts.createProgram({ rootNames, options: config.options, host })
}

function staticModuleSpecifier(node) {
  return ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)
    ? node.text
    : undefined
}

function extractStaticModuleReferences(sourceFile) {
  const references = []

  function add(specifierNode, syntaxKind) {
    const specifier = staticModuleSpecifier(specifierNode)
    if (specifier !== undefined) {
      references.push({ specifier, node: specifierNode, syntaxKind })
    }
  }

  function visit(node) {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier !== undefined
    ) {
      add(node.moduleSpecifier, ts.SyntaxKind[node.kind])
    } else if (
      ts.isImportEqualsDeclaration(node) &&
      ts.isExternalModuleReference(node.moduleReference) &&
      node.moduleReference.expression !== undefined
    ) {
      add(node.moduleReference.expression, 'ImportEqualsDeclaration')
    } else if (
      ts.isCallExpression(node) &&
      node.arguments[0] !== undefined &&
      (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
        (ts.isIdentifier(node.expression) &&
          node.expression.text === 'require'))
    ) {
      add(
        node.arguments[0],
        node.expression.kind === ts.SyntaxKind.ImportKeyword
          ? 'ImportCall'
          : 'RequireCall',
      )
    } else if (
      ts.isImportTypeNode(node) &&
      ts.isLiteralTypeNode(node.argument)
    ) {
      add(node.argument.literal, 'ImportTypeNode')
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return references
}

function matchesModule(specifier, forbiddenModule) {
  return (
    specifier === forbiddenModule || specifier.startsWith(`${forbiddenModule}/`)
  )
}

function isForbiddenLlmModule(specifier, policy) {
  return policy.forbiddenLlmModules.some((entry) =>
    entry.kind === 'exact'
      ? specifier === entry.value
      : specifier.startsWith(entry.value),
  )
}

function isDomLibraryFile(fileName) {
  return domLibraryFilePattern.test(basename(fileName).toLowerCase())
}

function resolvedSymbol(checker, node) {
  const symbol = checker.getSymbolAtLocation(node)
  if (symbol === undefined) {
    return undefined
  }
  return (symbol.flags & ts.SymbolFlags.Alias) !== 0
    ? checker.getAliasedSymbol(symbol)
    : symbol
}

function resolvesToCurrentSource(checker, node, sourceFile) {
  return (
    resolvedSymbol(checker, node)?.declarations?.some(
      (declaration) => declaration.getSourceFile() === sourceFile,
    ) === true
  )
}

function resolvesToDomLibrary(checker, node) {
  return (
    resolvedSymbol(checker, node)?.declarations?.some((declaration) =>
      isDomLibraryFile(declaration.getSourceFile().fileName),
    ) === true
  )
}

function isDeclarationName(node) {
  const parent = node.parent
  if (ts.isShorthandPropertyAssignment(parent) && parent.name === node) {
    return false
  }
  if (
    (ts.isPropertyAccessExpression(parent) && parent.name === node) ||
    (ts.isQualifiedName(parent) && parent.right === node)
  ) {
    return false
  }
  if (parent.name === node || parent.propertyName === node) {
    return true
  }
  return false
}

function isQualifiedPropertyName(node) {
  const parent = node.parent
  return (
    (ts.isPropertyAccessExpression(parent) && parent.name === node) ||
    (ts.isQualifiedName(parent) && parent.right === node)
  )
}

function isGlobalThisExpression(checker, node, sourceFile) {
  return (
    ts.isIdentifier(node) &&
    node.text === 'globalThis' &&
    !resolvesToCurrentSource(checker, node, sourceFile)
  )
}

function globalThisProperty(node) {
  if (ts.isPropertyAccessExpression(node)) {
    return node.name.text
  }
  if (
    ts.isElementAccessExpression(node) &&
    node.argumentExpression !== undefined
  ) {
    return staticModuleSpecifier(node.argumentExpression)
  }
  return undefined
}

function hasDeclareModifier(node) {
  return (
    ts.canHaveModifiers(node) &&
    ts
      .getModifiers(node)
      ?.some((modifier) => modifier.kind === ts.SyntaxKind.DeclareKeyword) ===
      true
  )
}

function isInsideGlobalAugmentation(node) {
  let current = node.parent
  while (current !== undefined && !ts.isSourceFile(current)) {
    if (
      ts.isModuleDeclaration(current) &&
      ((current.flags & ts.NodeFlags.GlobalAugmentation) !== 0 ||
        (ts.isIdentifier(current.name) && current.name.text === 'global'))
    ) {
      return true
    }
    current = current.parent
  }
  return false
}

function ambientBindingNames(node) {
  const names = []
  if (ts.isVariableStatement(node)) {
    for (const declaration of node.declarationList.declarations) {
      collectBindingNames(declaration.name, names)
    }
  } else if (
    (ts.isClassDeclaration(node) ||
      ts.isEnumDeclaration(node) ||
      ts.isFunctionDeclaration(node) ||
      ts.isInterfaceDeclaration(node) ||
      ts.isModuleDeclaration(node) ||
      ts.isTypeAliasDeclaration(node)) &&
    node.name !== undefined &&
    ts.isIdentifier(node.name)
  ) {
    names.push(node.name)
  }
  return names
}

function diagnostic(sourceFile, node, policy, code, subject, message) {
  const position = sourceFile.getLineAndCharacterOfPosition(
    node.getStart(sourceFile),
  )
  return {
    code,
    packageName: policy.packageName,
    filePath: relative(repositoryRoot, sourceFile.fileName).replaceAll(
      '\\',
      '/',
    ),
    line: position.line + 1,
    column: position.character + 1,
    syntaxKind: ts.SyntaxKind[node.kind],
    subject,
    message,
  }
}

function analyzeProgramSourceFile(program, sourceFile, packageName) {
  const policy = getPolicy(packageName)
  const checker = program.getTypeChecker()
  const diagnostics = []

  for (const reference of extractStaticModuleReferences(sourceFile)) {
    if (
      policy.forbiddenModules.some((item) =>
        matchesModule(reference.specifier, item),
      )
    ) {
      diagnostics.push(
        diagnostic(
          sourceFile,
          reference.node,
          policy,
          'FORBIDDEN_MODULE_IMPORT',
          reference.specifier,
          `${policy.packageName} imports forbidden module "${reference.specifier}"`,
        ),
      )
    } else if (isForbiddenLlmModule(reference.specifier, policy)) {
      diagnostics.push(
        diagnostic(
          sourceFile,
          reference.node,
          policy,
          'FORBIDDEN_LLM_IMPORT',
          reference.specifier,
          `${policy.packageName} imports forbidden LLM module "${reference.specifier}"`,
        ),
      )
    }
  }

  if (policy.forbidDom) {
    for (const reference of sourceFile.libReferenceDirectives) {
      if (reference.fileName.toLowerCase().startsWith('dom')) {
        diagnostics.push(
          diagnostic(
            sourceFile,
            {
              ...reference,
              kind: ts.SyntaxKind.SyntaxList,
              getStart: () => reference.pos,
            },
            policy,
            'FORBIDDEN_DOM_LIB_REFERENCE',
            reference.fileName,
            `${policy.packageName} references forbidden TypeScript lib "${reference.fileName}"`,
          ),
        )
      }
    }
    for (const reference of sourceFile.referencedFiles) {
      if (isDomLibraryFile(reference.fileName)) {
        diagnostics.push(
          diagnostic(
            sourceFile,
            {
              ...reference,
              kind: ts.SyntaxKind.SyntaxList,
              getStart: () => reference.pos,
            },
            policy,
            'FORBIDDEN_DOM_LIB_REFERENCE',
            reference.fileName,
            `${policy.packageName} references forbidden TypeScript DOM path "${reference.fileName}"`,
          ),
        )
      }
    }
  }

  function visit(node) {
    const ambient = hasDeclareModifier(node) || isInsideGlobalAugmentation(node)
    if (ambient) {
      const forbiddenBindings = ambientBindingNames(node).filter(
        (name) =>
          policy.forbiddenGlobals.has(name.text) ||
          (policy.forbidDom && domSymbolNames.has(name.text)),
      )
      if (forbiddenBindings.length > 0) {
        for (const binding of forbiddenBindings) {
          diagnostics.push(
            diagnostic(
              sourceFile,
              binding,
              policy,
              'FORBIDDEN_AMBIENT_GLOBAL',
              binding.text,
              `${policy.packageName} declares forbidden ambient global "${binding.text}"`,
            ),
          )
        }
        return
      }
    }

    if (
      (ts.isPropertyAccessExpression(node) ||
        ts.isElementAccessExpression(node)) &&
      isGlobalThisExpression(checker, node.expression, sourceFile)
    ) {
      const property = globalThisProperty(node)
      if (property !== undefined && policy.forbiddenGlobals.has(property)) {
        diagnostics.push(
          diagnostic(
            sourceFile,
            node,
            policy,
            'FORBIDDEN_GLOBAL',
            property,
            `${policy.packageName} accesses forbidden globalThis property "${property}"`,
          ),
        )
        return
      }
      if (
        property !== undefined &&
        policy.forbidDom &&
        domSymbolNames.has(property)
      ) {
        diagnostics.push(
          diagnostic(
            sourceFile,
            node,
            policy,
            'FORBIDDEN_DOM_SYMBOL',
            property,
            `${policy.packageName} accesses forbidden DOM/WebGL globalThis property "${property}"`,
          ),
        )
        return
      }
    }

    if (ts.isIdentifier(node) && !isDeclarationName(node)) {
      const qualifiedProperty = isQualifiedPropertyName(node)
      if (
        !qualifiedProperty &&
        policy.forbiddenGlobals.has(node.text) &&
        !resolvesToCurrentSource(checker, node, sourceFile)
      ) {
        diagnostics.push(
          diagnostic(
            sourceFile,
            node,
            policy,
            'FORBIDDEN_GLOBAL',
            node.text,
            `${policy.packageName} uses forbidden global "${node.text}"`,
          ),
        )
      } else if (
        policy.forbidDom &&
        (resolvesToDomLibrary(checker, node) ||
          (!qualifiedProperty &&
            domSymbolNames.has(node.text) &&
            !resolvesToCurrentSource(checker, node, sourceFile)))
      ) {
        diagnostics.push(
          diagnostic(
            sourceFile,
            node,
            policy,
            'FORBIDDEN_DOM_SYMBOL',
            node.text,
            `${policy.packageName} uses forbidden DOM/WebGL symbol "${node.text}"`,
          ),
        )
      }
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return normalizeDiagnostics(diagnostics)
}

function normalizeDiagnostics(diagnostics) {
  const unique = new Map()
  for (const item of diagnostics) {
    const key = [
      item.filePath,
      item.line,
      item.column,
      item.code,
      item.subject,
    ].join(':')
    unique.set(key, item)
  }
  return [...unique.values()].sort(
    (left, right) =>
      left.filePath.localeCompare(right.filePath, 'en') ||
      left.line - right.line ||
      left.column - right.column ||
      left.code.localeCompare(right.code, 'en'),
  )
}

export function analyzeSourceText(
  packageName,
  source,
  fixtureName = 'architecture-fixture.ts',
) {
  const policy = getPolicy(packageName)
  const filePath = resolve(policy.packageDirectory, 'src', fixtureName)
  const virtualSources = new Map([[filePath, source]])
  const program = createProgram(packageName, [filePath], virtualSources)
  const sourceFile = program.getSourceFile(filePath)
  if (sourceFile === undefined) {
    throw new Error(`Unable to create source file for ${filePath}`)
  }
  return analyzeProgramSourceFile(program, sourceFile, packageName)
}

export function checkSourceBoundaries() {
  const diagnostics = []
  for (const policy of Object.values(policies)) {
    const rootNames = collectSourceFiles(
      resolve(policy.packageDirectory, 'src'),
    )
    const program = createProgram(policy.packageName, rootNames)
    for (const fileName of rootNames) {
      const sourceFile = program.getSourceFile(fileName)
      if (sourceFile !== undefined) {
        diagnostics.push(
          ...analyzeProgramSourceFile(program, sourceFile, policy.packageName),
        )
      }
    }
  }
  return normalizeDiagnostics(diagnostics)
}

function formatDiagnostic(item) {
  return `${item.filePath}:${item.line}:${item.column} [${item.code}] ${item.message}`
}

function runCli() {
  const diagnostics = checkSourceBoundaries()
  if (diagnostics.length > 0) {
    console.error(
      `Source architecture boundary violations:\n${diagnostics.map(formatDiagnostic).join('\n')}`,
    )
    process.exitCode = 1
  } else {
    console.log('Source architecture boundaries are valid.')
  }
}

const executedFile = process.argv[1]
if (
  executedFile !== undefined &&
  pathToFileURL(resolve(executedFile)).href === import.meta.url
) {
  runCli()
}
