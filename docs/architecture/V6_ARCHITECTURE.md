# V6_ARCHITECTURE.md
# 《宇宙科学调查局》V6.1
## 单人 + Codex 技术架构规范 V1.0

**上位文档：** `docs/product/V6_MASTER_BLUEPRINT_FINAL.md`
**直接业务输入：** `docs/product/V6_VERTICAL_SLICE_SPEC.md`
**状态：** IMPLEMENTATION BASELINE

---

# 1. 架构目标

V6技术架构专门针对：

# 一个人 + Codex

优化。

优先级：

1. 易理解
2. 易测试
3. 易让Codex局部修改
4. 科学逻辑与视觉彻底分离
5. 三个案件可复用
6. 可以逐步增长
7. 不为未来假想需求过度设计

---

# 2. 技术栈

项目启动时锁定互相兼容的稳定版本。

技术方向：

- Node.js
- pnpm workspace
- Vite
- React
- TypeScript strict
- Three.js
- @react-three/fiber
- @react-three/drei
- Zustand
- Zod
- Vitest
- Playwright
- Blender
- glTF / GLB
- Git
- GitHub Actions

---

# 3. 为什么不是大型游戏引擎架构

产品核心不是：

- 复杂角色战斗
- 大规模AI NPC
- 开放世界物理
- 网络同步

核心是：

# 3D科学调查 + 数据模型 + Evidence推理。

所以选择：

# Web + Three.js生态

以降低单人开发复杂度。

---

# 4. Repository

```text
universe-investigator/
│
├── apps/
│   └── web/
│
├── packages/
│   ├── core/
│   ├── simulation/
│   └── content/
│
├── docs/
│   ├── product/
│   │   ├── V6_MASTER_BLUEPRINT_FINAL.md
│   │   └── V6_VERTICAL_SLICE_SPEC.md
│   ├── architecture/
│   │   └── V6_ARCHITECTURE.md
│   ├── governance/
│   ├── engineering/
│   └── tasks/
│
├── architecture-standards/
├── project-governance/
├── tasks/
├── agents/
├── scripts/
├── .github/
├── AGENTS.md
├── README.md
└── README_TASKS.md
```

---

# 5. apps/web

唯一正式表现层。

负责：

- React
- R3F
- Three.js
- 3D Scene
- HUD
- Input
- Camera
- Audio
- Post FX
- Visual Scientific Overlay
- localStorage adapter

允许浏览器API。

---

# 6. packages/core

纯TypeScript。

绝对禁止：

- React
- Three.js
- DOM
- WebGL

负责：

```text
case/
evidence/
hypothesis/
claim/
knowledge/
nova/
profile/
save/
events/
```

---

# 7. packages/simulation

纯TypeScript。

负责：

科学模型。

Vertical Slice优先：

```text
matter/
motion/
terrain/
gravity/
orbit/
spectrum/
lensing/
units/
math/
```

禁止：

- React
- Three.js
- UI
- LLM

---

# 8. packages/content

负责：

```text
cases/
knowledge/
dialogue/
story/
science-sources/
schemas/
```

案件主要表现为：

# 数据

而不是专用代码。

---

# 9. 依赖方向

推荐：

```text
content
  ↓
core ← simulation
  ↓
web
```

更准确地说：

`web`可以调用：

- core
- simulation
- content

`core`可以依赖：

- 自己的领域模型
- 必要的内容类型

`simulation`：

尽可能独立。

---

# 10. 最重要边界

科学公式不得存在于：

# React组件。

案件正确答案不得存在于：

# Three.js Scene。

NOVA文案不得决定：

# Case Truth。

---

# 11. Case Runtime

统一处理案件生命周期。

核心接口示意：

```ts
export type CasePhase =
  | 'briefing'
  | 'detecting'
  | 'investigating'
  | 'hypothesizing'
  | 'simulating'
  | 'claiming'
  | 'verifying'
  | 'debriefing'
  | 'completed'
```

---

# 12. CaseDefinition

建议正式结构：

