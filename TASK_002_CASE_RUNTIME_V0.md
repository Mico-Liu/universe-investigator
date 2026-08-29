# TASK_002_CASE_RUNTIME_V0.md
# TASK 002｜CaseRuntime v0

**状态：QUEUED — TASK 001完成后执行**

## Goal

在`packages/core`中实现最小、确定性、可序列化的案件状态机。

## Scope

第一版状态：

```text
briefing
detecting
investigating
claiming
verifying
completed
```

实现：

- `CaseRuntimeState`
- 显式transition table
- transition function
- invalid transition result
- serialize / restore
- 全部状态转移单元测试

## Non-goals

- CASE01内容
- Evidence
- Hypothesis
- NOVA
- Save adapter
- React UI
- Three.js

## Acceptance

- 所有合法路径有测试
- 代表性非法路径有测试
- round-trip serialization通过
- `pnpm typecheck/test/build`通过
