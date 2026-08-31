# INFRA-001A — Agentic Governance Contracts & Deterministic Foundation V1

**Status:** READY
**Acceptance lifecycle:** FROZEN
**Architecture pre-flight:** SATISFIED by `AEGF-ARCHITECTURE-V1`

## 1. Goal

Implement the bounded deterministic contract foundation approved by [AEGF Architecture Design Freeze V1](../../governance/AEGF_DESIGN_FREEZE_V1.md). This Task makes the contracts executable and testable; it does not activate runtime governance engines.

## 2. Source of Truth

1. `AGENTS.md`
2. `docs/governance/AEGF_DESIGN_FREEZE_V1.md`
3. `docs/governance/core/TASK_RISK_GOVERNANCE.md`
4. `docs/governance/core/ARCHITECTURE_GOVERNANCE.md`
5. `docs/governance/core/EVIDENCE_STATE_MODEL.md`
6. `docs/governance/core/CAPABILITY_INTEGRATION_MODEL.md`
7. `docs/governance/profiles/ARCHITECTURE_PROFILE_MODEL.md`
8. `docs/governance/core/QUALITY_ASSURANCE_MODEL.md`
9. `docs/governance/core/REVIEW_RETRY_GOVERNANCE.md`
10. `docs/governance/core/OBSERVABILITY_CONTROL_PLANE.md`
11. `docs/governance/core/HUMAN_ATTENTION_POLICY.md`
12. `docs/governance/core/GOVERNANCE_FRAMEWORK_OVERVIEW.md`
13. `project-governance/**`
14. `tasks/TASKS.yaml`

The frozen architecture must not be redesigned during implementation. A real contradiction requires `DESIGN_FREEZE_CONFLICT` and a governed reassessment.

## 3. In Scope

- Canonical machine schemas and normalization contracts.
- Task Contract V2 and Project Profile V1.
- Deterministic Profile composition.
- Multidimensional risk and mandatory Risk → Assurance routing.
- Architecture-impact derivation.
- Architecture Pressure contract and threshold validation.
- Review, retry, finding, and failure taxonomy contracts.
- Acceptance Freeze contract validation.
- Event, Evidence, Capability, Human Attention, timing, and State-transition schemas.
- Deterministic contract, DAG, path, composition, routing, impact, and cross-field validation.
- `universe-investigator` Project Profile adapter.
- Migration-equivalence validation from `tasks/TASKS.yaml`.
- Focused regression and adversarial contract tests.

## 4. Explicitly Out of Scope

- Runtime Event or Evidence persistence activation.
- State projector or DONE evaluator activation.
- Runtime KPI projection.
- Automatic capability resume scheduling.
- Full Delivery or PR/CI/Merge orchestration.
- Autonomous Failure Router execution.
- Context Router, Change Impact Engine, or selective-validation engine.
- Dashboard or Control Plane UI.
- Multi-agent scheduler or worktree orchestrator.
- Skills or MCP integrations.
- Detailed technology Architecture Profiles.
- Reusable package extraction or cross-repository orchestration.
- INFRA-001B implementation or activation.

## 5. Risk

```yaml
risk:
  engineering: high
  architecture: high
  product: low
  science: low
  security: low
  compliance: none
  delivery: medium
```

Architecture HIGH pre-flight is satisfied by the approved V1 freeze. Implementation still requires architecture-contract regression tests and independent review. Product and science risk are LOW because the adapter references their governance modules while their semantics remain protected.

## 6. Architecture Impact

```yaml
architecture_impact:
  modules_changed:
    - governance contracts
    - task registry/contracts
    - deterministic governance tooling
    - current Project Profile adapter
  public_interfaces_changed: true
  dependency_graph_changed: false
  state_ownership_changed: false
  persistence_changed: false
  data_contract_changed: true
  runtime_topology_changed: false
  security_boundary_changed: false
  architectural_exception: false
```

This Task defines public governance and data contracts but does not activate runtime ownership or persistence.

## 7. Allowed Paths

