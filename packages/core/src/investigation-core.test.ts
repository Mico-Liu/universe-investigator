import { describe, expect, it } from 'vitest'

import {
  calculateModelFit,
  createEvidenceRuntimeState,
  discoverEvidence,
  submitClaim,
  validateHypothesisDefinition,
  verifyClaim,
  type ClaimSubmission,
  type EvidenceDefinition,
  type EvidenceRuntimeState,
  type HypothesisDefinition,
} from './index'

const FICTIONAL_EVIDENCE = [
  { id: 'fictional-glimmer', category: 'observation' },
  { id: 'fictional-chime', category: 'signal' },
  { id: 'fictional-ripple', category: 'environment' },
  { id: 'fictional-dust', category: 'context' },
] as const satisfies readonly EvidenceDefinition[]

const SINGING_DOOR = {
  id: 'fictional-singing-door',
  supportingEvidenceIds: ['fictional-glimmer', 'fictional-chime'],
  conflictingEvidenceIds: ['fictional-ripple'],
} as const satisfies HypothesisDefinition

const POCKET_CLOUD = {
  id: 'fictional-pocket-cloud',
  supportingEvidenceIds: ['fictional-ripple'],
  conflictingEvidenceIds: ['fictional-glimmer'],
} as const satisfies HypothesisDefinition

const FICTIONAL_HYPOTHESES = [SINGING_DOOR, POCKET_CLOUD] as const

function discoverFictionalEvidence(
  ...evidenceIds: readonly string[]
): EvidenceRuntimeState {
  let state = createEvidenceRuntimeState()

  for (const evidenceId of evidenceIds) {
    const result = discoverEvidence(FICTIONAL_EVIDENCE, state, evidenceId)
    if (!result.ok) {
      throw new Error(`Unknown fictional test evidence: ${evidenceId}`)
    }
    state = result.state
  }

  return state
}

function submitValidFictionalClaim(
  claim: ClaimSubmission,
  evidenceState: EvidenceRuntimeState,
): ClaimSubmission {
  const result = submitClaim(
    claim,
    FICTIONAL_HYPOTHESES,
    FICTIONAL_EVIDENCE,
    evidenceState,
  )
  if (!result.ok) {
    throw new Error(`Invalid fictional test claim: ${result.error.code}`)
  }

  return result.claim
}

describe('Evidence runtime v0', () => {
  it('starts with no discovered evidence', () => {
    expect(createEvidenceRuntimeState()).toEqual({ discoveredEvidenceIds: [] })
  })

  it('discovers known evidence', () => {
    const initialState = createEvidenceRuntimeState()
    const result = discoverEvidence(
      FICTIONAL_EVIDENCE,
      initialState,
      'fictional-glimmer',
    )

    expect(result).toEqual({
      ok: true,
      discovered: true,
      state: { discoveredEvidenceIds: ['fictional-glimmer'] },
    })
    expect(initialState).toEqual({ discoveredEvidenceIds: [] })
  })

  it('does not count the same evidence twice', () => {
    const state = discoverFictionalEvidence('fictional-glimmer')
    const result = discoverEvidence(
      FICTIONAL_EVIDENCE,
      state,
      'fictional-glimmer',
    )

    expect(result).toEqual({ ok: true, discovered: false, state })
    expect(result.state).toBe(state)
    expect(result.state.discoveredEvidenceIds).toEqual(['fictional-glimmer'])
  })

  it('rejects an unknown evidence ID without changing state', () => {
    const state = createEvidenceRuntimeState()
    const result = discoverEvidence(
      FICTIONAL_EVIDENCE,
      state,
      'fictional-unknown',
    )

    expect(result).toEqual({
      ok: false,
      state,
      error: {
        code: 'UNKNOWN_EVIDENCE_ID',
        evidenceId: 'fictional-unknown',
      },
    })
    expect(result.state).toBe(state)
  })
})

describe('Hypothesis v0', () => {
  it('rejects evidence assigned as both supporting and conflicting', () => {
    expect(
      validateHypothesisDefinition({
        id: 'fictional-ambiguous-hypothesis',
        supportingEvidenceIds: ['fictional-glimmer'],
        conflictingEvidenceIds: ['fictional-glimmer'],
      }),
    ).toEqual({
      ok: false,
      error: {
        code: 'AMBIGUOUS_EVIDENCE_RELATION',
        hypothesisId: 'fictional-ambiguous-hypothesis',
        evidenceId: 'fictional-glimmer',
      },
    })
  })
})

