import type {
  EvidenceDefinition,
  EvidenceRuntimeState,
} from '../evidence/evidence'
import {
  getEvidenceRelation,
  type HypothesisDefinition,
} from '../hypothesis/hypothesis'

export interface ClaimSubmission {
  readonly hypothesisId: string
  readonly evidenceIds: readonly string[]
}

export type ClaimSubmissionError =
  | {
      readonly code: 'UNKNOWN_HYPOTHESIS_ID'
      readonly hypothesisId: string
    }
  | {
      readonly code: 'UNKNOWN_EVIDENCE_ID'
      readonly evidenceId: string
    }
  | {
      readonly code: 'UNDISCOVERED_EVIDENCE_ID'
      readonly evidenceId: string
    }
  | {
      readonly code: 'DUPLICATE_EVIDENCE_ID'
      readonly evidenceId: string
    }

export type SubmitClaimResult =
  | {
      readonly ok: true
      readonly claim: ClaimSubmission
    }
  | {
      readonly ok: false
      readonly error: ClaimSubmissionError
    }

export function submitClaim(
  claim: ClaimSubmission,
  hypotheses: readonly HypothesisDefinition[],
  evidenceDefinitions: readonly EvidenceDefinition[],
  evidenceState: EvidenceRuntimeState,
): SubmitClaimResult {
  if (!hypotheses.some((hypothesis) => hypothesis.id === claim.hypothesisId)) {
    return {
      ok: false,
      error: {
        code: 'UNKNOWN_HYPOTHESIS_ID',
        hypothesisId: claim.hypothesisId,
      },
    }
  }

  const seenEvidenceIds = new Set<string>()

  for (const evidenceId of claim.evidenceIds) {
    if (seenEvidenceIds.has(evidenceId)) {
      return {
        ok: false,
        error: { code: 'DUPLICATE_EVIDENCE_ID', evidenceId },
      }
    }
    seenEvidenceIds.add(evidenceId)

    if (
      !evidenceDefinitions.some((definition) => definition.id === evidenceId)
    ) {
      return {
        ok: false,
        error: { code: 'UNKNOWN_EVIDENCE_ID', evidenceId },
      }
    }

    if (!evidenceState.discoveredEvidenceIds.includes(evidenceId)) {
      return {
        ok: false,
        error: { code: 'UNDISCOVERED_EVIDENCE_ID', evidenceId },
      }
    }
  }

  return {
    ok: true,
    claim: {
      hypothesisId: claim.hypothesisId,
      evidenceIds: [...claim.evidenceIds],
    },
  }
}

export type VerificationResult =
  | 'supported'
  | 'partially-supported'
  | 'insufficient-evidence'
  | 'conflicting-evidence'

export interface HypothesisMismatchError {
  readonly code: 'HYPOTHESIS_MISMATCH'
  readonly claimHypothesisId: string
  readonly providedHypothesisId: string
}

export type VerifyClaimResult =
  | {
      readonly ok: true
      readonly result: VerificationResult
    }
  | {
      readonly ok: false
      readonly error: HypothesisMismatchError
    }

export function verifyClaim(
  claim: ClaimSubmission,
  hypothesis: HypothesisDefinition,
): VerifyClaimResult {
  if (hypothesis.id !== claim.hypothesisId) {
    return {
      ok: false,
      error: {
        code: 'HYPOTHESIS_MISMATCH',
        claimHypothesisId: claim.hypothesisId,
        providedHypothesisId: hypothesis.id,
      },
    }
  }

  let supportingCount = 0

  for (const evidenceId of claim.evidenceIds) {
    const relation = getEvidenceRelation(hypothesis, evidenceId)

    if (relation === 'conflicting') {
      return { ok: true, result: 'conflicting-evidence' }
    }

    if (relation === 'supporting') {
      supportingCount += 1
    }
  }

  if (supportingCount >= 2) {
    return { ok: true, result: 'supported' }
  }

  if (supportingCount === 1) {
    return { ok: true, result: 'partially-supported' }
  }

  return { ok: true, result: 'insufficient-evidence' }
}