```ts
export interface CaseDefinition {
  id: string
  chapterId: string
  title: string

  initialPhase: CasePhase

  objectives: ObjectiveDefinition[]
  evidenceIds: string[]
  hypothesisIds: string[]
  simulationBindings: SimulationBinding[]
  knowledgeBindings: KnowledgeBinding[]

  coreIdeaIds: string[]
  practiceIds: string[]
  crosscuttingLensIds: string[]

  hintPolicyId: string
  verifyRuleId: string

  storyBeatIds: string[]
  reflectionConfig?: ReflectionConfig

  scienceSourceIds: string[]
}
```

---

# 13. CaseRuntime状态

```ts
export interface CaseRuntimeState {
  caseId: string
  phase: CasePhase

  discoveredEvidenceIds: string[]
  inspectedEvidenceIds: string[]

  activeHypothesisIds: string[]
  rejectedHypothesisIds: string[]

  simulationHistory: SimulationRunRecord[]

  currentClaim?: ClaimSubmission

  checkpoints: string[]
}
```

必须可序列化。

---

# 14. EvidenceDefinition

```ts
export interface EvidenceDefinition {
  id: string
  caseId: string

  category: EvidenceCategory
  reliability: ReliabilityLevel
  scienceStatus: ScienceStatus

  sourceId?: string

  supports: EvidenceEffect[]
  conflicts: EvidenceEffect[]

  knowledgeNodeIds: string[]
}
```

---

# 15. Evidence Category

Vertical Slice支持：

```ts
export type EvidenceCategory =
  | 'observation'
  | 'physical-property'
  | 'composition'
  | 'structure'
  | 'motion'
  | 'signal'
  | 'environment'
  | 'context'
```

---

# 16. HypothesisDefinition

```ts
export interface HypothesisDefinition {
  id: string
  caseId: string
  title: string

  requiredEvidenceIds?: string[]
  supportingRules: HypothesisEvidenceRule[]
  conflictingRules: HypothesisEvidenceRule[]
}
```

---

# 17. Model Fit

完全确定性。

第一版输出：

```ts
export type ModelFit =
  | 'weak'
  | 'possible'
  | 'strong'
  | 'conflict'
```

不用LLM判断。

---

# 18. Claim

升级为支持CERU。

```ts
export interface ClaimSubmission {
  hypothesisId: string
  evidenceIds: string[]

  reasoningLinks?: ReasoningLink[]

  uncertaintyIds?: string[]
}
```

第一版不强制自然语言输入。

---

# 19. VerificationResult

```ts
export type VerificationResult =
  | 'supported'
  | 'partially-supported'
  | 'insufficient-evidence'
  | 'conflicting-evidence'
```

验证：

# 纯规则。

---

# 20. KnowledgeGraph

核心结构：

```ts
export interface KnowledgeNode {
  id: string
  type: KnowledgeNodeType

  title: string

  depthA: KnowledgeContent
  depthB?: KnowledgeContent
  depthC?: KnowledgeContent
  depthD?: KnowledgeContent
  frontier?: KnowledgeContent

  scienceStatus: ScienceStatus

  sourceIds: string[]
}
```

---

# 21. KnowledgeRelation

至少支持：

```ts
export type KnowledgeRelationType =
  | 'prerequisite'
  | 'explains'
  | 'evidence-for'
  | 'measured-by'
  | 'simulated-by'
  | 'contrasts-with'
  | 'misconception-of'
  | 'transfers-to'
  | 'historically-linked'
  | 'analogy-to'
  | 'creates-with'
```

---

# 22. PlayerKnowledgeState

```ts
export type KnowledgeProgress =
  | 'discovered'
  | 'understood'
  | 'applied'
  | 'transferred'
  | 'created'
```

不存：

> 87%掌握度

作为儿童核心数据。

---

# 23. Simulation架构

统一接口：

```ts
export interface ScientificSimulation<
  TConfig,
  TParameter,
  TObservation
> {
  load(config: TConfig): void

  setParameter(parameter: TParameter): void

  reset(): void

  step(dt: number): void

  getObservation(): TObservation
}
```

是否需要`play/pause`：

由Web层Simulation Controller控制。

---

# 24. 科学模型与Renderer分离

例如：

