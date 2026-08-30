import { describe, expect, it } from 'vitest'

import { clamp01 } from './index'

describe('clamp01', () => {
  it.each([
    [-1, 0],
    [0.5, 0.5],
    [2, 1],
  ])('maps %s to %s', (value, expected) => {
    expect(clamp01(value)).toBe(expected)
  })
})
