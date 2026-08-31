# TASK INFRA 001｜Agentic SDLC Foundation V1

**Status: DONE**

---

## 1. Goal

为《宇宙科学调查局》建立第一版可持续的 Agentic Software Development Lifecycle 基础设施。

目标不是构建完整的 Multi-Agent 平台。

目标是让本仓库具备：

1. 单一验证入口
2. 明确 Agent Roles
3. Machine-readable Task Dependency Metadata
4. Source-level Architecture Guard
5. 本地与 CI 一致的质量标准
6. 为后续 Codex Multi-Agent + Git Worktree 并行开发做好基础

本任务仅涉及：

**Engineering Infrastructure**

不得改变任何：

- 产品行为
- Case Runtime 行为
- Investigation Core 行为
- CASE 规则
- Scientific Logic
- Player Experience

---

## 2. Source of Truth

开始前必须完整阅读并遵循：

1. `AGENTS.md`
2. `docs/product/V6_MASTER_BLUEPRINT_FINAL.md`
3. `docs/product/V6_VERTICAL_SLICE_SPEC.md`
4. `docs/architecture/V6_ARCHITECTURE.md`
5. `README_TASKS.md`
6. `package.json`
7. `.github/workflows/ci.yml`
8. `scripts/check-package-boundaries.mjs`
9. `docs/tasks/product/TASK_004_WALKING_SKELETON.md`
10. `docs/tasks/product/TASK_005_CASE01_GREYBOX.md`

如果发现本 Task 与上位规格存在冲突：

不要自行修改产品规格。

报告冲突。

---

## 3. Core Principle

本仓库未来 Agentic Development 必须遵循：

```text
Artifact-driven
>
Conversation-driven
```

Agent 之间不得依赖非持久化聊天内容作为唯一事实来源。

事实来源必须优先为：

```text
Git
AGENTS.md
Task Contract
Code
Tests
CI Result
Architecture Rules
```

---

## 4. Scope

本任务实现以下五项能力。

### A. Unified Verification

新增统一质量入口：

```bash
pnpm verify
```

其职责至少包括：

```text
format:check
architecture checks
lint
typecheck
unit/integration tests
build
```

推荐定义：

```json
"verify": "pnpm format:check && pnpm architecture:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build"
```

不要把 Playwright E2E 默认加入 `pnpm verify`。

E2E 属于高成本验证。

保留：

```bash
pnpm e2e
```

用于：

- 用户可操作流程 Task
- Integration Gate
- CI E2E job
- 高风险变更

### B. Agent Roles

新增目录：

```text
agents/
```

至少新增：

```text
agents/BUILDER.md
agents/REVIEWER.md
agents/INTEGRATOR.md
```

#### BUILDER

职责：

```text
Read Task
Read relevant specs
Inspect code
Implement minimum requested scope
Add/update tests
Run required validation
Inspect diff
Report result
```

Builder 可以：

- 修改 Task 允许范围内的代码
- 修改对应测试
- 修改 Task 允许的基础设施

Builder 不得：

- 自己宣布最终 Integration PASS
- 擅自修改产品规则
- 擅自扩大 Task Scope
- 擅自修改 Protected Files
- 顺便重构无关代码
- 自动执行后续 Task

Builder 最终输出：

```text
BUILDER RESULT

Implementation: PASS / FAIL
Tests: PASS / FAIL
Verify: PASS / FAIL
E2E: PASS / FAIL / NOT REQUIRED
Changed Files:
Dependencies Added:
Spec Files Modified:
Known Issues:
```

#### REVIEWER

默认：

**Read-only**

职责：

```text
Compare Task against implementation
Inspect git diff
Inspect tests
Validate architecture
Validate scope
Validate frozen specs
Validate unrelated changes
```

Reviewer 不得：

- 为了让 Review 通过直接重写实现
- 自动扩大 Task
- 自己改变产品规则

Review 严重度：

```text
CRITICAL
HIGH
MEDIUM
LOW
```

最终输出：

```text
REVIEWER RESULT

CRITICAL:
HIGH:
MEDIUM:
LOW:

Scope Compliance: PASS / FAIL
Architecture: PASS / FAIL
Tests: PASS / FAIL
Frozen Specs: CLEAN / VIOLATED
Unrelated Changes: NONE / FOUND

FINAL VERDICT: PASS / FAIL
```

