# Review, Retry & Failure Routing

## Review Contract

HIGH-risk Tasks follow:

```text
Pre-flight → Acceptance Matrix → Freeze → Implementation → Review
```

Reviewer stages are Contract Review and Risk Review.

Finding taxonomy:

- `CONTRACT_VIOLATION`: blocking.
- `NEW_REGRESSION`: blocking.
- `DESIGN_DEFECT`: blocking; unfreeze and reassess.
- `HARDENING_OPPORTUNITY`: non-blocking unless contracted.
- `OUT_OF_SCOPE`: non-blocking.

Testable correctness findings follow `Finding → Regression → RED → Fix → GREEN`.

## Retry Contract

```yaml
max_builder_retries: 2
max_review_cycles: 2
same_class_high_escalates: true
```

Same-class HIGH at least twice stops blind retry and routes to Design/Architecture Reassessment.

## Failure → Action Matrix

| Failure class         | Default action                                              |             Blocking | Human boundary                           |
| --------------------- | ----------------------------------------------------------- | -------------------: | ---------------------------------------- |
| `FORMAT`              | Deterministic format once, then Builder retry               |                  Yes | Repeated tool failure only               |
| `LINT`                | Builder fix and focused rerun                               |                  Yes | No                                       |
| `TYPECHECK`           | Builder fix and affected validation                         |                  Yes | Specification/design conflict            |
| `UNIT_TEST`           | Confirm regression, fix, rerun                              |                  Yes | No                                       |
| `INTEGRATION_TEST`    | Classify contract/environment/implementation, bounded retry |                  Yes | Design/spec conflict                     |
| `E2E`                 | Classify environment versus product/implementation          |                  Yes | Product ambiguity or unsafe environment  |
| `ARCHITECTURE`        | Classify violation, pressure, or failure suspicion          |                  Yes | Required reassessment decision           |
| `PATH_POLICY`         | Stop unauthorized change or validate exception              |                  Yes | Scope expansion/exception                |
| `DOC_REFERENCE`       | Repair reference and rerun                                  |                  Yes | Conflicting authority only               |
| `REVIEW_FINDING`      | Apply finding taxonomy                                      |              Depends | Design defect/required decision          |
| `CI_INFRA`            | Bounded retry, then capability wait/fallback                | Yes while unresolved | Terminal infrastructure/permission issue |
| `SPEC_CONFLICT`       | Stop implementation                                         |                  Yes | Always                                   |
| `DESIGN_DEFECT`       | Unfreeze, revise, re-review, refreeze                       |                  Yes | Material design decision                 |
| `PRODUCT_CONFLICT`    | Product reassessment                                        |                  Yes | Product decision                         |
| `SCIENCE_AMBIGUITY`   | Science assurance/reassessment                              |                  Yes | Unresolved domain decision               |
| `DEPENDENCY_CONFLICT` | Block and resolve DAG/version/ownership                     |                  Yes | Material scope/architecture decision     |
| `CAPABILITY_LIMIT`    | Fallback or `WAITING_EXTERNAL_CAPABILITY`                   |   Yes while required | Permission, no recovery, unsafe fallback |

INFRA-001A validates this taxonomy and routing contract. Autonomous failure routing remains deferred.
