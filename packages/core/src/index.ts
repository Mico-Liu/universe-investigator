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
