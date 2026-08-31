# AGENTS.md
# 《宇宙科学调查局》Codex项目规则

本文件是Codex在本仓库中工作的最高工程行为规范之一。

在开始任何任务前：

必须阅读并遵循：

1. `docs/product/V6_MASTER_BLUEPRINT_FINAL.md`
2. `docs/product/V6_VERTICAL_SLICE_SPEC.md`
3. `docs/architecture/V6_ARCHITECTURE.md`
4. 当前任务相关CASE Spec
5. 当前Task描述

如果这些文档发生冲突：

优先级：

```text
V6_MASTER_BLUEPRINT_FINAL
>
V6_VERTICAL_SLICE_SPEC
>
V6_ARCHITECTURE
>
CASE SPEC
>
TASK
>
现有实现
```

---

# 1. 项目性质

这是：

# Greenfield项目。

不存在需要兼容的历史实现。

不要为了任何历史设计建立兼容层。

---

# 2. 当前唯一开发目标

当前只开发：

# Vertical Slice。

范围：

- NEXUS最小基地
- NOVA
- 玩家调查员身份
- CASE01
- CASE05
- CASE19
- 36 Knowledge Nodes
- 三类核心Simulation

禁止未经任务要求实现完整版功能。

---

# 3. 最高产品原则

开发过程中必须保护：

# FUN
好玩。

# CURIOSITY
激发“为什么”。

# AGENCY
玩家自己判断。

# SCIENCE
科学正确。

技术实现不得为了：

“架构更漂亮”

损害上述体验。

---

# 4. 产品不是课程软件

不要主动增加：

- 学科页面
- 测验
- 成绩
- 知识点完成率
- 强制学习弹窗
- 教师式提示

玩家看到的是：

# 宇宙调查。

---

# 5. NOVA不是答案机器人

NOVA可以：

- Scan
- Compare
- Reconstruct
- Simulate
- Hypothesis
- Verify
- Hint
- Explain

但不得：

# 在玩家拥有足够证据前主动泄露结论。

---

# 6. NOVA不能成为科学真源

科学真相来自：

1. 审核过的Content
2. Deterministic Simulation
3. 明确的Science Sources
4. Case Verification Rules

未来LLM仅负责：

# 语言表达。

---

# 7. 核心调查循环

正式案件必须围绕：

```text
DETECT
→ SCAN
→ EVIDENCE
→ HYPOTHESIS
→ SIMULATE
→ DECIDE
→ VERIFY
→ DEBRIEF
```

不要把案件实现成：

> 看剧情 → 选答案。

---

# 8. 科学状态

所有科学内容根据需要明确区分：

- observed
- reconstructed
- simulated
- enhanced
- hypothesis
- fiction

不要把：

Simulation

呈现成：

Observation。

---

# 9. 目录职责

## apps/web

只负责：

- React
- R3F
- Three.js
- UI
- Input
- Camera
- Audio
- FX
- Renderer

## packages/core

只负责：

- Case Runtime
- Evidence
- Hypothesis
- Claim
- Knowledge
- NOVA Policy
- Profile
- Save
- Domain Events

保持：

# Pure TypeScript。

## packages/simulation

只负责：

# Scientific Models。

保持：

# Pure TypeScript + Deterministic。

## packages/content

只负责：

- Cases
- Evidence Definitions
- Hypotheses
- Knowledge
- NOVA Dialogue
- Story
- Science Sources

---

# 10. 严格依赖边界

`packages/core`不得依赖：

- React
- Three.js
- DOM
- WebGL

`packages/simulation`不得依赖：

- React
- Three.js
- DOM
- LLM

科学计算不得存在于React组件。

---

# 11. TypeScript

要求：

# strict mode。

原则：

- 尽量不使用`any`
- 优先显式Domain Types
- 优先Discriminated Union
- 状态尽可能穷举
- 公共接口需要清晰类型

不得为了“快”大量绕过类型系统。

---

# 12. 代码设计

优先：

- 小模块
- 小函数
- 明确职责
- 可测试
- 无隐藏副作用