```text
governance/**
tasks/**
scripts/governance/**
docs/governance/**
docs/tasks/infra/TASK_INFRA_001A_AGENTIC_GOVERNANCE_CONTRACTS_V1.md
project-governance/**
package.json
tsconfig.tools.json
vitest.config.ts
```

Only paths actually required by implementation may change.

## 8. Protected Paths

```text
apps/web/src/**
packages/core/src/**
packages/simulation/src/**
packages/content/src/**
docs/product/**
docs/architecture/**
docs/tasks/product/**
agents/**
.github/**
scripts/check-package-boundaries.mjs
scripts/check-source-boundaries.mjs
scripts/architecture-boundaries.test.ts
scripts/check-source-boundaries.test.ts
pnpm-lock.yaml
pnpm-workspace.yaml
```

No governed exception is pre-approved. Any required protected-path change stops implementation and requires review of the Task Contract.

## 9. Project and Registry Boundary

`tasks/TASKS.yaml` remains the sole machine task authority throughout INFRA-001A. The Task may generate a normalized V2 registry and equivalence report, but neither becomes authoritative during this Task.

Cutover to `tasks/registry.json` requires deterministic equivalence, an approved cutover gate, updated references, and absence of dual authority. Runtime State activation remains INFRA-001B.

## 10. Acceptance Freeze Identity

- Freeze ID: `INFRA-001A-ACCEPTANCE-V1`
- Digest algorithm: `SHA-256`
- Digest: `2a1757882fe25d5c5d39dcacc92da65c128faa202fa13659131862ee57f18c2d`
- Canonicalization: capture the text strictly between the payload markers, excluding the marker lines; normalize line endings to LF; encode as UTF-8 without BOM; hash without trimming any captured character.

<!-- ACCEPTANCE-FREEZE-PAYLOAD-BEGIN -->
## 11. Frozen Acceptance Matrix