如果：

```text
FINAL VERDICT: FAIL
```

应交回 Builder 修复。

#### INTEGRATOR

Integrator 仅负责：

```text
latest main validation
integration validation
merge readiness
```

Integrator 不得默认修改业务实现。

职责：

```text
Confirm branch is based on latest main
Run pnpm verify
Run pnpm e2e when required
Validate architecture
Validate task contract
Inspect final diff
Confirm CI readiness
```

最终输出：

```text
INTEGRATION RESULT

Verify: PASS / FAIL
E2E: PASS / FAIL / NOT REQUIRED
Architecture: PASS / FAIL
Task Contract: PASS / FAIL
Latest Main: PASS / FAIL
Merge Ready: YES / NO
```

### C. Machine-readable Task Metadata

新增：

```text
tasks/
```

第一版只需要一个简单文件：

```text
tasks/TASKS.yaml
```

不要现在为每个 Task 创建复杂工作流系统。

最小结构：

```yaml
version: 1

tasks:
  TASK-001:
    title: Repository Bootstrap
    spec: docs/tasks/product/TASK_001_REPOSITORY_BOOTSTRAP.md
    status: DONE
    depends_on: []
    risk: medium
    parallel_safe: false

  TASK-002:
    title: Case Runtime V0
    spec: docs/tasks/product/TASK_002_CASE_RUNTIME_V0.md
    status: DONE
    depends_on:
      - TASK-001
    risk: high
    parallel_safe: false

  TASK-003:
    title: Investigation Core V0
    spec: docs/tasks/product/TASK_003_INVESTIGATION_CORE_V0.md
    status: DONE
    depends_on:
      - TASK-002
    risk: high
    parallel_safe: false

  TASK-004:
    title: Walking Skeleton
    spec: docs/tasks/product/TASK_004_WALKING_SKELETON.md
    status: READY
    depends_on:
      - TASK-003
    risk: high
    parallel_safe: false

  TASK-005:
    title: CASE01 Greybox
    spec: docs/tasks/product/TASK_005_CASE01_GREYBOX.md
    status: BLOCKED
    depends_on:
      - TASK-004
    risk: high
    parallel_safe: false
```

允许的状态第一版限定：

```text
QUEUED
BLOCKED
READY
IN_PROGRESS
REVIEW
DONE
FAILED
```

不要增加复杂调度逻辑。

本 Task 只建立：

**Dependency Metadata**

不建立自动 Scheduler。

---

## 5. Parallel Development Rule

更新 `README_TASKS.md`。

当前默认仍然：

```text
一次一个 Task
```

但允许：

```text
只有当 Task 满足以下全部条件时才可以并行：

1. status == READY
2. 所有 depends_on 已经 DONE
3. parallel_safe == true
4. 不存在明显文件所有权冲突
5. 不存在共享公共接口冲突
```

明确：

```text
READY != 必须并行
```

以及：

```text
多个 QUEUED Task 不得因为“看起来独立”自动并发执行。
```

TASK-004 与 TASK-005 当前不得并行：

```text
TASK-005 depends_on TASK-004
```

---

## 6. Source-level Architecture Guard

现有：

```text
scripts/check-package-boundaries.mjs
```

只检查 `package.json` dependency declarations。

保留该能力。

新增源码级 Architecture Guard。

建议：

```text
scripts/check-source-boundaries.mjs
```

第一版只检查明确、高价值规则。

必须检查：

### packages/core

源码不得直接 import：

```text
react
react-dom
three
@react-three/fiber
@react-three/drei
```

不得直接使用：

```text
window
document
localStorage
```

如果未来 Persistence 需要 localStorage：

必须通过 Web Adapter。

`packages/core` 本身不能直接调用。

### packages/simulation

源码不得直接 import：

```text
react
react-dom
three
@react-three/fiber
@react-three/drei
```

不得依赖：

```text
DOM
WebGL
LLM
```

### apps/web

可以依赖：

```text
core
simulation
content
React
Three/R3F
Web APIs
```

### packages/content

不得承担科学计算。

第一版不要尝试使用 LLM 判断“是不是科学计算”。

只建立明确可确定的 dependency/import 边界。

