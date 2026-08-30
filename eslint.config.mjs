import eslint from '@eslint/js'
import globals from 'globals'
import { builtinModules } from 'node:module'
import tseslint from 'typescript-eslint'

const nodeBuiltinPaths = [
  ...new Set(
    builtinModules.flatMap((moduleName) => [
      moduleName,
      moduleName.startsWith('node:') ? moduleName : `node:${moduleName}`,
    ]),
  ),
]

const purePackageRestrictions = {
  'no-restricted-imports': [
    'error',
    {
      paths: ['react', 'react-dom', 'three', ...nodeBuiltinPaths],
      patterns: ['react/*', 'react-dom/*', 'three/*', '@react-three/*'],
    },
  ],
}

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'packages/core/type-tests/**',
      'packages/simulation/type-tests/**',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: [
      '*.config.{js,mjs,ts}',
      'eslint.config.mjs',
      'scripts/**/*.{js,mjs,ts}',
      'apps/web/e2e/**/*.{ts,tsx}',
      'apps/web/vite.config.ts',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ['apps/web/src/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: [
      'packages/core/src/**/*.{ts,tsx}',
      'packages/simulation/src/**/*.{ts,tsx}',
    ],
    rules: purePackageRestrictions,
  },
)
