# Agentic SDLC Roadmap

## Current Baseline

```text
INFRA-001 Reliability Foundation — DONE
```

已具备 unified `pnpm verify`、architecture check、Builder/Reviewer/Integrator roles、machine task dependency metadata、CI alignment、source architecture guard、basic safe parallel rule。

## INFRA-001A — Engineering Contract & Delivery Lifecycle Hardening

目标：把存在于 Markdown、Prompt、Reviewer 经验和人工操作中的关键规则，变成结构化 Contract、机器校验、状态机和完整 Delivery Definition of Done。

范围：Task Schema/DAG/Path Guard、多维 Risk Routing、Pre-flight、Acceptance Freeze/Matrix、Finding→Regression、Review Contract、Retry Budget、Failure Classification、DoD as Code、Evidence State Machine、Delivery Automation、Capability Bootstrap、Architecture/Product/Science Assurance、Design Pressure、Human Attention。

## INFRA-002 — Context & Token Efficiency

- Context Router
- Context Budget
- Change Impact Analysis
- Selective Validation
- Test Tiering
- Deterministic-first routing
- Decision Memory / ADR
- repo/context baselines

目标：

```text
只读相关 → 只测影响 → 风险决定 review 深度 → CI 全量兜底
```

## INFRA-003 — Autonomous Quality Loop

- AI Test Planner
- Failure Router execution
- Controlled Retry
- automatic finding→regression workflow
- async CI continuation
- Human Attention Queue automation
- risk-based autonomous routing

默认预算：max builder retries=2，max review cycles=2，same-class HIGH x2=design escalation。

## INFRA-004 — Multi-Agent Orchestration

- Task Compiler
- Worktree Orchestrator
- DAG Scheduler
- Parallel Builders
- Merge Queue
- safe conflict detection
- dynamic role/model routing

原则：

```text
1 Task = 1 Branch = 1 Worktree = 1 Builder
```

暂不引入重型 Agent Framework，除非真实任务证明 DAG/persistent orchestration/cross-repo/failure recovery/human gate 复杂度需要。

## INFRA-005 — Engineering Control Plane

- dashboard
- task state visualization
- Human Attention Queue
- token/cost budget
- quality/progress/risk telemetry
- engineering memory
- architecture pressure metrics

核心 KPI：Human Interventions/Task、Tokens/Completed Task、Task Lead Time、First-pass Review Rate、Retry Rate、CI Failure After Review、Escaped Defects、Architecture Violations、Unrelated Change Rate。

## Roadmap Governance

只有当能力能降低至少一项时才优先建设：human intervention、token consumption、lead time、defect risk、architecture drift。避免为了“Agentic”而增加复杂度。
