# Architecture Governance & Pressure Contract

## Architecture Lifecycle

```text
Architecture Intent
→ Architecture Impact Assessment
→ Architecture Gate
→ ADR when required
→ Architecture Contract / Freeze when required
→ Implementation
→ Architecture Fitness Functions
→ Architecture Review
→ Architecture Pressure Detection
→ Reassessment
→ Post-change Architecture Evidence
```

## Architecture Conditions

- `ARCHITECTURE_VIOLATION`: architecture remains valid and implementation violates it. Block and fix implementation.
- `ARCHITECTURE_PRESSURE`: repeated measurable friction challenges an assumption. Stop ordinary retry and reassess.
- `ARCHITECTURE_FAILURE`: architecture cannot satisfy a required functional or NFR objective. Block delivery and require an architecture decision.

Pressure does not automatically authorize architecture change.

## Architecture Impact

```yaml
architecture_impact:
  expected_files: null
  expected_modules: []
  modules_changed: []
  public_interfaces_changed: false
  dependency_graph_changed: false
  state_ownership_changed: false
  persistence_changed: false
  data_contract_changed: false
  runtime_topology_changed: false
  security_boundary_changed: false
  architectural_exception: false
  nfr_impacts: []
```

| Minimum impact | Condition                                                                    | Route                                     |
| -------------- | ---------------------------------------------------------------------------- | ----------------------------------------- |
| `NONE`         | No architecture-relevant flag                                                | Existing fitness checks                   |
| `LOW`          | Internal change within one established boundary                              | Focused fitness evidence                  |
| `MEDIUM`       | Multiple modules or non-breaking contract/dependency change                  | Architecture review                       |
| `HIGH`         | Ownership, persistence, topology, security, or significant dependency change | Architecture pre-flight and freeze        |
| `BREAKING`     | Breaking contract, boundary redefinition, or exception                       | ADR, Architecture Gate, explicit approval |

The evaluator derives the minimum. A Task may raise but not lower it.

## Pressure Evidence

```yaml
pressure_id:
task_id:
architecture_scope:
signal_type:
policy_id:
window:
threshold:
  comparator:
  value:
  unit:
observed_value:
recurrence_count:
evidence_refs: []
severity: LOW | MEDIUM | HIGH
gate_result: PASS | PRESSURE_DETECTED | ARCHITECTURE_FAILURE_SUSPECTED
detected_at:
```

## Frozen Thresholds

| Signal                          | Default threshold                                                                     |
| ------------------------------- | ------------------------------------------------------------------------------------- |
| `SAME_CLASS_HIGH`               | Same finding key at HIGH at least twice within one contract lineage                   |
| `CROSS_TASK_MODULE_TOUCH`       | Same module changed by at least 3 unrelated Tasks within 5 completed Tasks or 30 days |
| `FILE_SCOPE_EXPANSION`          | Actual/expected file ratio ≥2 and absolute excess ≥3                                  |
| `MODULE_SCOPE_EXPANSION`        | Actual/expected module ratio ≥2 and absolute excess ≥1                                |
| `PUBLIC_API_CHURN`              | Same public contract changed in at least 3 Tasks within 5 completed Tasks or 30 days  |
| `EXCEPTION_GROWTH`              | At least 2 unresolved exceptions added within 5 Tasks or 30 days                      |
| `WORKAROUND_RECURRENCE`         | Same workaround key in at least 2 Tasks or review cycles                              |
| `UNRELATED_REGRESSION`          | At least 2 regressions tied to one architecture scope within 3 Tasks                  |
| `DUPLICATED_RULE_ACROSS_LAYERS` | Same semantic rule confirmed in at least 2 layers and 2 findings                      |
| `INTERNAL_MOCK_PRESSURE`        | Internal-mock ratio ≥30%, at least 5 mocks, repeated across 2 Tasks                   |
| `WRONG_LAYER_FINDING`           | Same responsibility key reported at least twice                                       |
| `STATE_FLOW_COMPLEXITY`         | Configured metric exceeds its absolute threshold and 150% of baseline                 |

Unavailable or unconfigured metrics produce insufficient evidence, not a guessed result.

## Gate and Reassessment

- No threshold met: `PASS`.
- Valid threshold met: `PRESSURE_DETECTED`.
- Required objective appears infeasible: `ARCHITECTURE_FAILURE_SUSPECTED`.

Both non-PASS results route to Architecture Reassessment. Frozen decisions are:

```text
KEEP_ARCHITECTURE
REFACTOR_BOUNDARY
REDESIGN_INTERFACE
SPLIT_RESPONSIBILITY
CHANGE_TASK_DESIGN
```

## NFR Evidence and ADR

NFR evidence records objective ID, metric, target, baseline, observed value, environment, method, sample count, repeat count, and evidence references. Failure suspicion requires either two comparable independent failures after implementation violations are excluded, or a validated infeasibility analysis.

ADR is required for changes to boundaries, ownership, dependency direction, public/data contracts, persistence, runtime topology, security boundary, material NFR decisions, Profile conflicts, or architecture exceptions. ADR records Context, Decision, Alternatives, Consequences, Constraints, Evidence, and Revisit Triggers.
