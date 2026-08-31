# Review & Retry Governance

## Review Must Verify, Not Discover the Spec

HIGH-risk Task 优先：

```text
Pre-flight
→ In-scope / Out-of-scope
→ Acceptance Matrix
→ Freeze
→ Build
```

## Reviewer Two-stage Model

```text
Stage 1 — Contract Review
Stage 2 — Risk Review
```

Finding 分类：

```text
CONTRACT_VIOLATION → BLOCK
NEW_REGRESSION → BLOCK
DESIGN_DEFECT → ESCALATE
HARDENING_OPPORTUNITY → BACKLOG
OUT_OF_SCOPE → NON-BLOCKING
```

## Finding → Regression

```text
Finding → Regression → RED → Fix → GREEN
```

## Retry Budget

```yaml
max_builder_retries: 2
max_review_cycles: 2
same_class_high_escalates: true
```

```text
same-class HIGH >= 2
→ STOP blind retry
→ Design / Architecture reassessment
```
