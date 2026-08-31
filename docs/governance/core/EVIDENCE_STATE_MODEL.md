# Event, Evidence, State & DONE Contract

## Separation

```text
EVENT = immutable fact that something happened
EVIDENCE = artifact proving a claim/result
STATE = deterministic projection from Events/Evidence
TELEMETRY = measurements derived from Events/Evidence
CONTROL PLANE = visualization/read model only
```

## Event Contract

```yaml
event_id:
schema_version: '1.0'
stream_id:
task_id:
run_id:
sequence:
event_type:
occurred_at:
recorded_at:
actor:
  kind: agent | human | script | ci | external_system
  id:
capability_id: null
correlation_id:
causation_id: null
idempotency_key:
payload: {}
evidence_refs: []
corrects_event_id: null
content_digest:
```

Events are append-only. Sequence is positive and strictly increasing per stream. IDs and idempotency keys are unique. Timestamps are RFC 3339 UTC. Corrections append a new event referencing `corrects_event_id`; existing events are never edited. Namespaced Profile extensions may add event types. The digest covers the canonical event excluding the digest field.

The minimum common vocabulary includes `TASK_READY`, `TASK_STARTED`, `CONTRACT_FROZEN`, `BUILD_COMPLETED`, `VERIFY_FAILED`, `RETRY_STARTED`, `REVIEW_FAILED`, `DESIGN_PRESSURE_DETECTED`, `PR_CREATED`, `CI_PASSED`, `MERGED`, `CAPABILITY_RATE_LIMITED`, `CAPABILITY_RESUMED`, `HUMAN_ATTENTION_REQUESTED`, `HUMAN_ATTENTION_RESOLVED`, and `TASK_DONE`.

## Evidence Contract

```yaml
evidence_id:
schema_version: '1.0'
claim_type:
subject:
producer:
  kind:
  id:
captured_at:
result: PASS | FAIL | INCONCLUSIVE | NOT_APPLICABLE
scope:
artifact:
  kind:
  uri:
  digest:
  media_type:
provenance:
  command: null
  environment: null
expires_at: null
supersedes_evidence_id: null
metadata: {}
```

Evidence identifies subject, producer, scope, time, result, provenance, and artifact integrity. Large artifacts remain external through URI and digest. `INCONCLUSIVE` cannot satisfy PASS. `NOT_APPLICABLE` is valid only when the effective contract permits it. Expired Evidence is invalid for a current gate. Agent prose without a trusted artifact is not completion Evidence.

## Legal State Transitions

| From                          | Legal destination                                                                                  | Minimum prerequisite                            |
| ----------------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `QUEUED`                      | `BLOCKED`, `READY`                                                                                 | Registry/dependency evaluation                  |
| `BLOCKED`                     | `READY`, `FAILED`                                                                                  | Blockers resolved or terminal-blocker evidence  |
| `READY`                       | `IN_PROGRESS`, `BLOCKED`                                                                           | Dependencies DONE and contract valid            |
| `IN_PROGRESS`                 | `REVIEW`, `BLOCKED`, `FAILED`, `HUMAN_ATTENTION`, `WAITING_EXTERNAL_CAPABILITY`                    | Build or routing evidence                       |
| `REVIEW`                      | `IN_PROGRESS`, `INTEGRATING`, `FAILED`, `HUMAN_ATTENTION`                                          | Finding classification and retry/gate evidence  |
| `INTEGRATING`                 | `PR_OPEN`, `CI_RUNNING`, `MERGE_READY`, `FAILED`, `HUMAN_ATTENTION`, `WAITING_EXTERNAL_CAPABILITY` | Effective Delivery Profile                      |
| `PR_OPEN`                     | `CI_RUNNING`, `MERGE_READY`, `FAILED`, `HUMAN_ATTENTION`                                           | PR evidence and configured gates                |
| `CI_RUNNING`                  | `MERGE_READY`, `INTEGRATING`, `FAILED`, `WAITING_EXTERNAL_CAPABILITY`                              | CI result or classified retry                   |
| `MERGE_READY`                 | `MERGED`, `FAILED`, `HUMAN_ATTENTION`                                                              | All merge gates PASS                            |
| `MERGED`                      | `CLEANUP`, `FAILED`                                                                                | Merge and target-containment evidence           |
| `CLEANUP`                     | `DONE`, `FAILED`, `HUMAN_ATTENTION`                                                                | Required cleanup evidence                       |
| `WAITING_EXTERNAL_CAPABILITY` | Saved resumable state, `FAILED`, `HUMAN_ATTENTION`                                                 | Capability resume or terminal escalation        |
| `HUMAN_ATTENTION`             | Saved resumable state, `FAILED`                                                                    | Human decision evidence                         |
| Recoverable `FAILED`          | Saved resumable state                                                                              | Authorized retry and remaining budget           |
| Terminal `FAILED`             | `QUEUED` in a new run only                                                                         | Reopen decision and new `run_id`                |
| `DONE`                        | None                                                                                               | Terminal; follow-up requires a new Task/version |

`BLOCKED` and `WAITING_EXTERNAL_CAPABILITY` are not failures. Recoverable failure records failure class, retry count, resume state, and required next Evidence. Terminal failure prohibits retry in the current run.

## DONE Evidence Matrix

| Prerequisite           | Required Evidence                                         |
| ---------------------- | --------------------------------------------------------- |
| Contract               | `TASK_CONTRACT_VALIDATION_PASS`                           |
| Acceptance             | `ACCEPTANCE_FREEZE_VALID` when required                   |
| Dependencies           | `DEPENDENCY_STATE_PROJECTION_PASS`                        |
| Implementation         | `BUILD_COMPLETED` plus configured implementation Evidence |
| Paths                  | `PATH_POLICY_PASS`                                        |
| Architecture           | `ARCHITECTURE_GATE_PASS` or valid `NOT_APPLICABLE`        |
| Pressure               | `PRESSURE_GATE_PASS` or completed reassessment            |
| Validation             | PASS for every effective validation gate                  |
| Assurance              | PASS for every calculated module                          |
| Review                 | Required cycles complete with no blocking finding         |
| Integration            | `INTEGRATION_PASS` when required                          |
| PR and CI              | Required PR exists and required CI checks PASS            |
| Merge                  | Merge commit and target-containment Evidence              |
| Target verification    | Target SHA/tree verified                                  |
| Cleanup                | Required branch/worktree cleanup Evidence                 |
| Findings               | No unresolved blocking finding                            |
| Exceptions             | Every used exception valid and unexpired                  |
| Capability/Human gates | No unresolved required wait or blocking attention item    |

The evaluator returns `DONE`, `NOT_DONE` with missing/failed prerequisite IDs, or `INVALID_EVIDENCE`. No Agent message, Event, or authored status can independently produce DONE.

Runtime persistence, State projector activation, and DONE evaluator activation are deferred to INFRA-001B.
