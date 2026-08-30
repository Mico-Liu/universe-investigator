import type { EvidenceRuntimeState } from '../evidence/evidence'

export interface HypothesisDefinition {
  readonly id: string
  readonly supportingEvidenceIds: readonly string[]
  readonly conflictingEvidenceIds: readonly string[]
}

export type EvidenceRelation = 'supporting' | 'conflicting' | 'unrelated'

export type ModelFit = 'weak' | 'possible' | 'strong' | 'conflict'

export interface AmbiguousEvidenceRelationError {
  readonly code: 'AMBIGUOUS_EVIDENCE_RELATION'
  readonly hypothesisId: string
  readonly evidenceId: string
}

export type HypothesisDefinitionValidationResult =
  | { readonly ok: true }
  | {
      readonly ok: false
      readonly error: AmbiguousEvidenceRelationError
    }

export function validateHypothesisDefinition(
  hypothesis: HypothesisDefinition,
): HypothesisDefinitionValidationResult {
  const conflictingEvidenceIds = new Set(hypothesis.conflictingEvidenceIds)
  const ambiguousEvidenceId = hypothesis.supportingEvidenceIds.find(
    (evidenceId) => conflictingEvidenceIds.has(evidenceId),
  )

  if (ambiguousEvidenceId === undefined) {
    return { ok: true }
  }

  return {
    ok: false,
    error: {
      code: 'AMBIGUOUS_EVIDENCE_RELATION',
      hypothesisId: hypothesis.id,
      evidenceId: ambiguousEvidenceId,
    },
  }
}

export function getEvidenceRelation(
  hypothesis: HypothesisDefinition,
  evidenceId: string,
): EvidenceRelation {
  if (hypothesis.conflictingEvidenceIds.includes(evidenceId)) {
    return 'conflicting'
  }

  if (hypothesis.supportingEvidenceIds.includes(evidenceId)) {
    return 'supporting'
  }

  return 'unrelated'
}

export function calculateModelFit(
  hypothesis: HypothesisDefinition,
  evidenceState: EvidenceRuntimeState,
): ModelFit {
  let supportingCount = 0

  for (const evidenceId of evidenceState.discoveredEvidenceIds) {
    const relation = getEvidenceRelation(hypothesis, evidenceId)

    if (relation === 'conflicting') {
      return 'conflict'
    }

    if (relation === 'supporting') {
      supportingCount += 1
    }
  }

  if (supportingCount >= 2) {
    return 'strong'
  }

  if (supportingCount === 1) {
    return 'possible'
  }

  return 'weak'
}
