export type EvidenceCategory =
  | 'observation'
  | 'physical-property'
  | 'composition'
  | 'structure'
  | 'motion'
  | 'signal'
  | 'environment'
  | 'context'

export interface EvidenceDefinition {
  readonly id: string
  readonly category: EvidenceCategory
}

export interface EvidenceRuntimeState {
  readonly discoveredEvidenceIds: readonly string[]
}

export function createEvidenceRuntimeState(): EvidenceRuntimeState {
  return { discoveredEvidenceIds: [] }
}

export interface UnknownEvidenceError {
  readonly code: 'UNKNOWN_EVIDENCE_ID'
  readonly evidenceId: string
}

export type DiscoverEvidenceResult =
  | {
      readonly ok: true
      readonly discovered: boolean
      readonly state: EvidenceRuntimeState
    }
  | {
      readonly ok: false
      readonly state: EvidenceRuntimeState
      readonly error: UnknownEvidenceError
    }

export function discoverEvidence(
  definitions: readonly EvidenceDefinition[],
  state: EvidenceRuntimeState,
  evidenceId: string,
): DiscoverEvidenceResult {
  if (!definitions.some((definition) => definition.id === evidenceId)) {
    return {
      ok: false,
      state,
      error: { code: 'UNKNOWN_EVIDENCE_ID', evidenceId },
    }
  }

  if (state.discoveredEvidenceIds.includes(evidenceId)) {
    return { ok: true, discovered: false, state }
  }

  return {
    ok: true,
    discovered: true,
    state: {
      discoveredEvidenceIds: [...state.discoveredEvidenceIds, evidenceId],
    },
  }
}
