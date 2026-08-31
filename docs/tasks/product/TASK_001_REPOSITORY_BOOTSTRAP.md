# TASK_001_REPOSITORY_BOOTSTRAP.md
# TASK 001｜Repository Bootstrap
## 《宇宙科学调查局》V6.1 开仓与工程骨架

**状态：READY FOR CODEX**  
**前置文档：**
1. `docs/product/V6_MASTER_BLUEPRINT_FINAL.md`
2. `docs/product/V6_VERTICAL_SLICE_SPEC.md`
3. `docs/architecture/V6_ARCHITECTURE.md`
4. `AGENTS.md`

---

# 1. 任务目标

从一个空Git仓库开始，建立《宇宙科学调查局》V6.1的最小生产级工程骨架。

本任务只证明：

> 仓库、依赖边界、基础3D渲染、测试体系和CI能够正确工作。

本任务不实现任何正式案件逻辑。

---

# 2. 任务范围

创建以下Monorepo：

```text
universe-investigator/
├─ apps/
│  └─ web/
│
├─ packages/
│  ├─ core/
│  ├─ simulation/
│  └─ content/
│
├─ docs/
│  ├─ product/
│  │  ├─ V6_MASTER_BLUEPRINT_FINAL.md
│  │  └─ V6_VERTICAL_SLICE_SPEC.md
│  ├─ architecture/
│  │  └─ V6_ARCHITECTURE.md
│  ├─ governance/
│  ├─ engineering/
│  └─ tasks/
│
├─ architecture-standards/
├─ project-governance/
├─ tasks/
├─ agents/
├─ scripts/
├─ .github/
│  └─ workflows/
│
├─ AGENTS.md
├─ README.md
├─ README_TASKS.md
├─ package.json
├─ pnpm-workspace.yaml
└─ tsconfig.base.json
```

---

# 3. 技术栈

使用互相兼容的稳定版本，并通过lockfile固定。

核心：

- Node.js
- pnpm
- Vite
- React
- TypeScript strict
- Three.js
- `@react-three/fiber`
- `@react-three/drei`
- Zustand
- Zod
- Vitest
- Playwright

工具：

- ESLint
- Prettier
- GitHub Actions

不要主动加入：

- Next.js
- XState
- Tailwind（除非后续任务明确需要）
- 后端框架
- 数据库
- 在线AI SDK
- 游戏物理引擎
- ECS框架

---

# 4. Root Scripts

根目录必须支持：

```bash
pnpm dev
pnpm typecheck
pnpm lint
pnpm test
pnpm e2e
pnpm build
```

所有命令都从仓库根目录执行。

---

# 5. apps/web

创建可运行的Vite + React + TypeScript应用。

第一屏必须只有：

## 5.1 全屏3D空间

深色背景。

不需要正式NEXUS美术。

---

## 5.2 NOVA占位体

中心或视觉焦点处：

一个简单的发光球体或基础多层球体。

它只是：

# NOVA Placeholder

不要投入Hero Asset级别工作。

---

## 5.3 HUD

至少显示：

```text
NEXUS
SYSTEM ONLINE
```

可以额外显示：

```text
VERTICAL SLICE / BOOTSTRAP
```

但不要加入正式案件入口。

---

# 6. packages/core

建立纯TypeScript Package。

至少创建：

```text
packages/core/
├─ src/
│  └─ index.ts
├─ package.json
└─ tsconfig.json
```

当前只需要一个非常简单的导出，例如：

```ts
export const CORE_VERSION = '0.0.1'
```

它的意义是验证：

> Web可以正常依赖Core。

禁止依赖：

- React
- Three.js
- DOM
- Web APIs

---

# 7. packages/simulation

建立纯TypeScript Package。

至少创建：

```text
packages/simulation/
├─ src/
│  └─ index.ts
├─ package.json
└─ tsconfig.json
```

当前可提供一个最小纯函数作为编译/测试验证：

```ts
export function clamp01(value: number): number
```

不要在本任务实现真实科学模型。

禁止依赖：

- React
- Three.js
- DOM
- 浏览器API

---

# 8. packages/content

建立Content Package。

创建：

```text
packages/content/
├─ src/
│  ├─ schemas/
│  └─ index.ts
├─ package.json
└─ tsconfig.json
```

至少使用Zod建立一个最简单的：

```ts
ProjectMetadataSchema
```

例如：

```ts
{
  id: string
  version: string
}
```

目的只是验证：

# Content runtime validation

链路成立。

不要建立正式CaseDefinition。

---

# 9. TypeScript

仓库使用：

# strict mode

至少启用：

- `strict`
- `noUncheckedIndexedAccess`
- `noImplicitOverride`
- `forceConsistentCasingInFileNames`

是否启用其他严格选项：

根据兼容性合理决定。

---

# 10. Workspace边界

使用：

```text
workspace:*
```

连接内部Packages。

例如Web对Core：

