import { readFile } from 'node:fs/promises'

const purePackages = ['core', 'simulation']
const forbiddenDependencies = [
  'react',
  'react-dom',
  'three',
  '@react-three/fiber',
  '@react-three/drei',
]

const dependencyFields = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
]

const violations = []

for (const packageName of purePackages) {
  const manifestPath = new URL(
    `../packages/${packageName}/package.json`,
    import.meta.url,
  )
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))

  for (const field of dependencyFields) {
    const dependencies = manifest[field] ?? {}
    for (const dependency of forbiddenDependencies) {
      if (dependency in dependencies) {
        violations.push(`${packageName}: ${field} contains ${dependency}`)
      }
    }
  }
}

if (violations.length > 0) {
  console.error(`Architecture boundary violations:\n${violations.join('\n')}`)
  process.exitCode = 1
} else {
  console.log('Package dependency boundaries are valid.')
}
