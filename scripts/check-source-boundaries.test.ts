import { describe, expect, it } from 'vitest'

// @ts-expect-error -- the production guard is intentionally a native ESM script.
import { analyzeSourceText } from './check-source-boundaries.mjs'

type PackageName = 'core' | 'simulation'
type DiagnosticCode =
  | 'FORBIDDEN_MODULE_IMPORT'
  | 'FORBIDDEN_DOM_SYMBOL'
  | 'FORBIDDEN_GLOBAL'
  | 'FORBIDDEN_AMBIENT_GLOBAL'
  | 'FORBIDDEN_DOM_LIB_REFERENCE'
  | 'FORBIDDEN_LLM_IMPORT'

interface Diagnostic {
  code: DiagnosticCode
}

interface AcceptanceCase {
  id: string
  packageName: PackageName
  source: string
  expected: 'PASS' | 'FAIL'
  diagnosticCode?: DiagnosticCode
}

const acceptanceCases = [
  {
    id: 'DOM-01',
    packageName: 'simulation',
    source: 'void document',
    expected: 'FAIL',
    diagnosticCode: 'FORBIDDEN_GLOBAL',
  },
  {
    id: 'DOM-02',
    packageName: 'simulation',
    source: 'void globalThis.document',
    expected: 'FAIL',
    diagnosticCode: 'FORBIDDEN_GLOBAL',
  },
  {
    id: 'DOM-03',
    packageName: 'core',
    source: 'void localStorage',
    expected: 'FAIL',
    diagnosticCode: 'FORBIDDEN_GLOBAL',
  },
  {
    id: 'DOM-04',
    packageName: 'core',
    source: 'void globalThis.localStorage',
    expected: 'FAIL',
    diagnosticCode: 'FORBIDDEN_GLOBAL',
  },
  {
    id: 'DOM-05',
    packageName: 'simulation',
    source: 'new DOMParser()',
    expected: 'FAIL',
    diagnosticCode: 'FORBIDDEN_DOM_SYMBOL',
  },
  {
    id: 'DOM-06',
    packageName: 'simulation',
    source: 'let item: HTMLElement | undefined',
    expected: 'FAIL',
    diagnosticCode: 'FORBIDDEN_DOM_SYMBOL',
  },
  {
    id: 'DOM-07',
    packageName: 'simulation',
    source: 'let canvas: HTMLCanvasElement | undefined',
    expected: 'FAIL',
    diagnosticCode: 'FORBIDDEN_DOM_SYMBOL',
  },
  {
    id: 'DOM-08',
    packageName: 'simulation',
    source: 'let program: WebGLProgram | undefined',
    expected: 'FAIL',
    diagnosticCode: 'FORBIDDEN_DOM_SYMBOL',
  },
  {
    id: 'DOM-09',
    packageName: 'simulation',
    source: 'void globalThis.WebGLProgram',
    expected: 'FAIL',
    diagnosticCode: 'FORBIDDEN_DOM_SYMBOL',
  },
  {
    id: 'DOM-10',
    packageName: 'simulation',
    source: "void globalThis['document']",
    expected: 'FAIL',
    diagnosticCode: 'FORBIDDEN_GLOBAL',
  },
  {
    id: 'DOM-11',
    packageName: 'simulation',
    source: 'void globalThis[`WebGLProgram`]',
    expected: 'FAIL',
    diagnosticCode: 'FORBIDDEN_DOM_SYMBOL',
  },
  {
    id: 'AMBIENT-01',
    packageName: 'simulation',
    source: 'declare const document: Document',
    expected: 'FAIL',
    diagnosticCode: 'FORBIDDEN_AMBIENT_GLOBAL',
  },
  {
    id: 'AMBIENT-02',
    packageName: 'core',
    source: 'declare const localStorage: unknown',
    expected: 'FAIL',
    diagnosticCode: 'FORBIDDEN_AMBIENT_GLOBAL',
  },
  {
    id: 'AMBIENT-03',
    packageName: 'simulation',
    source: 'export {}\ndeclare global { var document: Document }',
    expected: 'FAIL',
    diagnosticCode: 'FORBIDDEN_AMBIENT_GLOBAL',
  },
  {
    id: 'LIB-01',
    packageName: 'simulation',
    source: '/// <reference lib="dom" />\nexport {}',
    expected: 'FAIL',
    diagnosticCode: 'FORBIDDEN_DOM_LIB_REFERENCE',
  },
  {
    id: 'LIB-02',
    packageName: 'simulation',
    source: '/// <reference lib="dom.iterable" />\nexport {}',
    expected: 'FAIL',
    diagnosticCode: 'FORBIDDEN_DOM_LIB_REFERENCE',
  },
  {
    id: 'LIB-03',
    packageName: 'simulation',
    source:
      '/// <reference path="../../../node_modules/typescript/lib/lib.dom.d.ts" />\nexport {}',
    expected: 'FAIL',
    diagnosticCode: 'FORBIDDEN_DOM_LIB_REFERENCE',
  },
  {
    id: 'MODULE-01',
    packageName: 'core',
    source: "import React from 'react'\nvoid React",
    expected: 'FAIL',
    diagnosticCode: 'FORBIDDEN_MODULE_IMPORT',
  },
  {
    id: 'MODULE-02',
    packageName: 'simulation',
    source: "export { Scene } from 'three'",
    expected: 'FAIL',
    diagnosticCode: 'FORBIDDEN_MODULE_IMPORT',
  },
  {
    id: 'MODULE-03',
    packageName: 'simulation',
    source: "import OpenAI = require('openai')\nvoid OpenAI",
    expected: 'FAIL',
    diagnosticCode: 'FORBIDDEN_LLM_IMPORT',
  },
  {
    id: 'MODULE-04',
    packageName: 'simulation',
    source: "const provider = require('openai')\nvoid provider",
    expected: 'FAIL',
    diagnosticCode: 'FORBIDDEN_LLM_IMPORT',
  },
  {
    id: 'MODULE-05',
    packageName: 'simulation',
    source: "const provider = import('openai')\nvoid provider",
    expected: 'FAIL',
    diagnosticCode: 'FORBIDDEN_LLM_IMPORT',
  },
  {
    id: 'MODULE-06',
    packageName: 'simulation',
    source: 'const provider = import(`openai`)\nvoid provider',
    expected: 'FAIL',
    diagnosticCode: 'FORBIDDEN_LLM_IMPORT',
  },
  {
    id: 'MODULE-07',
    packageName: 'simulation',
    source: "type Provider = import('openai').OpenAI",
    expected: 'FAIL',
    diagnosticCode: 'FORBIDDEN_LLM_IMPORT',
  },
  {
    id: 'LLM-01',
    packageName: 'simulation',
    source: "import OpenAI from 'openai'\nvoid OpenAI",
    expected: 'FAIL',
    diagnosticCode: 'FORBIDDEN_LLM_IMPORT',
  },
  {
    id: 'LLM-02',
    packageName: 'simulation',
    source: "import provider from 'ai'\nvoid provider",
    expected: 'FAIL',
    diagnosticCode: 'FORBIDDEN_LLM_IMPORT',
  },
  {
    id: 'LLM-03',
    packageName: 'simulation',
    source: "import provider from '@ai-sdk/openai'\nvoid provider",
    expected: 'FAIL',
    diagnosticCode: 'FORBIDDEN_LLM_IMPORT',
  },
  {
    id: 'LLM-04',
    packageName: 'simulation',
    source: "import provider from 'groq-sdk'\nvoid provider",
    expected: 'FAIL',
    diagnosticCode: 'FORBIDDEN_LLM_IMPORT',
  },
  {
    id: 'LLM-05',
    packageName: 'simulation',
    source: "import provider from '@azure/openai'\nvoid provider",
    expected: 'FAIL',
    diagnosticCode: 'FORBIDDEN_LLM_IMPORT',
  },
  {
    id: 'PASS-01',
    packageName: 'simulation',
    source: 'interface Record { document: string }',
    expected: 'PASS',
  },
  {
    id: 'PASS-02',
    packageName: 'simulation',
    source: "const value = { document: 'text' }\nvoid value",
    expected: 'PASS',
  },
  {
    id: 'PASS-03',
    packageName: 'simulation',
    source: 'function f(document: string) { void document }\nvoid f',
    expected: 'PASS',
  },
  {
    id: 'PASS-04',
    packageName: 'simulation',
    source: "const document = 'local'\nvoid document",
    expected: 'PASS',
  },
  {
    id: 'PASS-05',
    packageName: 'core',
    source: "import { value } from './allowed'\nvoid value",
    expected: 'PASS',
  },
  {
    id: 'PASS-06',
    packageName: 'simulation',
    source: "import type { Vector } from './vector'\ntype Result = Vector",
    expected: 'PASS',
  },
  {
    id: 'PASS-07',
    packageName: 'core',
    source:
      'interface Evidence { id: string }\nexport function evidenceId(value: Evidence): string { return value.id }',
    expected: 'PASS',
  },
  {
    id: 'PASS-08',
    packageName: 'simulation',
    source:
      'export function clamp(value: number): number { return Math.max(0, Math.min(1, value)) }',
    expected: 'PASS',
  },
  {
    id: 'PASS-09',
    packageName: 'simulation',
    source: 'const documentCount = 1\nvoid documentCount',
    expected: 'PASS',
  },
  {
    id: 'PASS-10',
    packageName: 'simulation',
    source: "import { wait } from './wait-for-signal'\nvoid wait",
    expected: 'PASS',
  },
] as const satisfies readonly AcceptanceCase[]

