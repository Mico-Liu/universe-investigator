# Quality, Risk & Assurance Routing

The Kernel understands Assurance module ID, trigger, required Evidence, result, and escalation. Profiles own semantic rules.

Standard results are `PASS`, `FAIL`, `NOT_REQUIRED`, and `INCONCLUSIVE`. `INCONCLUSIVE` cannot satisfy a gate.

## Risk Levels

```text
none | low | medium | high
```

Effective risk is the maximum of Kernel floor, selected Profiles, Project Profile, Task declaration, and derived architecture impact.

## Deterministic Routing

| Dimension    | `none`                               | `low`                       | `medium`                   | `high`                                                         |
| ------------ | ------------------------------------ | --------------------------- | -------------------------- | -------------------------------------------------------------- |
| Engineering  | Baseline contract validation         | Deterministic quality gates | Focused independent review | Pre-flight, freeze, adversarial validation, independent review |
| Architecture | Existing fitness only                | Focused fitness Evidence    | Architecture review        | Architecture pre-flight, freeze, review                        |
| Product      | Not required unless Project mandates | Project baseline checks     | Product assurance          | Product pre-flight/reassessment gate                           |
| Science      | Not required unless Project mandates | Project baseline checks     | Science assurance          | Science pre-flight and ambiguity gate                          |
| Security     | Not required unless Project mandates | Security baseline           | Security assurance         | Security gate and configured approval                          |
| Compliance   | Not required                         | Compliance baseline         | Compliance assurance       | Compliance gate/Human Gate                                     |
| Delivery     | Project baseline                     | Standard delivery Evidence  | Integration review         | Explicit merge gate and integration assurance                  |

Additional mandatory triggers:

- Security-boundary change requires security assurance.
- Architecture exception or HIGH/BREAKING impact requires architecture assurance.
- Frozen product cases require product assurance.
- Science-bearing cases require science assurance according to the Project Profile.

Calculated mandatory assurance is the union of all applicable routes. An ordinary Task cannot disable it. A `not_applicable` request is valid only when no higher trigger exists and the responsible Profile validates the reason.

## Acceptance Freeze

Acceptance lifecycle:

```text
DRAFT → PREFLIGHT_REVIEW → FROZEN → IMPLEMENTATION → REVIEW
```

A Design Defect requires:

```text
UNFREEZE → REVISE → REFREEZE
```

Frozen acceptance uses stable case IDs, scenario, expected PASS/FAIL, expected behavior or diagnostic, and intended regression test. Its identity is a digest over the canonical freeze payload. Implementation cannot silently modify that payload.

Product, science, security, compliance, performance, data, privacy, and reliability semantics remain modular and outside the Generic Kernel.