避免：

- 巨型Manager
- 万能Service
- 不必要BaseClass
- 过度泛型
- 过早抽象

---

# 13. 抽象规则

增加一个架构抽象之前必须回答：

> 是否至少已经存在两个真实实现需要它？

如果没有：

# 先使用简单实现。

---

# 14. 不主动增加依赖

新增npm依赖之前：

必须说明：

- 为什么需要
- 原生/已有工具为什么不足
- 对包体影响
- 对维护影响

不要为了一个小工具引入大型库。

---

# 15. React规则

React主要承担：

- Presentation
- Interaction
- Composition

禁止：

- 在组件中计算Case Truth
- 在组件中实现Hypothesis规则
- 在组件中写科学公式

---

# 16. Zustand规则

只保存：

# Web UI State。

不要复制：

CaseRuntime

领域状态。

避免：

# Two Sources of Truth。

---

# 17. Three.js规则

任何3D效果需要至少满足以下之一：

- 增强调查
- 增强科学理解
- 创造关键WOW

纯装饰性复杂效果：

优先不做。

---

# 18. 科学计算

科学模型必须：

- 有明确单位
- 尽量为纯函数
- 输入输出明确
- 可以独立单测
- 关键近似有说明

游戏表现不能偷偷改变科学结果。

---

# 19. Content规则

案件内容优先数据化。

不要让：

CASE01、CASE05、CASE19

变成三个完全不同的代码项目。

目标：

# Runtime复用，Content变化。

---

# 20. Evidence规则

禁止设计：

> 一条证据直接决定最终答案

除非现实科学本身确实如此，并经过明确评审。

CASE01尤其禁止：

# 磁性 = 陨石

这种逻辑。

---

# 21. Claim规则

正式Claim应支持：

- Conclusion
- Evidence
- Reasoning
- Uncertainty

但儿童端不得变成：

# 作业表格。

---

# 22. NOVA Hint

只支持：

## Level 0
无提示。

## Level 1
指出观察缺口。

## Level 2
建议方法。

## Level 3
帮助机械性计算或操作。

不得出现：

# 直接答案Hint。

---

# 23. Challenge NOVA

设计时必须保留玩家查看：

- 依据
- 来源
- 确定程度
- 替代解释
- 重新检查

的能力。

---

# 24. 用户体验保护

正式案件：

尽量30秒内出现异常。

新工具：

尽量3分钟内真正使用。

不要在案件开头放大段教程。

---

# 25. 文字量

优先：

# Show / Interact

而不是：

# Explain。

除非任务明确要求，不主动增加长篇知识说明。

---

# 26. 性能

默认考虑普通家庭PC。

不要假定：

高端游戏显卡。

需要：

- LOD
- Dispose
- Lazy Load
- Shader质量档
- 粒子降级

科学结果不得随画质改变。

---

# 27. 资产

Vertical Slice阶段：

优先程序化和灰盒。

正式Hero资产投入前：

必须先证明对应玩法成立。

不要主动制作：

大量背景资产。

---

# 28. 测试

任务完成前至少运行：

```bash
pnpm typecheck
pnpm test
pnpm build
```

用户可操作流程：

还需要：

```bash
pnpm e2e
```

如果测试失败：

# 不得声称任务完成。

---

# 29. 测试优先级

最高：

1. Scientific Simulation
2. Case Runtime
3. Evidence
4. Hypothesis Fit
5. Claim Verification
6. NOVA Spoiler Policy
7. Save / Restore
8. Content Integrity

UI像素级测试：

不是早期优先级。

---

# 30. CASE19剧透保护

CASE19在允许状态之前：

NOVA不得主动给出：

# “黑洞就是答案”

类似结论。

必须存在自动测试。

---

# 31. Science Sources

不得编造：

- URL
- 机构
- 论文
- 科学来源

如果任务没有提供来源：

可以：

# 留待核验状态。

不得伪造补齐。

---

# 32. Git修改纪律

一次Task只做：

# 当前任务。

不要：

