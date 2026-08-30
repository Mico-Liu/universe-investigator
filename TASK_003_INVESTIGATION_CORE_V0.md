# TASK_003_INVESTIGATION_CORE_V0.md

# TASK 003｜Evidence + Hypothesis + Claim v0

**状态：READY — TASK 002 已完成**

## Goal

在 `packages/core` 中建立最小、确定性、可复用、可测试的调查推理内核。

本任务建立：

- Evidence
- Hypothesis
- Model Fit
- Claim
- Verification

之间的最小关系。

本任务使用完全虚构的测试案件验证逻辑。

不得引入 CASE01、CASE05、CASE19 的正式科学数据或案件真相。

---

## 架构范围澄清

TASK 003 实现的是调查推理内核 v0，不是最终完整科学推理系统。

本任务的目的，是证明以下最小链路成立：

```text
发现 Evidence
    ↓
Evidence 改变 Hypothesis 的 Model Fit
    ↓
玩家提交 Claim
    ↓
系统根据证据确定性 Verification