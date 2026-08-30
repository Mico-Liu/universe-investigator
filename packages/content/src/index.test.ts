import { describe, expect, it } from 'vitest'

import { ProjectMetadataSchema } from './index'

describe('ProjectMetadataSchema', () => {
  it('accepts valid project metadata', () => {
    expect(
      ProjectMetadataSchema.parse({
        id: 'universe-investigator',
        version: '0.0.1',
      }),
    ).toEqual({ id: 'universe-investigator', version: '0.0.1' })
  })

  it('rejects an empty id', () => {
    expect(
      ProjectMetadataSchema.safeParse({ id: '', version: '0.0.1' }).success,
    ).toBe(false)
  })

  it('rejects a non-string version', () => {
    expect(
      ProjectMetadataSchema.safeParse({
        id: 'universe-investigator',
        version: 1,
      }).success,
    ).toBe(false)
  })

  it('rejects an empty version', () => {
    expect(
      ProjectMetadataSchema.safeParse({
        id: 'universe-investigator',
        version: '',
      }).success,
    ).toBe(false)
  })

  it('rejects unknown fields', () => {
    expect(
      ProjectMetadataSchema.safeParse({
        id: 'universe-investigator',
        version: '0.0.1',
        unexpected: true,
      }).success,
    ).toBe(false)
  })
})