---

## 7. Architecture Check Command

增加：

```bash
pnpm architecture:check
```

建议：

```json
"architecture:check": "node scripts/check-package-boundaries.mjs && node scripts/check-source-boundaries.mjs"
```

然后：

```text
lint
```

只负责 ESLint。

推荐最终脚本概念：

```json
{
  "scripts": {
    "architecture:check": "node scripts/check-package-boundaries.mjs && node scripts/check-source-boundaries.mjs",
    "lint": "eslint . --max-warnings 0",
    "verify": "pnpm format:check && pnpm architecture:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build"
  }
}
```

具体实现必须保持：

**Cross-platform**

必须可运行于：

```text
Windows PowerShell
Linux GitHub Actions
```

不要使用依赖 bash-only 语法的实现。

优先：

```text
Node.js / ESM
```

---

## 8. GitHub Actions

修改：

```text
.github/workflows/ci.yml
```

Quality job 不再重复维护：

```text
typecheck
lint
test
build
```

改成统一：

```bash
pnpm verify
```

推荐结构：

```yaml
quality:
  ...
  - run: pnpm install --frozen-lockfile
  - run: pnpm verify
```

E2E 继续独立：

```yaml
e2e:
  ...
  - run: pnpm install --frozen-lockfile
  - run: pnpm exec playwright install --with-deps chromium
  - run: pnpm e2e
```

必须保证：

```text
Local Verification
==
CI Quality Verification
```

避免本地与 CI 规则漂移。

---

## 9. AGENTS.md Changes

不要重写现有 `AGENTS.md`。

现有内容应尽量保留。

只新增必要章节。

### Agent Roles

明确：

```text
Builder
Reviewer
Integrator
```

并指向：

```text
agents/*.md
```

### Verification Contract

规定：

任何实现型 Task 完成前：

```bash
pnpm verify
```

用户可操作流程：

```bash
pnpm e2e
```

### Multi-Agent Rule

规定：

多个 Builder 不得默认共享同一 Working Tree。

未来并行开发必须：

```text
1 Task
=
1 Branch
=
1 Isolated Worktree
=
1 Builder
```

但是：

本 Task 不需要实现自动创建 worktree 脚本。

只定义规则。

---

## 10. Files Allowed To Change

本 Task 允许修改：

```text
AGENTS.md
README_TASKS.md
package.json
.github/workflows/ci.yml
scripts/check-package-boundaries.mjs
```

允许新增：

```text
agents/BUILDER.md
agents/REVIEWER.md
agents/INTEGRATOR.md
tasks/TASKS.yaml
scripts/check-source-boundaries.mjs
docs/tasks/infra/TASK_INFRA_001_AGENTIC_SDLC_FOUNDATION.md
```

如需要测试 Architecture Guard，可以新增：

```text
scripts/*.test.*
```

但优先保持简单。

---

## 11. Protected / Forbidden Scope

本 Task 不得修改业务实现：

```text
apps/web/src/**
packages/core/src/**
packages/simulation/src/**
packages/content/src/**
```

不得修改：

```text
docs/product/V6_MASTER_BLUEPRINT_FINAL.md
docs/product/V6_VERTICAL_SLICE_SPEC.md
docs/architecture/V6_ARCHITECTURE.md
docs/tasks/product/TASK_001_REPOSITORY_BOOTSTRAP.md
docs/tasks/product/TASK_002_CASE_RUNTIME_V0.md
docs/tasks/product/TASK_003_INVESTIGATION_CORE_V0.md
docs/tasks/product/TASK_004_WALKING_SKELETON.md
docs/tasks/product/TASK_005_CASE01_GREYBOX.md
```

不得：

- 升级 Dependencies
- 增加 Agent Framework
- 增加 LangGraph
- 增加 CrewAI
- 增加 AutoGen
- 增加 Microsoft Agent Framework
- 增加数据库
- 增加 Redis
- 增加 Dashboard
- 增加自动 Merge
- 增加自动 Scheduler

---

## 12. Non-goals

本 Task 明确不实现：

```text
Automatic Task Scheduler
Automatic Codex Agent spawning
Automatic Git worktree creation
Automatic PR creation
Automatic merge queue
Automatic retry system
Model routing
Agent memory database
Agent observability dashboard
Cross-repository orchestration
```