```text
GravityLensModel
↓
GravityLensController
↓
GravityLensRenderer
```

Model：

`packages/simulation`

Renderer：

`apps/web`

---

# 25. Matter Simulation

CASE01首版包括：

```text
density.ts
magnetic-response.ts
element-spectrum.ts
material-phase.ts
```

必须明确：

哪些是：

# 简化教育模型

而不是科研级仿真。

---

# 26. Planet Investigation

CASE05支持：

- position
- distance
- time
- trajectory
- terrain
- slope
- search region
- line of sight
- environment state

尽量构成：

# 可组合函数

而不是一整个Mars巨大类。

---

# 27. Compact Object

CASE19支持：

- orbital observations
- central mass estimate
- visible-light constraints
- X-ray evidence representation
- gravitational lensing approximation
- candidate comparison

科研级GR模拟：

# 不属于Vertical Slice要求。

---

# 28. ScienceStatus

统一：

```ts
export type ScienceStatus =
  | 'observed'
  | 'reconstructed'
  | 'simulated'
  | 'enhanced'
  | 'hypothesis'
  | 'fiction'
```

---

# 29. ScientificCertainty

必要时另设：

```ts
export type ScientificCertainty =
  | 'fact'
  | 'model'
  | 'hypothesis'
  | 'unknown'
```

它与ScienceStatus不是同一维度。

---

# 30. NOVA不是聊天框

核心：

# NovaOrchestrator

输入：

```ts
export interface NovaContext {
  caseId: string
  phase: CasePhase

  discoveredEvidenceIds: string[]
  activeHypothesisIds: string[]

  availableToolIds: string[]

  playerKnowledgeNodeIds: string[]

  hintLevel: 0 | 1 | 2 | 3
}
```

---

# 31. NOVA Policy

负责：

- 当前允许知道什么
- 当前禁止剧透什么
- 可以建议什么工具
- 可以展示哪些Source
- 当前可提供几级Hint
- 哪些Alternative允许出现

---

# 32. Challenge NOVA

建议API：

```ts
export type NovaChallengeAction =
  | 'show-evidence'
  | 'show-source'
  | 'show-confidence'
  | 'show-alternatives'
  | 'recheck'
```

结果仍从：

# deterministic context

产生。

---

# 33. Generative AI接口预留

未来可定义：

```ts
export interface IAIProvider {
  generate(
    request: AIRequest
  ): Promise<AIResponse>
}
```

Vertical Slice：

实现：

# Null / Offline Provider

即可。

---

# 34. 不在客户端存AI密钥

未来接入在线AI：

必须：

# Server Gateway。

客户端不出现长期API Key。

---

# 35. Event Bus

核心事件建议：

```text
CASE_STARTED
CASE_PHASE_CHANGED
TOOL_USED
EVIDENCE_DISCOVERED
EVIDENCE_INSPECTED
HYPOTHESIS_ACTIVATED
HYPOTHESIS_REJECTED
SIMULATION_RUN
CLAIM_SUBMITTED
CLAIM_VERIFIED
KNOWLEDGE_APPLIED
KNOWLEDGE_TRANSFERRED
NOVA_HINT_REQUESTED
NOVA_CHALLENGED
CASE_COMPLETED
```

用于：

- Analytics
- Replay
- Capability观察
- UI反馈

---

# 36. Investigation Replay

Replay不重新录像。

直接根据：

# Domain Events

重建关键调查过程。

这是Event Bus的重要真实用例。

---

# 37. Zustand职责

只保存Web UI状态，例如：

- 当前HUD展开
- 当前选中Evidence
- 当前科学显示层
- 音量
- UI设置

不要复制：

`CaseRuntimeState`

进Zustand形成双真源。

---

# 38. Content Schema

所有内容通过：

# TypeScript + Zod

双层验证。

例如：

```ts
export const case01 = {
  ...
} satisfies CaseDefinition
```

构建/测试阶段再：

Zod parse。

---

# 39. Content Integrity CI

CI必须发现：

- duplicate ID
- missing reference
- missing science source
- invalid hypothesis evidence
- missing knowledge binding
- unknown simulation
- unreachable case
- invalid ScienceStatus
- spoiler configuration problem

