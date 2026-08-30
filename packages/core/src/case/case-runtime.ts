export const CASE_RUNTIME_PHASES = [
  'briefing',
  'detecting',
  'investigating',
  'claiming',
  'verifying',
  'completed',
] as const

export type CaseRuntimePhase = (typeof CASE_RUNTIME_PHASES)[number]

export interface CaseRuntimeState {
  readonly phase: CaseRuntimePhase
}

export const CASE_RUNTIME_TRANSITIONS = {
  briefing: ['detecting'],
  detecting: ['investigating'],
  investigating: ['claiming'],
  claiming: ['verifying'],
  verifying: ['completed'],
  completed: [],
} as const satisfies Readonly<
  Record<CaseRuntimePhase, readonly CaseRuntimePhase[]>
>

export interface InvalidTransitionError {
  readonly code: 'INVALID_TRANSITION'
  readonly from: CaseRuntimePhase
  readonly to: CaseRuntimePhase
}

export type TransitionResult =
  | {
      readonly ok: true
      readonly state: CaseRuntimeState
    }
  | {
      readonly ok: false
      readonly state: CaseRuntimeState
      readonly error: InvalidTransitionError
    }

export function transitionCaseRuntime(
  state: CaseRuntimeState,
  to: CaseRuntimePhase,
): TransitionResult {
  const allowedTransitions: readonly CaseRuntimePhase[] =
    CASE_RUNTIME_TRANSITIONS[state.phase]

  if (!allowedTransitions.includes(to)) {
    return {
      ok: false,
      state,
      error: {
        code: 'INVALID_TRANSITION',
        from: state.phase,
        to,
      },
    }
  }

  return {
    ok: true,
    state: { phase: to },
  }
}

export interface SerializedCaseRuntimeState {
  readonly phase: CaseRuntimePhase
}

export function serializeCaseRuntime(
  state: CaseRuntimeState,
): SerializedCaseRuntimeState {
  return { phase: state.phase }
}

export interface InvalidCaseRuntimeDataError {
  readonly code: 'INVALID_CASE_RUNTIME_DATA'
  readonly message: string
}

export type RestoreCaseRuntimeResult =
  | {
      readonly ok: true
      readonly state: CaseRuntimeState
    }
  | {
      readonly ok: false
      readonly error: InvalidCaseRuntimeDataError
    }

export function restoreCaseRuntime(data: unknown): RestoreCaseRuntimeResult {
  if (!isSerializedCaseRuntimeState(data)) {
    return {
      ok: false,
      error: {
        code: 'INVALID_CASE_RUNTIME_DATA',
        message: 'CaseRuntime data must contain exactly one valid phase.',
      },
    }
  }

  return {
    ok: true,
    state: { phase: data.phase },
  }
}

function isSerializedCaseRuntimeState(
  data: unknown,
): data is SerializedCaseRuntimeState {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return false
  }

  const keys = Object.keys(data)
  if (keys.length !== 1 || keys[0] !== 'phase') {
    return false
  }

  const phase = Reflect.get(data, 'phase')

  return (
    typeof phase === 'string' &&
    (CASE_RUNTIME_PHASES as readonly string[]).includes(phase)
  )
}
