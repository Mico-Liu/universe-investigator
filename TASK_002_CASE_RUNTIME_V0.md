# TASK_002_CASE_RUNTIME_V0.md

# TASK 002｜CaseRuntime v0

**状态：READY — TASK 001 已完成**

## Goal

在 `packages/core` 中实现最小、确定性、可序列化的案件状态机。

这是 CaseRuntime 的第一版基础设施，不是最终完整调查流程状态机。

---

## 架构范围澄清

本任务实现的是 CaseRuntime v0，而不是最终完整调查流程状态机。

`V6_ARCHITECTURE.md` 中出现的长期完整调查阶段包括：

- briefing
- detecting
- investigating
- hypothesizing
- simulating
- claiming
- verifying
- debriefing
- completed

TASK 002 的 CaseRuntime v0 顶层状态明确限制为：

- briefing
- detecting
- investigating
- claiming
- verifying
- completed

其中：

- hypothesizing
- simulating
- debriefing

在本任务中不得实现为新的顶层 CaseRuntime 状态。

它们在当前阶段视为后续能力、领域动作、事件或子流程。

只有当后续真实 Case 用例证明需要独立生命周期语义时，才通过新的 Task / Change Request 将其提升为顶层状态。

因此，TASK 002 实现 6 状态 CaseRuntime v0 与 `V6_ARCHITECTURE.md` 的长期模型并不冲突；这是明确的阶段性范围收缩。

本任务不得为了“提前兼容未来”增加额外状态、通用状态机框架、插件机制或额外抽象层。

---

## Scope

### CaseRuntimeState

CaseRuntime v0 顶层状态必须恰好包含以下 6 个状态：

```text
briefing
detecting
investigating
claiming
verifying
completed