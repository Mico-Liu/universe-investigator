# AEGF Architecture Design Freeze V1

## Record

- Design Freeze: `AEGF-ARCHITECTURE-V1`
- Status: `APPROVED`
- Architecture review: `APPROVE_WITH_REQUIRED_FIXES`
- Focused verification: all HIGH and MEDIUM findings closed
- Cross-contract consistency: `PASS`
- INFRA-001A / INFRA-001B boundary: `PASS`
- Approved on: 2026-09-01

## Frozen Modules

- [Framework layers and runtime repository IA](core/GOVERNANCE_FRAMEWORK_OVERVIEW.md)
- [Canonical Task Contract V2 and cross-field rules](core/TASK_RISK_GOVERNANCE.md)
- [Architecture Impact, Pressure, NFR, and ADR contract](core/ARCHITECTURE_GOVERNANCE.md)
- [Event, Evidence, State transitions, and DONE Matrix](core/EVIDENCE_STATE_MODEL.md)
- [Capability availability, quota, fallback, wait, and resume](core/CAPABILITY_INTEGRATION_MODEL.md)
- [Deterministic Profile composition](profiles/ARCHITECTURE_PROFILE_MODEL.md)
- [Risk → Assurance routing and Acceptance Freeze](core/QUALITY_ASSURANCE_MODEL.md)
- [Review, retry, finding, and failure routing](core/REVIEW_RETRY_GOVERNANCE.md)
- [Timing, telemetry, KPI, and Control Plane boundaries](core/OBSERVABILITY_CONTROL_PLANE.md)
- [Human Attention policy](core/HUMAN_ATTENTION_POLICY.md)
- [INFRA-001A / INFRA-001B sequencing](ROADMAP.md)

## Deferred Capabilities

- Runtime Event/Evidence persistence activation.
- State projector and DONE evaluator activation.
- Automatic external-capability resume scheduler.
- Full Delivery and PR/CI/Merge orchestration.
- Autonomous Failure Router.
- Context Router, Change Impact Engine, and selective validation.
- Dashboard and Control Plane UI.
- Multi-agent/worktree orchestration.
- Skills and MCP integrations.
- Detailed technology Profiles.
- Reusable package extraction and cross-repository orchestration.

## Change Control

Changes to a frozen architectural contract require:

```text
Architecture Pressure / Architecture Failure
OR explicit governed architecture change
→ reassessment
→ ADR when applicable
→ new Design Freeze version
```

Formatting, link repair, and clarification may remain within V1 only when they do not change contract semantics.

## Revisit Triggers

- A measurable Architecture Pressure threshold is reached.
- A required functional or NFR objective cannot be satisfied.
- Two real project implementations expose an incompatible reuse boundary.
- Profile composition produces an unresolved conflict.
- Runtime Evidence shows systematic false routing, invalid State projection, or unsafe DONE evaluation.
- Capability, security, compliance, delivery, or persistence assumptions materially change.
