import { describe, expect, it } from 'vitest'

import { CORE_VERSION } from './index'

describe('@universe-investigator/core', () => {
  it('exports the bootstrap version', () => {
    expect(CORE_VERSION).toBe('0.0.1')
  })
})