describe('Model Fit v0', () => {
  it('is weak with no supporting or conflicting evidence', () => {
    expect(calculateModelFit(SINGING_DOOR, discoverFictionalEvidence())).toBe(
      'weak',
    )
  })

  it('is possible with one supporting evidence', () => {
    expect(
      calculateModelFit(
        SINGING_DOOR,
        discoverFictionalEvidence('fictional-glimmer'),
      ),
    ).toBe('possible')
  })

  it('is strong with two supporting evidence', () => {
    expect(
      calculateModelFit(
        SINGING_DOOR,
        discoverFictionalEvidence('fictional-glimmer', 'fictional-chime'),
      ),
    ).toBe('strong')
  })

  it('is conflict when conflicting evidence exists', () => {
    expect(
      calculateModelFit(
        SINGING_DOOR,
        discoverFictionalEvidence('fictional-ripple'),
      ),
    ).toBe('conflict')
  })

  it('gives conflict priority over a strong supporting fit', () => {
    expect(
      calculateModelFit(
        SINGING_DOOR,
        discoverFictionalEvidence(
          'fictional-glimmer',
          'fictional-chime',
          'fictional-ripple',
        ),
      ),
    ).toBe('conflict')
  })

  it('does not change fit for unrelated evidence', () => {
    expect(
      calculateModelFit(
        SINGING_DOOR,
        discoverFictionalEvidence('fictional-dust'),
      ),
    ).toBe('weak')
  })

  it('calculates different fits per hypothesis for the same evidence', () => {
    const state = discoverFictionalEvidence('fictional-glimmer')

    expect(calculateModelFit(SINGING_DOOR, state)).toBe('possible')
    expect(calculateModelFit(POCKET_CLOUD, state)).toBe('conflict')
  })
})

describe('Claim submission v0', () => {
  it('accepts a claim that cites discovered evidence', () => {
    const state = discoverFictionalEvidence('fictional-glimmer')

    expect(
      submitClaim(
        {
          hypothesisId: SINGING_DOOR.id,
          evidenceIds: ['fictional-glimmer'],
        },
        FICTIONAL_HYPOTHESES,
        FICTIONAL_EVIDENCE,
        state,
      ),
    ).toEqual({
      ok: true,
      claim: {
        hypothesisId: SINGING_DOOR.id,
        evidenceIds: ['fictional-glimmer'],
      },
    })
  })

  it('rejects an unknown hypothesis', () => {
    expect(
      submitClaim(
        { hypothesisId: 'fictional-unknown', evidenceIds: [] },
        FICTIONAL_HYPOTHESES,
        FICTIONAL_EVIDENCE,
        createEvidenceRuntimeState(),
      ),
    ).toEqual({
      ok: false,
      error: {
        code: 'UNKNOWN_HYPOTHESIS_ID',
        hypothesisId: 'fictional-unknown',
      },
    })
  })

  it('rejects unknown evidence', () => {
    expect(
      submitClaim(
        {
          hypothesisId: SINGING_DOOR.id,
          evidenceIds: ['fictional-unknown'],
        },
        FICTIONAL_HYPOTHESES,
        FICTIONAL_EVIDENCE,
        createEvidenceRuntimeState(),
      ),
    ).toEqual({
      ok: false,
      error: {
        code: 'UNKNOWN_EVIDENCE_ID',
        evidenceId: 'fictional-unknown',
      },
    })
  })

  it('rejects evidence that has not been discovered', () => {
    expect(
      submitClaim(
        {
          hypothesisId: SINGING_DOOR.id,
          evidenceIds: ['fictional-chime'],
        },
        FICTIONAL_HYPOTHESES,
        FICTIONAL_EVIDENCE,
        createEvidenceRuntimeState(),
      ),
    ).toEqual({
      ok: false,
      error: {
        code: 'UNDISCOVERED_EVIDENCE_ID',
        evidenceId: 'fictional-chime',
      },
    })
  })

  it('rejects duplicate evidence IDs', () => {
    const state = discoverFictionalEvidence('fictional-glimmer')

    expect(
      submitClaim(
        {
          hypothesisId: SINGING_DOOR.id,
          evidenceIds: ['fictional-glimmer', 'fictional-glimmer'],
        },
        FICTIONAL_HYPOTHESES,
        FICTIONAL_EVIDENCE,
        state,
      ),
    ).toEqual({
      ok: false,
      error: {
        code: 'DUPLICATE_EVIDENCE_ID',
        evidenceId: 'fictional-glimmer',
      },
    })
  })
})