---

# 40. Science Source

正式结构：

```ts
export interface ScienceSource {
  id: string
  title: string

  organization?: string
  url?: string

  accessedAt?: string

  notes?: string
}
```

不得：

# 编造Source。

---

# 41. Save v1

首版：

# localStorage

结构至少：

```ts
export interface SaveGameV1 {
  schemaVersion: 1

  investigator: InvestigatorProfile

  caseStates: Record<string, CaseRuntimeState>

  knowledgeProgress: Record<string, KnowledgeProgress>

  discoveries: DiscoveryRecord[]

  settings: PlayerSettings
}
```

---

# 42. Save Migration

即使第一版：

也从第一天建立：

# schemaVersion。

未来升级：

显式migration。

---

# 43. Web Scene架构

建议：

```text
app/
scenes/
three/
hud/
nova/
evidence/
models/
audio/
stores/
platform/
```

保持：

Scene负责组合。

科学模型：

不放Scene。

---

# 44. Three.js / R3F

R3F主要负责：

- Scene composition
- lifecycle
- React integration

直接Three.js用于：

- Shader
- BufferGeometry
- 高性能科学可视化
- 特殊渲染

不是二选一。

---

# 45. Scientific Overlay

建立共享渲染组件体系：

- vector
- trajectory
- field line
- spectrum marker
- measurement
- grid
- region
- uncertainty
- status label

避免三个案件各写一套。

---

# 46. Asset Manifest

建议：

```ts
export interface AssetManifest {
  id: string

  ultra?: string
  high?: string
  standard?: string
  performance?: string
  mini?: string

  scientificStatus?: ScienceStatus

  license?: string
  credit?: string
}
```

---

# 47. 画质等级

至少：

### ULTRA

### STANDARD

### PERFORMANCE

视觉质量可变。

科学结果：

# 绝不可变。

---

# 48. 性能原则

优先：

- LOD
- Instancing
- Object Reuse
- Dispose
- Lazy Load
- Dynamic Quality

避免第一版过度追求：

4K everywhere。

---

# 49. 测试体系

## Unit

Vitest。

重点：

- Core
- Simulation

## Content Integrity

Vitest / build checks。

## E2E

Playwright。

重点：

- CASE流程
- Save恢复

---

# 50. P0测试对象

必须高覆盖：

- Case transitions
- Evidence
- Hypothesis fit
- Claim verification
- Matter calculations
- Motion
- Orbit
- Save
- NOVA spoiler policy

---

# 51. Architecture Boundary测试

必须防止：

`packages/core`

或：

`packages/simulation`

偷偷引入：

- React
- Three.js
- DOM

可以使用：

- ESLint restriction
- package dependency checks
- CI脚本

---

# 52. 不使用的复杂架构

Vertical Slice禁止主动加入：

- microservices
- CQRS
- Event Sourcing
- DI framework
- XState等大型状态框架
- 自研ECS
- plugin framework
- GraphQL
- 后端数据库

除非真实需求证明需要。

---

# 53. Codex友好原则

每个模块尽量：

# 小、明确、可测试。

避免：

> 一个2000行GameManager。

更偏向：

```text
case-runtime.ts
transition.ts
verification.ts
model-fit.ts
nova-policy.ts
```

---

# 54. 第一个工程目标

不是CASE01完整视觉。

而是：

# Walking Skeleton。

证明：

```text
Web
↓
Core
↓
Content
↓
Evidence
↓
Claim
↓
Save
```

全链路成立。

---

# 55. 架构验证时点

CASE01完成：

第一次验证。

CASE05完成：

第二次验证。

CASE19完成：

最终验证。

如果CASE19仍大量复用：

# Investigation Core架构成立。

---

# 56. Architecture Freeze

Vertical Slice阶段：

以下方向冻结：

- React/R3F/Three.js
- Pure TS Core
- Pure TS Simulation
- Data-driven Content
- Offline NOVA
- localStorage first
- Vitest
- Playwright
- pnpm workspace
- 单Repo
- 单Web App

重大变化：

必须提交：

# Architecture Change Request。
