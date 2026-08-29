# TASK_003_INVESTIGATION_CORE_V0.md
# TASK 003｜Evidence + Hypothesis + Claim v0

**状态：QUEUED**

## Goal

建立最小可复用调查推理内核。

## Scope

在`packages/core`中实现：

- Evidence definitions / runtime state
- Hypothesis definitions
- deterministic Model Fit
- Claim submission
- deterministic Verification

Model Fit：

```text
weak
possible
strong
conflict
```

Verification：

```text
supported
partially-supported
insufficient-evidence
conflicting-evidence
```

使用虚构测试案件验证逻辑，不引入正式CASE01科学数据。

## Non-goals

- React
- Three.js
- NOVA
- 正式科学内容
- Knowledge Graph完整实现

## Acceptance

至少有：
- 3 Evidence
- 2 Hypothesis
- Evidence逐步改变Model Fit
- 一个Claim成功
- 一个Claim因为冲突失败

全部质量门通过。