| Case ID | Scenario | Expected | Diagnostic | Intended regression test |
|---|---|---|---|---|
| A-01 | Complete normalized Task Contract V2 | PASS | — | `task-contract.schema.test.ts` |
| A-02 | Required Task field missing | FAIL | `AEGF_TASK_REQUIRED_FIELD` | `task-contract.schema.test.ts` |
| B-01 | Optional fields omitted | PASS with frozen defaults | — | `task-contract.defaults.test.ts` |
| B-02 | Defaulted field has invalid type | FAIL | `AEGF_TASK_FIELD_TYPE` | `task-contract.defaults.test.ts` |
| C-01 | Registered namespaced extension | PASS | — | `task-contract.extensions.test.ts` |
| C-02 | Extension shadows a core field or is unnamespaced | FAIL | `AEGF_EXTENSION_INVALID` | `task-contract.extensions.test.ts` |
| D-01 | Dependency does not exist | FAIL | `AEGF_DEPENDENCY_MISSING` | `task-dag.test.ts` |
| D-02 | Dependency graph contains a cycle | FAIL | `AEGF_DAG_CYCLE` | `task-dag.test.ts` |
| D-03 | Valid acyclic dependencies | PASS | — | `task-dag.test.ts` |
| E-01 | Path uses traversal or is outside allowed scope | FAIL | `AEGF_PATH_NOT_ALLOWED` | `path-policy.test.ts` |
| E-02 | Same path is allowed and protected | FAIL with protected precedence | `AEGF_PATH_PROTECTED` | `path-policy.test.ts` |
| F-01 | Protected change has complete approved exception | PASS | — | `governed-exception.test.ts` |
| F-02 | Protected change lacks a valid exception | FAIL | `AEGF_EXCEPTION_REQUIRED` | `governed-exception.test.ts` |
| G-01 | Task risk is below a higher-level floor | FAIL | `AEGF_RISK_BELOW_FLOOR` | `risk-assurance.test.ts` |
| G-02 | Task raises its risk | PASS | — | `risk-assurance.test.ts` |
| H-01 | Task disables calculated mandatory assurance | FAIL | `AEGF_ASSURANCE_MANDATORY` | `risk-assurance.test.ts` |
| H-02 | Risk calculation produces the required assurance union | PASS | — | `risk-assurance.test.ts` |
| I-01 | HIGH architecture-impact flag is declared with low risk | FAIL with derived HIGH | `AEGF_ARCHITECTURE_RISK_DERIVED` | `architecture-impact.test.ts` |
| I-02 | Security-boundary change omits security assurance | FAIL | `AEGF_SECURITY_ASSURANCE_REQUIRED` | `architecture-impact.test.ts` |
| J-01 | FROZEN lifecycle has valid ID, timestamp, digest, and cases | PASS | — | `acceptance-freeze.test.ts` |
| J-02 | Frozen payload changes without refreeze | FAIL | `AEGF_ACCEPTANCE_DIGEST_MISMATCH` | `acceptance-freeze.test.ts` |
| J-03 | IMPLEMENTATION starts from non-FROZEN acceptance | FAIL | `AEGF_ACCEPTANCE_NOT_FROZEN` | `acceptance-freeze.test.ts` |
| K-01 | Governed exception is complete, scoped, authorized, and current | PASS | — | `governed-exception.test.ts` |
| K-02 | Exception lacks authority, scope, expiry/revisit trigger, or required ADR | FAIL | `AEGF_EXCEPTION_INVALID` | `governed-exception.test.ts` |
| L-01 | Additive Profiles compose with stable IDs | PASS | — | `profile-composition.test.ts` |
| L-02 | Floors use maximum, ceilings use minimum, allowed paths intersect | PASS | — | `profile-composition.test.ts` |
| M-01 | Profiles define incompatible values for one constraint ID | FAIL | `AEGF_PROFILE_CONFLICT` | `profile-composition.test.ts` |
| M-02 | Selected Profile dependency is missing | FAIL | `AEGF_PROFILE_DEPENDENCY_MISSING` | `profile-composition.test.ts` |
| N-01 | Task tightens a higher constraint | PASS | — | `profile-composition.test.ts` |
| N-02 | Task silently weakens a non-weakenable constraint | FAIL | `AEGF_CONSTRAINT_WEAKENING` | `profile-composition.test.ts` |
| O-01 | Pressure observation reaches a configured threshold | PASS with `PRESSURE_DETECTED` | — | `architecture-pressure.test.ts` |
| O-02 | Required NFR failure boundary is met | PASS with `ARCHITECTURE_FAILURE_SUSPECTED` | — | `architecture-pressure.test.ts` |
| O-03 | Observation remains below all thresholds | PASS with `PASS` gate | — | `architecture-pressure.test.ts` |
| P-01 | Required pressure metric is absent/unconfigured | PASS with insufficient-evidence result; no guessed pressure | — | `architecture-pressure.test.ts` |
| Q-01 | Event has unique ID/key, monotonic sequence, valid timestamps, and digest | PASS | — | `event-contract.test.ts` |
| Q-02 | Event mutates history, duplicates identity, or breaks sequence | FAIL | `AEGF_EVENT_INVALID` | `event-contract.test.ts` |
| R-01 | Evidence has trusted producer, claim, scope, artifact URI/digest, and current result | PASS | — | `evidence-contract.test.ts` |
| R-02 | Evidence is expired, inconclusive for PASS, or lacks artifact integrity | FAIL | `AEGF_EVIDENCE_INVALID` | `evidence-contract.test.ts` |
| S-01 | Capability models independent allowance/window/weekly/credit/outage quotas | PASS | — | `capability-contract.test.ts` |
| S-02 | Required capability is unavailable with no eligible fallback | PASS with `WAITING_EXTERNAL_CAPABILITY` route | — | `capability-contract.test.ts` |
| S-03 | Fallback reduces Evidence semantics or assurance | FAIL | `AEGF_FALLBACK_INELIGIBLE` | `capability-contract.test.ts` |
| T-01 | State transition and Evidence prerequisites are legal | PASS | — | `state-transition.test.ts` |
| T-02 | Illegal transition or unsupported authored DONE | FAIL | `AEGF_STATE_TRANSITION_ILLEGAL` | `state-transition.test.ts` |
| T-03 | Recoverable and terminal failure dispositions follow the frozen contract | PASS | — | `state-transition.test.ts` |
| U-01 | Every canonical failure class maps to its frozen action | PASS | — | `failure-routing.test.ts` |
| U-02 | Unknown or incomplete failure mapping | FAIL | `AEGF_FAILURE_CLASS_UNKNOWN` | `failure-routing.test.ts` |
| V-01 | Lead, Agent, Machine, and Human Wait durations merge same-class overlaps | PASS | — | `timing-contract.test.ts` |
| V-02 | Timing boundaries are missing or contradictory | PASS with `INCOMPLETE`; no estimate | — | `timing-contract.test.ts` |
| W-01 | Normalized V2 registry is semantically equivalent to current `tasks/TASKS.yaml` | PASS | — | `registry-migration.test.ts` |
| W-02 | Task ID, dependency, status, risk, or spec differs after migration | FAIL | `AEGF_REGISTRY_NOT_EQUIVALENT` | `registry-migration.test.ts` |
| X-01 | `universe-investigator` Profile resolves canonical paths, modules, assurances, and delivery target | PASS | — | `universe-project-profile.test.ts` |
| X-02 | Project semantics leak into the Generic Kernel | FAIL | `AEGF_GENERIC_KERNEL_LEAK` | `universe-project-profile.test.ts` |
| Y-01 | Business, product, architecture, and science protected paths remain unchanged | PASS | — | `scope-regression.test.ts` |
| Y-02 | Protected semantic source changes without approved exception | FAIL | `AEGF_PATH_PROTECTED` | `scope-regression.test.ts` |
| Z-01 | Existing package/source architecture checks still pass | PASS | — | existing architecture tests |
| Z-02 | Governance implementation weakens an existing boundary | FAIL | existing architecture diagnostic | existing architecture tests |