describe('Claim Verification v0', () => {
  it('is insufficient with no supporting claim evidence', () => {
    const claim = submitValidFictionalClaim(
      { hypothesisId: SINGING_DOOR.id, evidenceIds: [] },
      createEvidenceRuntimeState(),
    )

    expect(verifyClaim(claim, SINGING_DOOR)).toEqual({
      ok: true,
      result: 'insufficient-evidence',
    })
  })

  it('is partially supported with one supporting claim evidence', () => {
    const claim = submitValidFictionalClaim(
      {
        hypothesisId: SINGING_DOOR.id,
        evidenceIds: ['fictional-glimmer'],
      },
      discoverFictionalEvidence('fictional-glimmer'),
    )

    expect(verifyClaim(claim, SINGING_DOOR)).toEqual({
      ok: true,
      result: 'partially-supported',
    })
  })

  it('is supported with two supporting claim evidence', () => {
    const claim = submitValidFictionalClaim(
      {
        hypothesisId: SINGING_DOOR.id,
        evidenceIds: ['fictional-glimmer', 'fictional-chime'],
      },
      discoverFictionalEvidence('fictional-glimmer', 'fictional-chime'),
    )

    expect(verifyClaim(claim, SINGING_DOOR)).toEqual({
      ok: true,
      result: 'supported',
    })
  })

  it('is conflicting when the claim cites conflicting evidence', () => {
    const claim = submitValidFictionalClaim(
      {
        hypothesisId: SINGING_DOOR.id,
        evidenceIds: ['fictional-ripple'],
      },
      discoverFictionalEvidence('fictional-ripple'),
    )

    expect(verifyClaim(claim, SINGING_DOOR)).toEqual({
      ok: true,
      result: 'conflicting-evidence',
    })
  })

  it('gives conflicting evidence priority over supported evidence', () => {
    const claim = submitValidFictionalClaim(
      {
        hypothesisId: SINGING_DOOR.id,
        evidenceIds: [
          'fictional-glimmer',
          'fictional-chime',
          'fictional-ripple',
        ],
      },
      discoverFictionalEvidence(
        'fictional-glimmer',
        'fictional-chime',
        'fictional-ripple',
      ),
    )

    expect(verifyClaim(claim, SINGING_DOOR)).toEqual({
      ok: true,
      result: 'conflicting-evidence',
    })
  })

  it('does not count unrelated claim evidence as supporting', () => {
    const claim = submitValidFictionalClaim(
      {
        hypothesisId: SINGING_DOOR.id,
        evidenceIds: ['fictional-dust'],
      },
      discoverFictionalEvidence('fictional-dust'),
    )

    expect(verifyClaim(claim, SINGING_DOOR)).toEqual({
      ok: true,
      result: 'insufficient-evidence',
    })
  })

  it('uses only cited evidence and does not add discovered evidence', () => {
    const evidenceState = discoverFictionalEvidence(
      'fictional-glimmer',
      'fictional-chime',
    )
    const claim = submitValidFictionalClaim(
      {
        hypothesisId: SINGING_DOOR.id,
        evidenceIds: ['fictional-glimmer'],
      },
      evidenceState,
    )

    expect(calculateModelFit(SINGING_DOOR, evidenceState)).toBe('strong')
    expect(verifyClaim(claim, SINGING_DOOR)).toEqual({
      ok: true,
      result: 'partially-supported',
    })
  })

  it('rejects verification against a different hypothesis', () => {
    const claim = submitValidFictionalClaim(
      {
        hypothesisId: SINGING_DOOR.id,
        evidenceIds: ['fictional-glimmer'],
      },
      discoverFictionalEvidence('fictional-glimmer'),
    )

    expect(verifyClaim(claim, POCKET_CLOUD)).toEqual({
      ok: false,
      error: {
        code: 'HYPOTHESIS_MISMATCH',
        claimHypothesisId: SINGING_DOOR.id,
        providedHypothesisId: POCKET_CLOUD.id,
      },
    })
  })
})
