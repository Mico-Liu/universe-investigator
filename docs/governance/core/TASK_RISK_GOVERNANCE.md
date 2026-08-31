# Task Contract V2 & Risk Governance

This document is the canonical semantic contract for AEGF Task Contract V2. The canonical machine serialization is normalized JSON. A portable JSON Schema describes structure; deterministic validators enforce cross-field and higher-layer rules.

Runtime state is not authored in a Task Contract. State is projected from Events and Evidence according to [Evidence & State Model](EVIDENCE_STATE_MODEL.md).

## Canonical Task Contract V2

```yaml
schema_version: "2.0"

task:
  id: TASK-XXX
  title: ""
  spec: docs/tasks/...
  project_profile: universe-investigator
  depends_on: []
  parallel_safe: false
  tags: []

paths:
  allowed: []
  protected: []

risk:
  engineering: medium
  architecture: low
  product: none
  science: none
  security: none
  compliance: none
  delivery: low

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

assurance:
  additional_required: []
  not_applicable_requests: []
  evidence_requirements: []

acceptance:
  lifecycle: DRAFT
  freeze_id: null
  frozen_at: null
  frozen_digest: null
  cases: []

detection_boundary:
  in_scope: []
  out_of_scope: []

execution_budget:
  context:
    mode: affected
    max_tokens: null
  validation:
    local_minimum: FAST
    final_minimum: FULL
  review:
    depth: DERIVED
  agent_runtime_ms: null
  machine_time_ms: null
  human_wait_ms: null
  cost_units: null

retry_policy:
  max_builder_retries: 2
  max_review_cycles: 2
  same_class_high_escalates: true

delivery:
  profile: project_default
  additional_required_stages: []
  release_profile: null

completion:
  additional_required_evidence: []
  require_no_blocking_findings: true

governed_exceptions: []
extensions: {}
```

## Required, Conditional, and Default Semantics

Required author fields are `schema_version`, `task.id`, `task.title`, `task.spec`, `task.project_profile`, and `paths.allowed`.

The following become required before the associated gate:

- `acceptance.cases`, `freeze_id`, `frozen_at`, and `frozen_digest` before `FROZEN`.
- NFR objectives and evidence requirements when `architecture_impact.nfr_impacts` is not empty.
- Constraint ID, justification, authority, expiry or revisit trigger, and any required ADR for a governed exception.

Defaults are the values shown in the canonical contract. Empty collections are used for dependencies, tags, protected paths, additional assurance, detection boundaries, additional delivery stages, completion evidence, exceptions, and extensions. `parallel_safe` defaults to `false`. Retry defaults are two Builder retries, two review cycles, and same-class HIGH escalation enabled.

An Acceptance case contains:

```yaml
id:
category: functional | architecture | product | domain
scenario:
expected_result: PASS | FAIL
expected_behavior:
expected_diagnostic: null
regression_test: null
required: true
```

## Extension Rules

- Extension keys must be namespaced, for example `x-owner.feature`.
- Extensions cannot redefine a core field.
- Unknown extensions are preserved but cannot influence a gate.
- An extension affects governance only when a selected Profile registers its validation and merge semantics.
- Task extensions may tighten governance only.

## Cross-field Consistency

Validators must enforce:

1. Unique Task ID; existing, unique dependencies; no self-dependency; acyclic registry DAG.
2. Resolvable Task specification and Project Profile.
3. Repository-relative `/` paths with no traversal; protected paths take precedence.
4. Protected-path modification requires a valid governed exception.
5. Effective risk is not below a Kernel, Profile, Project, or derived-impact floor.
6. Mandatory assurance is the union of all higher-layer and calculated requirements.
7. `not_applicable_requests` cannot disable mandatory assurance.
8. `IMPLEMENTATION` or `REVIEW` requires a previously frozen Acceptance digest.
9. A changed frozen payload requires `UNFREEZE → REVISE → REFREEZE`.
10. Detection-boundary entries cannot contradict one another or higher policy.
11. Budgets cannot lower mandatory validation, review, assurance, or delivery gates.
12. Retry values are non-negative integers; Task values may lower but not raise higher-level ceilings.
13. Required delivery stages form a legal lifecycle and completion covers every effective gate.
14. `parallel_safe: true` is rejected for dependency, path, schema, interface, or ownership conflicts.
15. Governed exceptions are scoped, authorized, auditable, and time-bounded or revisit-triggered.
16. Authored runtime state, including authored `DONE`, is prohibited.

## Registry and Path Rules

The V1 registry remains `tasks/TASKS.yaml` until INFRA-001A produces and validates an equivalent normalized V2 registry. Dual registry authority is forbidden.

Path-policy evaluation is deterministic:

```text
changed files
→ allowed-path membership
→ protected-path precedence
→ governed-exception validation
→ PASS or stable diagnostics
```