这些属于：

**Agentic SDLC V2+**

---

## 13. Risk Model

第一版风险等级：

```text
low
medium
high
```

### LOW

示例：

- docs
- fixture
- isolated tests

通常：

```text
pnpm verify
```

### MEDIUM

示例：

- normal domain logic
- isolated UI behavior

要求：

```text
pnpm verify
Reviewer
```

### HIGH

示例：

- public interfaces
- persistence
- architecture boundaries
- scientific models
- investigation rules
- end-to-end user flow

要求：

```text
Builder
→ pnpm verify
→ relevant E2E
→ Reviewer
→ Integrator
```

TASK-004：

```text
risk: high
```

TASK-005：

```text
risk: high
```

---

## 14. Validation

本 Task 完成后必须运行：

```bash
pnpm architecture:check
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm verify
```

如果已有 E2E 基线稳定：

还运行：

```bash
pnpm e2e
```

因为本 Task 修改 CI / 研发基础设施，建议执行完整验证。

同时运行：

```bash
git diff --check
```

---

## 15. Self-review

Builder 完成实现后必须检查：

```text
1. 是否修改了业务源码
2. 是否修改了任何 Frozen Spec
3. 是否新增 Dependency
4. pnpm verify 是否真正覆盖本地 Quality Gate
5. CI 是否调用 pnpm verify
6. Architecture Guard 是否真的检查 source imports
7. TASKS.yaml 是否正确表达 TASK-004 → TASK-005 依赖
8. README_TASKS 是否不再绝对禁止未来安全并行
9. 是否引入不必要框架
10. 是否出现 Windows/Linux 不兼容脚本
```

---

## 16. Acceptance Criteria

只有全部满足才可以 PASS。

### AC-01

存在：

```bash
pnpm verify
```

并成功执行。

### AC-02

存在：

```bash
pnpm architecture:check
```

### AC-03

Architecture Guard 至少检查：

```text
packages/core
packages/simulation
```

的 source-level forbidden imports。

### AC-04

CI Quality job 使用：

```bash
pnpm verify
```

### AC-05

E2E 保持独立 CI job。

### AC-06

存在：

```text
agents/BUILDER.md
agents/REVIEWER.md
agents/INTEGRATOR.md
```

### AC-07

存在：

```text
tasks/TASKS.yaml
```

并至少正确记录：

```text
TASK-001 DONE
TASK-002 DONE
TASK-003 DONE
TASK-004 READY
TASK-005 BLOCKED
```

其中：

```text
TASK-005 depends_on TASK-004
```

### AC-08

`README_TASKS.md` 支持：

```text
显式安全并行
```

但仍禁止：

```text
Agent 未经依赖分析自动连续执行后续 Task
```

### AC-09

`AGENTS.md` 增加 Multi-Agent 与 Verification Contract，但不得破坏现有产品 / 科学治理规则。

### AC-10

无业务代码变化。

### AC-11

无新 npm dependency。

### AC-12

完整验证通过。

---

## 17. Final Report

任务结束必须输出：

```text
TASK INFRA 001 BUILDER RESULT

Implementation: PASS / FAIL
Architecture Check: PASS / FAIL
Format Check: PASS / FAIL
Lint: PASS / FAIL
Typecheck: PASS / FAIL
Tests: PASS / FAIL
Build: PASS / FAIL
Verify: PASS / FAIL
E2E: PASS / FAIL
git diff --check: PASS / FAIL

Business Source Changes: NONE / FOUND
Frozen Specs: CLEAN / MODIFIED
New Dependencies: NONE / <list>

Changed Files:
- ...

Architecture Decisions:
- ...

Known Issues:
- ...

READY FOR INDEPENDENT REVIEW: YES / NO
```

不要自行宣布：

```text
FINAL VERDICT: PASS
```

最终 PASS 由独立 Reviewer 给出。

---

## 18. Important

本 Task 的价值不以新增多少代码衡量。

目标是：

```text
让后续 TASK 更安全
让 Builder 和 Reviewer 职责清晰
让本地与 CI 标准一致
让未来 Multi-Agent 并行有明确工程约束
```

保持实现：

```text
Minimal
Deterministic
Auditable
Cross-platform
```
