# Efficiency Governance

Token / Context / Runtime / Validation / Human Attention 效率属于 Generic Kernel。

目标：

```text
↓ Human Intervention
↓ Lead Time
↓ Tokens
↓ Retry
↓ Machine Waste
without increasing defect risk
```

## Minimal Necessary Execution

```text
Do not give an Agent more context, validation scope, review depth, or decision responsibility than the Task actually requires.
```

## Context Budget

默认只给 current Task、相关 governance、相关 specs、affected files/tests、必要 public interfaces。

## Change Impact Analysis

```text
git diff → affected files → affected modules → affected interfaces → affected tests → validation plan
```

## Validation Tiers

```text
FAST → changed-surface checks
STANDARD → affected typecheck/tests/build
FULL → full verify + required e2e + integration
```

Local = selective；CI = authoritative full validation。

## Cost Dimensions

Agent Tokens / Agent Runtime / Machine Validation Time / Human Wait Time。
