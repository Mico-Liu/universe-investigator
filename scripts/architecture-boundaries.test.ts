import { ESLint } from 'eslint'
import { describe, expect, it } from 'vitest'

const eslint = new ESLint()
const purePackageSourcePaths = [
  'packages/core/src/boundary-probe.ts',
  'packages/simulation/src/boundary-probe.ts',
]

describe('pure package ESLint boundaries', () => {
  it.each(purePackageSourcePaths)(
    'rejects React, Three.js, and Node imports in %s',
    async (filePath) => {
      const [result] = await eslint.lintText(
        [
          "import React from 'react'",
          "import * as THREE from 'three'",
          "import { readFile } from 'node:fs/promises'",
          'void React',
          'void THREE',
          'void readFile',
        ].join('\n'),
        { filePath },
      )

      const restrictedImportMessages =
        result?.messages.filter(
          (message) => message.ruleId === 'no-restricted-imports',
        ) ?? []

      expect(restrictedImportMessages).toHaveLength(3)
    },
  )
})
