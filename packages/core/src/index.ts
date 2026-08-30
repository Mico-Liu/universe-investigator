export const CORE_VERSION = '0.0.1'

export {
  CASE_RUNTIME_PHASES,
  CASE_RUNTIME_TRANSITIONS,
  restoreCaseRuntime,
  serializeCaseRuntime,
  transitionCaseRuntime,
  type CaseRuntimePhase,
  type CaseRuntimeState,
  type InvalidCaseRuntimeDataError,
  type InvalidTransitionError,
  type RestoreCaseRuntimeResult,
  type SerializedCaseRuntimeState,
  type TransitionResult,
} from './case/case-runtime'

export {
  submitClaim,
  verifyClaim,
  type ClaimSubmission,
  type ClaimSubmissionError,
  type HypothesisMismatchError,
  type SubmitClaimResult,
  type VerificationResult,
  type VerifyClaimResult,
} from './claim/claim'

export {
  createEvidenceRuntimeState,
  discoverEvidence,
  type DiscoverEvidenceResult,
  type EvidenceCategory,
  type EvidenceDefinition,
  type EvidenceRuntimeState,
  type UnknownEvidenceError,
} from './evidence/evidence'

export {
  calculateModelFit,
  getEvidenceRelation,
  validateHypothesisDefinition,
  type AmbiguousEvidenceRelationError,
  type EvidenceRelation,
  type HypothesisDefinition,
  type HypothesisDefinitionValidationResult,
  type ModelFit,
} from './hypothesis/hypothesis'
