# Deterministic Profile Composition Model

## Effective Contract

```text
Generic Kernel
→ Architecture Profiles
→ Assurance Profiles
→ Project Profile
→ Task-specific governed overrides
```

A reusable Profile declares stable identity, version, applicability, requirements, conflicts, constraints, fitness functions, assurance requirements, Evidence requirements, and registered extensions.

## Merge Rules

| Value class                             | Composition rule                                       |
| --------------------------------------- | ------------------------------------------------------ |
| Required assurance, Evidence, and gates | Additive union                                         |
| Protected paths and prohibitions        | Additive union                                         |
| Allowed paths                           | Intersection with higher-level permitted scope         |
| Risk, validation, and review minimums   | Highest applicable floor                               |
| Retry, time, and cost ceilings          | Lowest applicable ceiling                              |
| Fitness functions                       | Additive by stable ID                                  |
| Descriptive metadata                    | Most-specific replaceable value                        |
| Provider/default-branch bindings        | Project-replaceable only when Kernel marks replaceable |
| Task requirements                       | Add or tighten only                                    |

Task-specific overrides may tighten governance. They must not silently weaken a mandatory higher-level constraint.

## Conflict Detection

Composition fails with `COMPOSITION_FAILED` when:

- One stable constraint ID has incompatible definitions.
- One Profile requires behavior another prohibits.
- A selected Profile dependency is missing.
- A Project binding violates a non-weakenable constraint.
- A Task lowers a floor, raises a ceiling, enlarges allowed scope, removes protected scope, or disables mandatory assurance.

Weakening requires a governed exception containing the target constraint ID, requested weakening, justification, approving authority, Evidence, expiry/revisit trigger, and any required ADR or Human Gate.

No implicit technology detection changes authority. Profile order cannot silently change meaning. A generic policy language or arbitrary expression evaluator is out of scope.

## Architecture Standards Extension

Future composable examples may include `frontend/react`, `backend/java-spring`, `integration/rest`, or `data/postgresql`. INFRA-001A implements composition contracts and the current Project adapter only; it does not create detailed technology Profiles.