```json
"@universe-investigator/core": "workspace:*"
```

内部Package名称统一使用：

```text
@universe-investigator/core
@universe-investigator/simulation
@universe-investigator/content
```

---

# 11. 架构边界检查

至少建立一种自动检查手段，防止：

`core` 或 `simulation`

未来误引入：

- React
- Three.js

可以采用：

- ESLint restriction
- dependency-cruiser
- 自定义Node脚本
- package.json检查

优先选择：

# 最简单、低维护的实现。

不要为了这件事引入大型架构工具链。

---

# 12. Vitest

建立最小测试。

至少：

## Core

验证：

Package能够正确导入。

## Simulation

测试`clamp01`。

例如：

```text
-1 → 0
0.5 → 0.5
2 → 1
```

## Content

测试：

合法metadata通过Zod。

非法metadata被拒绝。

---

# 13. Playwright

建立一个Chromium Smoke Test。

测试：

1. 启动Web；
2. 打开首页；
3. 页面出现：
   `NEXUS`
4. 页面出现：
   `SYSTEM ONLINE`
5. Canvas / WebGL区域存在。

不需要：

视觉截图比较。

---

# 14. GitHub Actions

创建：

```text
.github/workflows/ci.yml
```

Pull Request和main push时至少运行：

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

E2E是否放入同一CI：

可以根据执行成本决定。

但至少提供：

- 本地可执行
- 后续容易加入CI

如果E2E已稳定，优先直接加入CI。

---

# 15. README

README只需要：

- 项目是什么
- 当前只做Vertical Slice
- 安装方式
- 常用命令
- Repository结构
- 文档入口
- 当前阶段

不要复制完整Master内容。

---

# 16. docs/

建立：

```text
docs/
└─ engineering/
   ├─ DECISIONS.md
   └─ DEVELOPMENT.md
```

---

## docs/engineering/DECISIONS.md

第一条ADR-lite：

```text
D001
V6为Greenfield项目。
使用React + R3F + Three.js。
Core与Simulation保持纯TypeScript。
```

记录：

- Date
- Decision
- Context
- Consequences

不建立复杂ADR工具。

---

## docs/engineering/DEVELOPMENT.md

记录：

- 环境要求
- 安装
- 启动
- 测试
- 构建
- 常见问题

---

# 17. apps/web状态管理

安装Zustand。

但是本任务：

# 不需要真正建立全局游戏Store。

最多建立：

简单UI设置示例。

如果没有真实需求：

甚至可以只完成依赖安装。

不要为了证明Zustand存在而制造无意义Store。

---

# 18. 视觉要求

本任务的3D只要求：

# 技术链路工作。

禁止投入时间：

- 正式Material Lab
- 正式NOVA
- Bloom大规模调参
- 黑洞
- 火星
- Spectrum Hall

可以使用：

- SphereGeometry
- 简单灯光
- 简单Environment
- 少量CSS

---

# 19. Non-goals

本任务明确不做：

- CaseRuntime
- EvidenceEngine
- HypothesisEngine
- ClaimVerification
- Save System
- CASE01
- CASE05
- CASE19
- Knowledge Graph
- NOVA Policy
- OpenAI API
- TTS
- 正式3D资产
- Blender资产
- 用户账号
- PWA
- Mini Program
- Analytics

不要“顺便”实现。

---

# 20. Acceptance Criteria

TASK 001完成必须同时满足：

## A. Install

全新Clone后：

```bash
pnpm install
```

成功。

---

## B. Dev

```bash
pnpm dev
```

成功启动。

浏览器显示：

- 深色3D画布
- NOVA占位体
- `NEXUS`
- `SYSTEM ONLINE`

---

## C. Type Safety

```bash
pnpm typecheck
```

全部通过。

---

## D. Lint

```bash
pnpm lint
```

全部通过。

---

## E. Unit Tests

```bash
pnpm test
```

全部通过。

---

## F. E2E

```bash
pnpm e2e
```

Smoke Test通过。

---

## G. Build

```bash
pnpm build
```

全部通过。

---

## H. Architecture

`core`和`simulation`：

没有React/Three.js依赖。

---

## I. CI

GitHub Actions配置存在并能运行核心质量门。

---

# 21. Codex完成任务时必须报告

使用以下格式：

```text
## 完成摘要

## 新增/修改文件

## 最终Repository Tree

## 新增依赖

## 执行的命令

## 测试结果

## 技术决策

## 已知问题

## 是否修改规格文档
```

除非发现明确冲突：

不得修改：

- Master
- Vertical Slice Spec
- Architecture
- AGENTS

---

# 22. 结束条件

TASK 001的成功标志不是：

# “写了很多基础设施。”

而是：

> 一个全新的开发者或Codex Agent可以Clone仓库、安装依赖、运行项目、看到NEXUS在线，并且全部质量门为绿色。

完成以后停止。

不要自动执行TASK 002。
