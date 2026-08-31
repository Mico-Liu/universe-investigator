# Observability, Timing & Control Plane

```text
Execution → Events → Evidence → Telemetry → Control Plane → Visualization
```

Control Plane and visualization are read models only. They cannot create State, satisfy a gate, or estimate progress percentages.

## Timing Boundaries

All durations derive from paired start/end Events. Missing or contradictory boundaries produce `INCOMPLETE`, never an estimate.

Let `μ(union(intervals))` be wall-clock duration after merging overlaps.

```text
Lead Time
= TASK_QUEUED.occurred_at → TASK_DONE.occurred_at
```

For legacy streams, `TASK_READY` is the documented fallback start.

```text
Agent Active Time
= μ(union(intervals explicitly classified AGENT_ACTIVE))
```

```text
Machine Time
= μ(union(validation, build, script, CI, and machine-execution intervals))
```

```text
Human Wait Time
= μ(union(HUMAN_ATTENTION_REQUESTED → HUMAN_ATTENTION_RESOLVED intervals))
```

Overlap within one metric is counted once. Different metrics may overlap and must not be summed to reconstruct Lead Time. Parallel resources count once in wall-time metrics; optional resource-time metrics may sum per actor/capability and may exceed Lead Time.

## Stage Timing

- Queue/wait.
- Context preparation.
- Builder.
- FAST, STANDARD, and FULL validation.
- Reviewer.
- Fix loop.
- Integration.
- CI wait.
- Delivery.
- Human wait.

## KPI Definitions

```text
Human Interventions / Completed Task
= distinct resolved attention root-cause keys / DONE Tasks

End-to-End Lead Time / Completed Task
= total Lead Time / DONE Tasks

Tokens / Completed Task
= trusted token-usage Evidence / DONE Tasks

First-pass Review Rate
= Tasks without a blocking cycle-1 finding / reviewed Tasks

Retry Rate
= Tasks with RETRY_STARTED / started Tasks

CI Failure After Review
= post-review CI failures / Tasks reaching CI

Architecture Pressure Rate
= Tasks with PRESSURE_DETECTED / completed Tasks

Unrelated Change Rate
= validated unrelated changed files / all changed files
```

Runtime KPI projection and dashboard implementation are deferred.