const frozenAcceptanceIds = [
  'DOM-01',
  'DOM-02',
  'DOM-03',
  'DOM-04',
  'DOM-05',
  'DOM-06',
  'DOM-07',
  'DOM-08',
  'DOM-09',
  'DOM-10',
  'DOM-11',
  'AMBIENT-01',
  'AMBIENT-02',
  'AMBIENT-03',
  'LIB-01',
  'LIB-02',
  'LIB-03',
  'MODULE-01',
  'MODULE-02',
  'MODULE-03',
  'MODULE-04',
  'MODULE-05',
  'MODULE-06',
  'MODULE-07',
  'LLM-01',
  'LLM-02',
  'LLM-03',
  'LLM-04',
  'LLM-05',
  'PASS-01',
  'PASS-02',
  'PASS-03',
  'PASS-04',
  'PASS-05',
  'PASS-06',
  'PASS-07',
  'PASS-08',
  'PASS-09',
  'PASS-10',
] as const

const frozenTestNames = {
  'DOM-01': 'DOM-01 rejects direct document global',
  'DOM-02': 'DOM-02 rejects globalThis.document',
  'DOM-03': 'DOM-03 rejects direct localStorage in core',
  'DOM-04': 'DOM-04 rejects globalThis.localStorage in core',
  'DOM-05': 'DOM-05 rejects DOMParser',
  'DOM-06': 'DOM-06 rejects HTMLElement',
  'DOM-07': 'DOM-07 rejects HTMLCanvasElement',
  'DOM-08': 'DOM-08 rejects WebGLProgram',
  'DOM-09': 'DOM-09 rejects globalThis.WebGLProgram',
  'DOM-10': 'DOM-10 rejects string element access through globalThis',
  'DOM-11': 'DOM-11 rejects template element access through globalThis',
  'AMBIENT-01': 'AMBIENT-01 rejects ambient document declaration',
  'AMBIENT-02': 'AMBIENT-02 rejects ambient localStorage declaration',
  'AMBIENT-03': 'AMBIENT-03 rejects declare-global document augmentation',
  'LIB-01': 'LIB-01 rejects dom lib reference',
  'LIB-02': 'LIB-02 rejects dom.iterable lib reference',
  'LIB-03': 'LIB-03 rejects path reference to lib.dom.d.ts',
  'MODULE-01': 'MODULE-01 rejects React ImportDeclaration',
  'MODULE-02': 'MODULE-02 rejects Three ExportDeclaration',
  'MODULE-03': 'MODULE-03 rejects ImportEqualsDeclaration',
  'MODULE-04': 'MODULE-04 rejects static require call',
  'MODULE-05': 'MODULE-05 rejects string dynamic import',
  'MODULE-06': 'MODULE-06 rejects no-substitution template import',
  'MODULE-07': 'MODULE-07 rejects ImportTypeNode',
  'LLM-01': 'LLM-01 rejects openai',
  'LLM-02': 'LLM-02 rejects ai',
  'LLM-03': 'LLM-03 rejects @ai-sdk provider',
  'LLM-04': 'LLM-04 rejects groq-sdk',
  'LLM-05': 'LLM-05 rejects @azure/openai',
  'PASS-01': 'PASS-01 allows interface property document',
  'PASS-02': 'PASS-02 allows object property document',
  'PASS-03': 'PASS-03 allows shadowed function parameter document',
  'PASS-04': 'PASS-04 allows locally declared document identifier',
  'PASS-05': 'PASS-05 allows normal core import',
  'PASS-06': 'PASS-06 allows normal simulation type import',
  'PASS-07': 'PASS-07 allows pure core source',
  'PASS-08': 'PASS-08 allows pure deterministic simulation source',
  'PASS-09': 'PASS-09 allows identifiers containing forbidden text',
  'PASS-10': 'PASS-10 allows local module names containing ai',
} as const satisfies Record<(typeof frozenAcceptanceIds)[number], string>

const executableAcceptanceCases = acceptanceCases.map((acceptanceCase) => ({
  ...acceptanceCase,
  testName: frozenTestNames[acceptanceCase.id],
}))

describe('frozen source-boundary acceptance matrix', () => {
  it('contains every frozen case exactly once', () => {
    const actualIds = acceptanceCases.map(({ id }) => id)
    expect(new Set(actualIds).size).toBe(actualIds.length)
    expect(actualIds).toEqual(frozenAcceptanceIds)
    expect(Object.keys(frozenTestNames)).toEqual(frozenAcceptanceIds)
  })

  it.each(executableAcceptanceCases)('$testName', (acceptanceCase) => {
    const { id, packageName, source, expected } = acceptanceCase
    const diagnostics = analyzeSourceText(
      packageName,
      source,
      `${id.toLowerCase()}.ts`,
    ) as Diagnostic[]

    if (expected === 'PASS') {
      expect(diagnostics, id).toEqual([])
    } else {
      if (!('diagnosticCode' in acceptanceCase)) {
        throw new Error(`${id} is missing its frozen diagnostic code`)
      }
      expect(
        diagnostics.map(({ code }) => code),
        id,
      ).toEqual([acceptanceCase.diagnosticCode])
    }
  })
})
