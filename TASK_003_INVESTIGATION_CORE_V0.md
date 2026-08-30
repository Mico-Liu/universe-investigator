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
```

本任务中的 `2+ supporting → strong / supported` 是 Investigation Core v0 的通用计数规则，不等于 CASE01 后续的正式 Claim sufficiency policy。

本任务不得提前实现或硬编码 CASE01 的：

- `≥3 Evidence`
- `≥2 Evidence categories`
- discriminating evidence requirement

这些规则属于后续 CASE-specific policy，必须由真实案件任务另行实现。

---

## Scope

只在 `packages/core` 中实现：

- Evidence definition
- Evidence runtime discovery state
- Hypothesis definition
- Evidence 与 Hypothesis 的关系
- Model Fit
- Claim submission validation
- Claim Verification
- 对应的纯虚构单元测试

所有逻辑必须确定性、可复用、可独立测试。

---

## Evidence

### EvidenceDefinition

至少包含：

- `id`
- `category`

Evidence Category 使用冻结规格规定的恰好 8 类标识：

```text
observation
physical-property
composition
structure
motion
signal
environment
context
```

这些标识是跨案件的数据契约。`packages/core` 只保存和传递 category，不解释其科学含义。

### Evidence Runtime State

必须满足：

- 初始无 Evidence
- 合法 Evidence 可以发现
- 同一 Evidence 重复发现不重复计入
- unknown Evidence ID 返回明确失败结果
- 失败不改变当前状态
- 正常领域失败不使用异常控制流

---

## Hypothesis

`HypothesisDefinition` 至少包含：

- `id`
- `supportingEvidenceIds`
- `conflictingEvidenceIds`

一条 Evidence 对一个 Hypothesis 的关系只能是：

```text
supporting
conflicting
unrelated
```

同一个 Evidence 不得同时属于同一个 Hypothesis 的 supporting 与 conflicting 集合。无效定义必须能够被明确拒绝。

不得实现权重、概率、Bayesian inference、confidence percentage、fuzzy logic 或 LLM scoring。

---

## Model Fit

Model Fit 回答：

> 当前全部已发现 Evidence，对某个 Hypothesis 的整体适配情况如何？

输出必须恰好是：

```text
weak
possible
strong
conflict
```

确定性规则：

```text
0 supporting + 0 conflicting → weak
1 supporting + 0 conflicting → possible
2+ supporting + 0 conflicting → strong
任何 conflicting evidence   → conflict
```

`conflict` 优先级最高。Unrelated Evidence 不改变 fit。

Model Fit 必须按 Hypothesis 独立计算；同一组已发现 Evidence 可以使不同 Hypothesis 得到不同 fit。

---

## Claim

Claim 至少包含：

- `hypothesisId`
- `evidenceIds`

提交 Claim 时必须验证：

- hypothesis 存在
- 每个 evidence 存在
- 每个 evidence 已发现
- `evidenceIds` 没有重复

非法 Claim 必须返回明确失败结果，不得静默成功，不得自动替玩家加入 Evidence。

本任务不实现自然语言 Claim、Reasoning 文本或 Uncertainty 模型。

---

## Verification

Verification 回答：

> 玩家这次提交的 Claim，以及 Claim 明确引用的 Evidence，是否支持该判断？

正常科学结果必须恰好是：

```text
supported
partially-supported
insufficient-evidence
conflicting-evidence
```

确定性规则：

```text
0 supporting referenced evidence     → insufficient-evidence
1 supporting referenced evidence     → partially-supported
2+ supporting referenced evidence    → supported
任何 referenced conflicting evidence → conflicting-evidence
```

`conflicting-evidence` 优先级最高。Unrelated Evidence 不增加 supporting 数量。

Verification 必须验证目标 Hypothesis 的 identity 与 `claim.hypothesisId` 一致。Hypothesis mismatch 属于无法执行合法 Verification 的领域输入错误，必须明确失败，且不得伪装成四种科学 Verification result 之一。

---

## Model Fit 与 Verification 区别

二者必须保持独立语义：

| 机制 | 使用的 Evidence | 回答的问题 |
| --- | --- | --- |
| Model Fit | 当前全部已发现 Evidence | 整体证据与 Hypothesis 的适配情况 |
| Verification | Claim 明确引用的 Evidence | 这次玩家提交的证据链是否支持 Claim |

系统不得自动使用玩家已经发现、但 Claim 没有引用的 Evidence。

因此，某 Hypothesis 的 Model Fit 可以是 `strong`，而只引用一条 supporting Evidence 的 Claim Verification 仍然必须是 `partially-supported`。

---

## Fictional Test Case

所有 TASK 003 测试必须使用明显虚构的 fixture。

禁止使用：

- CASE01、CASE05、CASE19
- meteorite
- Mars rover
- black hole
- 正式科学数据
- 正式科学来源

fixture 至少包含 3 条 Evidence 和 2 个 Hypothesis。

至少证明一个 Hypothesis 的完整 fit 变化：

```text
无 Evidence         → weak
发现 E1 supporting  → possible
发现 E2 supporting  → strong
发现 E3 conflicting → conflict
```

另一个 Hypothesis 必须对相同 Evidence 产生不同 fit，以证明 fit 是按 Hypothesis 独立计算。

---

## Result Semantics

领域操作使用小型、明确、可判别的结果类型：

- 成功与失败必须可由类型区分
- 错误必须包含稳定的错误代码和必要上下文
- 失败不得静默产生有效领域结果
- 正常领域失败不得依赖 throw / catch
- 不建立通用 Result framework 或复杂错误继承体系

Verification 的四种字符串仅表示成功执行后的科学判断。Hypothesis mismatch 等输入错误必须使用独立失败分支，且失败分支不得包含 Verification result。

---

## Non-goals

本任务明确不实现：

- CASE01、CASE05、CASE19 正式内容
- CASE-specific Claim policy
- `≥3 Evidence` 等 CASE01 sufficiency rules
- CERU 完整系统
- Reasoning 文本或 Uncertainty 模型
- Knowledge Graph 或 Knowledge Node
- Simulation 或科学公式
- NOVA 或 Hint System
- Save adapter 或 localStorage
- Investigation Replay
- Event Bus
- 通用 repository、service locator 或 resolver framework
- XState、插件机制或在线 AI
- TASK 004 内容

---

## Architecture Boundaries

实现必须位于 `packages/core` 并保持 Pure TypeScript。

不得依赖：

- React
- Three.js
- R3F
- DOM
- Web API
- Node runtime API
- LLM

不得新增 npm 依赖，不得建立通用状态机、Event Bus 或额外架构层。

---

## Testing Requirements

### Evidence

- 初始无 Evidence
- 合法发现
- 重复发现不重复计入
- unknown Evidence 被拒绝且状态不变

### Hypothesis

- 同一 Evidence 的 supporting/conflicting 重叠定义被拒绝
- supporting、conflicting、unrelated 关系可区分

### Model Fit

- `weak`、`possible`、`strong`、`conflict`
- conflict 优先于 strong
- unrelated Evidence 不改变 fit
- 两个 Hypothesis 对相同 Evidence 可产生不同 fit

### Claim Submission

- 合法 Claim
- unknown hypothesis
- unknown evidence
- undiscovered evidence
- duplicate evidence IDs

### Verification

- `insufficient-evidence`
- `partially-supported`
- `supported`
- `conflicting-evidence`
- conflicting 优先级最高
- unrelated Evidence 不增加 supporting
- 只使用 Claim 引用的 Evidence
- 不自动使用已发现但未引用的 Evidence
- Hypothesis mismatch 时明确失败且不产生 Verification result

### Quality Gates

完成前实际运行：

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

本任务不修改 Web 用户流程，因此不要求新增或运行 E2E。不得删除、skip 或降低既有测试来使质量门通过。

---

## Acceptance

- [ ] Evidence definition 至少包含 `id` 和固定 8 类之一的 `category`
- [ ] Evidence runtime 确定性记录发现状态并拒绝 unknown ID
- [ ] 重复发现不重复计入
- [ ] Hypothesis 包含 supporting/conflicting Evidence 集合并拒绝关系重叠
- [ ] Model Fit 恰好输出 4 种批准结果并遵守确定性规则
- [ ] Claim submission 校验 hypothesis、evidence、discovery 和重复 ID
- [ ] Verification 恰好输出 4 种批准的正常科学结果
- [ ] Verification 拒绝 hypothesis mismatch 且失败时不产生科学结果
- [ ] Verification 只使用 Claim 明确引用的 Evidence
- [ ] 未提前实现任何 CASE-specific policy
- [ ] 测试 fixture 完全虚构
- [ ] `packages/core` 保持 Pure TypeScript
- [ ] 无新增依赖或额外架构层
- [ ] 全部质量门通过

---

## Frozen Specs

本任务不得修改：

- `AGENTS.md`
- `V6_MASTER_BLUEPRINT_FINAL.md`
- `V6_VERTICAL_SLICE_SPEC.md`
- `V6_ARCHITECTURE.md`

如果发现无法由本任务范围澄清解决的真实冲突，必须停止实现并提交 Change Request，不得自行修改冻结规格。

---

## Completion Report

完成后停止，不得开始 TASK 004，并报告：

1. 实现摘要
2. 修改文件
3. Evidence v0 数据结构
4. Evidence runtime state 行为
5. Hypothesis v0 数据结构
6. Model Fit 确定性规则
7. Claim submission 行为
8. Verification 确定性规则
9. Fictional test case
10. 新增测试及覆盖范围
11. typecheck 结果
12. lint 结果
13. test 结果
14. build 结果
15. 是否新增依赖
16. frozen specs 是否修改
17. 是否发现 Change Request