- 顺便重构整个仓库
- 顺便升级全部依赖
- 顺便改变产品规则
- 顺便实现未来功能

---

# 33. 修改前

必须：

1. 阅读相关代码
2. 阅读对应规格
3. 理解现有测试
4. 确认最小修改范围

---

# 34. 产品规则冲突

如果实现发现：

现有产品规格存在无法实现或明显矛盾：

不要自行重写产品规则。

应该：

# 明确报告冲突。

等待：

Change Request。

---

# 35. Architecture Change

如果需要改变：

- framework
- package boundary
- state ownership
- persistence architecture
- NOVA truth boundary

必须记录：

# Architecture Change Request。

不得偷偷实现。

---

# 36. Codex默认任务尺度

任务应该：

- 边界明确
- 可测试
- 可以一次完整验收

避免：

> “做整个案件系统。”

优先：

> “实现CaseRuntime v0和全部状态测试。”

---

# 37. 每个Task必须明确

- Goal
- Scope
- Non-goals
- Acceptance Criteria
- Tests

如果Task缺乏必要信息：

优先根据已有规格进行最小合理实现。

不要擅自扩大范围。

---

# 38. 完成任务时必须报告

1. 做了什么
2. 修改了哪些文件
3. 测试了什么
4. 测试结果
5. 新增了哪些依赖
6. 有什么技术决策
7. 有什么已知问题
8. 是否修改任何规格文件

---

# 39. 不允许虚假完成

没有运行测试：

不得写：

> “测试已通过。”

没有真正打开页面验证：

不得写：

> “UI工作正常。”

必须明确：

# 实际验证过什么。

---

# 40. Vertical Slice Scope Guard

当前禁止主动实现：

- 完整30案
- 168节点
- 小程序
- 云后端
- 用户账号
- 实时多人
- 开放社区
- 完整观星
- 完整Creator系统
- 玩家自建案件
- 完整家长端
- 在线LLM NOVA
- 语音识别

这些全部属于：

# Backlog。

---

# 41. 项目最终标准

实现是否优秀，不以：

# 代码量

衡量。

而以：

> 玩家是否拥有了一个新的、完整、可玩的科学调查能力

衡量。

---

# 42. 最重要的一条

《宇宙科学调查局》的目标不是让玩家觉得：

> “系统告诉了我答案。”

而是：

# “这是我自己查出来的。”

---

# 43. Agent Roles

工程任务使用以下三个明确角色：

- Builder：读取Task与相关规格，检查现有实现，完成最小范围修改、测试、验证、diff检查和结果报告。详见`agents/BUILDER.md`。
- Reviewer：默认只读，独立核对Task、实现、测试、架构、范围和冻结规格。详见`agents/REVIEWER.md`。
- Integrator：只负责最新main与集成验证、CI就绪和合并准备度。详见`agents/INTEGRATOR.md`。

Builder不得自行宣布最终Integration PASS，也不得自动执行后续Task。

---

# 44. Verification Contract

任何实现型Task完成前必须运行：

```bash
pnpm verify
```

`pnpm verify`是本地与CI Quality Job共享的单一质量入口。

Windows PowerShell如果因执行策略阻止`pnpm.ps1`，使用同一安装提供的：

```powershell
pnpm.cmd verify
```

不得为此修改系统执行策略。仓库与CI的规范命令仍为`pnpm verify`。

涉及用户可操作流程、Integration Gate或高风险变更时，还必须运行：

```bash
pnpm e2e
```

不得用部分子命令通过代替完整验证通过。

---

# 45. Multi-Agent Rule

默认仍然一次执行一个Task。只有`tasks/TASKS.yaml`中的依赖、状态和`parallel_safe`允许，且不存在文件所有权或公共接口冲突时，才可显式并行。

多个Builder不得共享同一Working Tree。并行开发必须遵循：

```text
1 Task
=
1 Branch
=
1 Isolated Worktree
=
1 Builder
```

`READY`不等于必须并行。Agent不得因多个Task处于`QUEUED`或看起来独立而自行并发，也不得自动连续执行后续Task。
