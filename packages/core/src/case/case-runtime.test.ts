import { describe, expect, it } from 'vitest'

import {
  CASE_RUNTIME_TRANSITIONS,
  restoreCaseRuntime,
  serializeCaseRuntime,
  transitionCaseRuntime,
  type CaseRuntimePhase,
  type CaseRuntimeState,
} from './case-runtime'

const legalTransitions = [
  ['briefing', 'detecting'],
  ['detecting', 'investigating'],
  ['investigating', 'claiming'],
  ['claiming', 'verifying'],
  ['verifying', 'completed'],
] as const satisfies readonly (readonly [CaseRuntimePhase, CaseRuntimePhase])[]

describe('CaseRuntime transitions', () => {
  it.each(legalTransitions)('allows %s -> %s', (from, to) => {
    const result = transitionCaseRuntime({ phase: from }, to)

    expect(result).toEqual({ ok: true, state: { phase: to } })
  })

  it('completes the full legal lifecycle', () => {
    let state: CaseRuntimeState = { phase: 'briefing' }

    for (const [, to] of legalTransitions) {
      const result = transitionCaseRuntime(state, to)
      expect(result.ok).toBe(true)

      if (!result.ok) {
        throw new Error('Expected the lifecycle transition to succeed.')
      }

      state = result.state
    }

    expect(state).toEqual({ phase: 'completed' })
  })

  it.each([
    ['briefing', 'investigating'],
    ['investigating', 'detecting'],
    ['claiming', 'claiming'],
    ['completed', 'briefing'],
  ] as const satisfies readonly (readonly [
    CaseRuntimePhase,
    CaseRuntimePhase,
  ])[])('rejects %s -> %s without changing state', (from, to) => {
    const state: CaseRuntimeState = { phase: from }
    const result = transitionCaseRuntime(state, to)

    expect(result).toEqual({
      ok: false,
      state,
      error: { code: 'INVALID_TRANSITION', from, to },
    })
    expect(result.state).toBe(state)
    expect(state.phase).toBe(from)
  })

  it('defines no transition after completion', () => {
    expect(CASE_RUNTIME_TRANSITIONS.completed).toEqual([])
  })
})

describe('CaseRuntime serialization', () => {
  it.each(['briefing', 'investigating', 'completed'] as const)(
    'round-trips the %s state as pure data',
    (phase) => {
      const serialized = serializeCaseRuntime({ phase })
      const transported = JSON.parse(JSON.stringify(serialized)) as unknown

      expect(restoreCaseRuntime(transported)).toEqual({
        ok: true,
        state: { phase },
      })
    },
  )

  it('continues to allow a legal transition after restore', () => {
    const restored = restoreCaseRuntime({ phase: 'claiming' })
    expect(restored.ok).toBe(true)

    if (!restored.ok) {
      throw new Error('Expected valid CaseRuntime data to restore.')
    }

    expect(transitionCaseRuntime(restored.state, 'verifying')).toEqual({
      ok: true,
      state: { phase: 'verifying' },
    })
  })

  it('continues to reject an illegal transition after restore', () => {
    const restored = restoreCaseRuntime({ phase: 'investigating' })
    expect(restored.ok).toBe(true)

    if (!restored.ok) {
      throw new Error('Expected valid CaseRuntime data to restore.')
    }

    const state = restored.state
    const result = transitionCaseRuntime(state, 'detecting')

    expect(result).toEqual({
      ok: false,
      state,
      error: {
        code: 'INVALID_TRANSITION',
        from: 'investigating',
        to: 'detecting',
      },
    })
    expect(result.state).toBe(state)
    expect(state.phase).toBe('investigating')
  })

  it.each([
    null,
    {},
    { phase: 123 },
    { phase: 'hypothesizing' },
    { phase: 'briefing', unexpected: true },
  ])('rejects invalid restore data without creating a runtime', (data) => {
    expect(restoreCaseRuntime(data)).toEqual({
      ok: false,
      error: {
        code: 'INVALID_CASE_RUNTIME_DATA',
        message: 'CaseRuntime data must contain exactly one valid phase.',
      },
    })
  })
})
