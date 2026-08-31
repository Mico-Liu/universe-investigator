# Agentic SDLC Operating Model

## 1. Purpose

建立可持续、可审计、低人工介入的 Agentic Software Development Lifecycle。

目标不是最大化 Agent 数量，而是最大化：

```text
Correctness × Delivery Reliability × Human Leverage × Engineering Throughput
```

## 2. Core Principles

### Artifact-driven > Conversation-driven

事实优先来自 Git、Task Contract、Engineering Contract、Code、Tests、CI、Review Evidence、Architecture Rules、Product Specs、Science Sources。Prompt 只承载当前执行意图，不承载长期规则。

### Deterministic-first

机器能确定的事情，不交给 LLM 判断，包括：changed files、path policy、DAG、test/CI result、merge state、task status eligibility、acceptance completeness。

LLM 优先用于：architecture semantics、product reasoning、science reasoning、non-trivial review、design trade-offs。

### Baseline Once, Validate Incrementally

稳定能力与稳定假设不应每 Task 全量重验。

```text
BOOTSTRAP → READY → NORMAL USE → CHANGE / FAILURE / EXPIRY / RISK ESCALATION → REVALIDATE
```

适用于 toolchain、GitHub delivery capability、repo baseline、architecture baseline、CI workflow capability、Playwright runtime。

### Risk-triggered Assurance

Task 应逐步支持多维风险：

```yaml
risk:
  engineering: low | medium | high
  architecture: low | medium | high
  product: none | low | medium | high
  science: none | low | medium | high
  delivery: low | medium | high
```

## 3. Roles

### Builder

负责读取 validated task/context、检查 affected code、最小范围实现、测试、required validation、diff 与证据。不得自宣最终 PASS、擅自扩大 Scope、修改 Product Rule/Protected Files、顺便重构无关区域或跳过 gate。

### Reviewer

默认只读，采用两阶段：

```text
Stage 1 — Contract Review
Stage 2 — Risk Review
```

Finding 必须分类：

```text
CONTRACT_VIOLATION
NEW_REGRESSION
DESIGN_DEFECT
HARDENING_OPPORTUNITY
OUT_OF_SCOPE
```

### Integrator / Delivery Integrator

职责覆盖：

```text
integration validation → commit → push → PR → CI observation → merge gate → merge → main verification → cleanup → task finalization
```

不得默认修改业务实现。

## 4. Task State Machine

建议状态：

```text
QUEUED
BLOCKED
READY
IN_PROGRESS
REVIEW
INTEGRATING
PR_OPEN
CI_RUNNING
MERGE_READY
MERGED
CLEANUP
DONE
FAILED
HUMAN_ATTENTION
```

状态必须基于证据，不基于 Agent 自述。

## 5. Risk Routing

### LOW

```text
Builder → required validation → Delivery
```

### MEDIUM

```text
Builder → Reviewer → required validation → Delivery
```

### HIGH

```text
Pre-flight / Contract Freeze → Builder → Adversarial Tests → Reviewer → Integrator → Human Gate when required → Delivery
```

## 6. Parallelism

默认串行。并行仅在：READY、所有依赖 DONE、parallel_safe=true、无文件/公共接口/schema 冲突时允许。

```text
1 Task = 1 Branch = 1 Isolated Worktree = 1 Builder
```

## 7. Task Granularity

一个 Task 应有明确 capability，通常限制在 1–2 个主要 package，可独立验证，Reviewer 可在合理时间内理解。若简单需求异常跨 package/public API，应触发 Design Pressure。

## 8. Definition of Done

Agent 不允许直接把 Task 设置为 DONE。DONE 应由机器规则计算：

```text
dependencies DONE
AND implementation complete
AND path policy PASS
AND architecture checks PASS
AND required tests PASS
AND verify PASS
AND required review PASS
AND required integration PASS
AND PR exists
AND required CI PASS
AND merged
AND main verified
AND cleanup complete
AND no blocking findings
```

## 9. Human Role

人默认负责 WHAT/WHY/Scope、真实歧义、架构/产品/科学决策与明确 human gate，不负责复制 Prompt、手工开 PR、等 CI、merge、删 branch。