## 12. Acceptance Completeness Contract

- Every Case ID above must map to at least one automated regression test.
- Case IDs and intended diagnostics are unique where required.
- FAIL cases assert the exact stable diagnostic.
- PASS cases assert absence of blocking diagnostics.
- A completeness meta-test compares implemented Case IDs with this frozen matrix.
<!-- ACCEPTANCE-FREEZE-PAYLOAD-END -->

## 13. Implementation Constraints

- Minimal, deterministic, auditable, cross-platform Node/TypeScript implementation.
- No new dependency without separate justification and approval.
- Do not hand-write a general YAML parser.
- Runtime schemas and validators may be added; runtime persistence/projectors/evaluators must not be activated.
- Current task status and product Task statuses must not change except through separately approved lifecycle evidence.
- No implementation-driven expansion of the frozen matrix.

## 14. Required Validation

Focused contract and adversarial tests must pass, followed by:

```powershell
pnpm.cmd architecture:check
pnpm.cmd format:check
pnpm.cmd lint
pnpm.cmd typecheck
pnpm.cmd test
pnpm.cmd build
pnpm.cmd verify
pnpm.cmd e2e
git diff --check
```

## 15. Completion Gate

Builder may report READY FOR REVIEW only when:

- All frozen Acceptance cases and the completeness meta-test pass.
- Contract, DAG, path, composition, routing, impact, pressure, and cross-field validators pass.
- Migration-equivalence validation passes without V2 cutover.
- Project Profile adapter validation passes.
- Existing architecture guards and complete repository validation pass.
- Business/product/science semantics and protected paths remain clean.
- Dependencies and CI behavior remain unchanged unless a separately approved blocker requires change.
- No runtime INFRA-001B capability is activated.

## 16. Explicit Stop Conditions

Stop for Design Freeze contradiction, required scope expansion, protected-path change, new dependency requirement, ambiguous migration equivalence, or any need to activate an explicitly deferred capability.

Implementation begins only after independent INFRA-001A pre-flight review.
