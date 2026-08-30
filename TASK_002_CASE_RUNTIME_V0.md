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
```

不得增加其他顶层状态。

### 显式 transition table

合法顶层转移必须且只能是：

```text
briefing      → detecting
detecting     → investigating
investigating → claiming
claiming      → verifying
verifying     → completed
```

不得支持：

- 跳跃 transition
- backwards transition
- self-transition
- `completed` 后的 transition
- 动态注册 transition

### Transition function

实现确定性的 transition function：

- 输入当前 `CaseRuntimeState` 和目标状态
- 合法转移返回成功结果和新状态
- 非法转移返回明确失败结果
- 非法转移不得改变当前状态
- 非法转移不得静默成功

### Serialization / Restore

实现最小的 serialize / restore：

- serialization 只使用纯数据
- round-trip 后状态一致
- restore 后继续遵守同一 transition table
- restore 必须校验未知输入
- 非法恢复数据必须返回明确失败结果
- 非法恢复数据不得创建错误的 CaseRuntime

### Unit Tests

在 `packages/core` 中为上述行为建立单元测试。

---

## Non-goals

本任务明确不实现：

- `hypothesizing`、`simulating`、`debriefing` 顶层状态
- Evidence
- Hypothesis
- Claim
- Verification 业务规则
- NOVA
- CASE01 或其他案件内容
- Event Bus 或 Domain Events
- Save System、localStorage 或 Save schema
- 通用 Result framework
- 通用状态机平台
- 动态状态或 transition 注册
- XState 或其他状态机框架
- schema migration framework
- TASK 003 内容

---

## Pure TypeScript Boundaries

CaseRuntime 必须位于 `packages/core` 并保持 Pure TypeScript。

不得依赖：

- React
- Three.js
- R3F
- DOM
- Web API
- Node runtime API
- LLM

不得为了本任务新增 npm 依赖。

---

## Testing Requirements

### 全部合法 transition

必须覆盖：

```text
briefing      → detecting
detecting     → investigating
investigating → claiming
claiming      → verifying
verifying     → completed
```

### 完整合法生命周期

必须覆盖：

```text
briefing
→ detecting
→ investigating
→ claiming
→ verifying
→ completed
```

### 代表性非法 transition

至少覆盖：

```text
briefing      → investigating
investigating → detecting
claiming      → claiming
completed     → briefing
```

每个非法 transition 必须证明：

- 返回失败
- 当前状态不变

### Serialization / Restore

至少覆盖：

- `briefing` round-trip
- 中间状态 round-trip
- `completed` round-trip
- restore 后继续合法 transition
- restore 后非法 transition 仍被拒绝
- 缺失字段、未知状态、错误字段类型和额外字段等非法恢复数据被拒绝

### Quality Gates

完成前实际运行：

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

本任务不修改 Web 用户流程，因此不要求新增 E2E。

现有测试不得删除、skip 或降级来使质量门通过。

---

## Acceptance Criteria

- [ ] `CaseRuntimeState` 恰好支持 6 个批准状态
- [ ] 显式 transition table 恰好包含 5 条批准转移
- [ ] 合法转移确定性成功并产生目标状态
- [ ] 非法转移返回明确失败结果且当前状态不变
- [ ] 不存在跳跃、后退、自转移或 completed 后转移
- [ ] serialize 输出纯数据并可 round-trip
- [ ] restore 校验输入并拒绝非法数据
- [ ] restore 后仍使用同一 transition 规则
- [ ] 所有要求的单元测试存在并通过
- [ ] `packages/core` 继续满足 Pure TypeScript 边界
- [ ] 未新增依赖或超出 TASK 002 范围的抽象
- [ ] 全部质量门通过

---

## Frozen Specs

本任务不得修改：

- `AGENTS.md`
- `V6_MASTER_BLUEPRINT_FINAL.md`
- `V6_VERTICAL_SLICE_SPEC.md`
- `V6_ARCHITECTURE.md`

如果发现无法由本任务“架构范围澄清”解决的真实冲突，停止实现并提交 Change Request，不得自行改变冻结规格。

---

## Completion Report

完成后停止，不得开始 TASK 003，并报告：

1. 实现摘要
2. 修改文件
3. 6 个状态
4. transition table
5. invalid transition 行为
6. serialize / restore 设计
7. 新增测试及覆盖范围
8. typecheck 结果
9. lint 结果
10. test 结果
11. build 结果
12. 是否新增依赖
13. frozen specs 是否修改
14. 是否发现 Change Request
