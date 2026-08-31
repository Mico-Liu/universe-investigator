# TASK INFRA 001A｜Engineering Contract & Delivery Lifecycle Hardening

**Status: READY**

---

## 1. Goal

在 `TASK_INFRA_001` 已建立 Reliability Foundation 的基础上，完成第一版真正可执行的 Agentic SDLC Engineering Contract。

本 Task 不引入完整 Orchestrator，也不实现多 Agent 自动调度。

目标是把已经在实际 TASK-003 / INFRA-001 流程中验证出的高价值规则，从：

```text
Conversation
Prompt
Agent discipline
Manual operation
```

升级为：

```text
Repository Governance
Structured Contract
Deterministic Validator
Executable Gate
Machine Evidence
```

最终运行目标：

```text
稳定路径快
风险路径深
失败路径定向修复
重复失败触发设计反推
交付自动闭环到 DONE
```

---

## 2. Why Now

INFRA-001 实战暴露出以下系统性问题：

1. Reviewer 可能在实现后继续发现“新的验收规则”，形成规格发现型 Review。
2. 同类 HIGH finding 可反复出现，普通 Builder↔Reviewer retry 无法解决设计模型问题。
3. Acceptance Criteria 如果只是 prose，难以形成可执行边界。
4. Builder 自报 scope/frozen/path clean 不应作为最终事实来源。
5. Push 不是交付完成；PR / CI / merge / cleanup 必须纳入 Definition of Done。
6. Delivery capability 属于环境能力，应 bootstrap 后复用，而非每 Task 全量检查。
7. 架构/产品/科学假设可能本身不合理，不能只优化实现正确性。
8. 全量 context、全量验证、同深度 review 会拉长 Task Lead Time。
9. 人工介入应只发生在真正需要判断的边界。
10. 关键规则必须进入 repo，不能继续依赖聊天历史。

---

## 3. Source of Truth

必须阅读：

1. `AGENTS.md`
2. `docs/product/V6_MASTER_BLUEPRINT_FINAL.md`
3. `docs/product/V6_VERTICAL_SLICE_SPEC.md`
4. `docs/architecture/V6_ARCHITECTURE.md`
5. `README_TASKS.md`
6. `tasks/TASKS.yaml`
7. `agents/BUILDER.md`
8. `agents/REVIEWER.md`
9. `agents/INTEGRATOR.md`
10. `docs/tasks/infra/TASK_INFRA_001_AGENTIC_SDLC_FOUNDATION.md`
11. `docs/engineering/README.md`
12. `docs/engineering/AGENTIC_SDLC_OPERATING_MODEL.md`
13. `docs/engineering/REVIEW_RETRY_GOVERNANCE.md`
14. `docs/engineering/ASSURANCE_AND_DESIGN_PRESSURE.md`
15. `docs/engineering/DELIVERY_LIFECYCLE.md`
16. `docs/engineering/EFFICIENCY_AND_VALIDATION_STRATEGY.md`
17. `docs/engineering/HUMAN_ATTENTION_POLICY.md`
18. `docs/engineering/AGENTIC_SDLC_ROADMAP.md`

上位产品/架构规格优先级仍以 `AGENTS.md` 为准。

---

## 4. Core Principles

必须固化：

```text
Artifact-driven > Conversation-driven
Deterministic-first
Baseline Once, Validate Incrementally
Risk-triggered Assurance
Evidence-driven Escalation
Bounded Review / Retry
Finding → Regression
Repeated friction is evidence
Push != Delivery Complete
Agent cannot self-declare DONE
```

---

## 5. Scope A — Task Schema Contract

升级 `tasks/TASKS.yaml` schema，至少支持：

```yaml
version: 2

defaults:
  retry:
    max_builder_retries: 2
    max_review_cycles: 2
    same_class_high_escalates: true

tasks:
  TASK-XXX:
    title: ""
    spec: ""
    status: READY
    depends_on: []
    parallel_safe: false

    risk:
      engineering: medium
      architecture: low
      product: none
      science: none
      delivery: low

    paths:
      allowed: []
      protected: []

    assurance:
      preflight_review: false
      architecture_review: false
      product_review: false
      science_review: false
      playtest: false

    delivery:
      create_pr: true
      wait_for_ci: true
      merge_after_ci: true
      delete_remote_branch: true
      cleanup_local_branch: true
      cleanup_worktree: true
      verify_main_after_merge: true

    completion:
      require_verify: true
      require_review: false
      require_integration: false
      require_pr: true
      require_ci: true
      require_merge: true
      require_cleanup: true
```

允许更精简，但必须具备等价能力。

---

## 6. Scope B — Task Schema / DAG Validator

新增 deterministic validator，建议：

```text
scripts/validate-task-contract.mjs
```

必须检查：task ID unique、legal status、spec exists、dependencies exist、DAG acyclic、READY dependencies all DONE、BLOCKED 合法、risk/path/assurance/retry/delivery/completion 值合法、无不可能 completion 组合。

新增：

```bash
pnpm task:check
```

---

## 7. Scope C — Path Policy Guard

新增 machine-enforced diff scope validation，建议：

```text
scripts/check-task-path-policy.mjs
```

输入：Task ID + git diff/changed files + allowed/protected paths。

输出 deterministic PASS/violations。

Builder/Reviewer 的 `Business Source: CLEAN`、`Frozen Specs: CLEAN` 不再只依赖自报。

建议入口：

```bash
pnpm task:path-check -- TASK-INFRA-001A
```

Cross-platform，不依赖 bash-only。

---

## 8. Scope D — Risk Routing Contract

支持 LOW / MEDIUM / HIGH 以及 engineering / architecture / product / science / delivery 多维风险。

路由：

```text
LOW    → Builder → required validation → Delivery
MEDIUM → Builder → Reviewer → required validation → Delivery
HIGH   → Pre-flight when required → Builder → adversarial tests → Reviewer → Integrator → optional Human Gate → Delivery
```

本 Task 不实现完整 Agent spawning。

---

## 9. Scope E — Pre-flight / Acceptance Freeze

定义生命周期：

```text
DRAFT → PREFLIGHT_REVIEW → FROZEN → IMPLEMENTATION → REVIEW
```

DESIGN_DEFECT：

```text
STOP → UNFREEZE → revise → RE-FREEZE
```

禁止实现阶段静默扩大 frozen boundary。

---

## 10. Scope F — Acceptance Matrix Contract

定义统一结构，可存于 Task markdown 或 machine-readable companion artifact：

```text
ID
scenario
expected result
expected diagnostic/behavior
regression test
```

高风险 parser/guard/state-machine Task 要求唯一 ID、completeness meta-test where practical、FAIL exact behavior/diagnostic、PASS false-positive protection。

---

## 11. Scope G — Review Contract

更新 `agents/REVIEWER.md`。

Reviewer 使用：

```text
1. Contract Review
2. Risk Review
```

Finding 分类：

```text
CONTRACT_VIOLATION
NEW_REGRESSION
DESIGN_DEFECT
HARDENING_OPPORTUNITY
OUT_OF_SCOPE
```

默认 blocking：CONTRACT_VIOLATION、NEW_REGRESSION。

DESIGN_DEFECT → stop ordinary retry → escalation。

HARDENING_OPPORTUNITY / OUT_OF_SCOPE → non-blocking，除非 Task Contract 明确规定。

---

## 12. Scope H — Finding → Regression

对可测试 correctness finding：

```text
Finding → Regression → RED → Fix → GREEN
```

Review evidence 至少记录 finding_id、classification、severity、regression_test、status。

---

## 13. Scope I — Retry Budget

固化默认：

```yaml
max_builder_retries: 2
max_review_cycles: 2
same_class_high_escalates: true
```

```text
same-class HIGH >= 2 → STOP blind retry → DESIGN_ESCALATION
```

---

## 14. Scope J — Failure Classification Contract

定义：FORMAT、LINT、TYPECHECK、UNIT_TEST、E2E、ARCHITECTURE、PATH_POLICY、REVIEW_FINDING、CI_INFRA、SPEC_CONFLICT、DESIGN_DEFECT、PRODUCT_CONFLICT、SCIENCE_AMBIGUITY、DEPENDENCY_CONFLICT，并定义默认 action。

本 Task 只要求 machine-readable/validated contract；完整 autonomous Failure Router 留给 INFRA-003。

---

## 15. Scope K — Architecture / Product / Science Assurance

### Architecture

Always-on cheap fitness functions 继续执行。深度 reassessment 由 pressure signal 触发：same-class HIGH>=2、actual files/packages >> expected、repeated public API changes、cross-package expansion、repeated architecture exceptions、unrelated regressions、workaround around same abstraction。

### Product

product-impacting Task 支持：

```yaml
product_hypothesis:
  statement: ""
  success_evidence: []
```

Product pressure 至少包括：bypass core investigation loop、evidence/hypothesis/claim meaningless、NOVA answer bot、repeated UX patching、player agency lost、investigation becomes quiz。

### Science

science-bearing Task 支持：

```yaml
science:
  state: observed | reconstructed | simulated | enhanced | hypothesis | fiction
  source_required: true | false
  deterministic_test: true | false
  simplification: explicit
  units: explicit
```

本 Task 不实现 AI 自动 product/science judge；先实现 Contract/Gate。

---

## 16. Scope L — Design Pressure / Assumption Reassessment

正式规则：

```text
Repeated implementation difficulty is evidence.
```

压力阈值触发后：

```text
STOP ordinary fix loop
→ reassess Task Design / Architecture / Product Assumption / Science Assumption
```

第一版可使用 deterministic counters / metadata，不需要 ML。

---

## 17. Scope M — Evidence-driven State Machine

至少支持：

```text
QUEUED
BLOCKED
READY
IN_PROGRESS
REVIEW
INTEGRATING
PR_OPEN
CI_RUNNING
MERGE_READY
MERGED
CLEANUP
DONE
FAILED
HUMAN_ATTENTION
```

状态转换必须定义 evidence prerequisite；不得允许 Agent 任意设置 DONE。

---

## 18. Scope N — Definition of Done as Code

新增 deterministic completion evaluator，建议：

```text
scripts/evaluate-task-done.mjs
```

至少验证 dependencies、implementation evidence、path policy、architecture、required tests、verify、review、integration、PR、CI、merge、main verification、cleanup、blocking findings。

证据不足：

```text
NOT DONE
```

---

## 19. Scope O — Delivery Lifecycle Automation

把 Integrator 升级为 Delivery Integrator：

```text
Commit → Push → PR → CI → Merge Gate → Merge → Verify Main → Delete Remote Branch → Delete Local Branch → Cleanup Worktree → Finalize Task → DONE
```

允许使用已验证 local `gh` CLI 作为 GitHub delivery transport。

优先 deterministic script/command，而非长 Prompt 编排。

建议：

```text
scripts/task-delivery.mjs
pnpm task:deliver -- TASK-XXX
```

第一版只覆盖当前单 repo/main branch 模型即可。

---

## 20. Scope P — Delivery Capability Bootstrap & Health Check

不要每 Task 全量检查 GitHub 权限。

```text
Bootstrap once → reuse → revalidate on failure/change/expiry
```

完整 bootstrap 仅在 new machine/environment、account/repo changed、capability contract version changed 时执行。

普通 Task 直接 delivery；auth/permission/capability failure 时再 revalidate。

---

## 21. Scope Q — Human Attention Policy

只在 machine cannot safely decide 时打断：product decision、architecture conflict、science ambiguity、spec conflict、same-class HIGH、scope expansion、unsafe merge、explicit human gate、credential/external authority。

普通可修失败不得主动打断。

---

## 22. Scope R — Efficiency Contract Foundations

本 Task 不完整实现 INFRA-002，但必须固化原则与后续 schema：

```text
Baseline Once, Validate Incrementally
Risk-triggered Assurance
Deterministic-first
```

后续能力：Context Router、Context Budget、Change Impact Analysis、Selective Validation、FAST/STANDARD/FULL test tiers、Review Depth Routing、CI authoritative full validation、caching、parallel validation、async CI continuation、telemetry。

---

## 23. Files Expected To Add

```text
docs/engineering/README.md
docs/engineering/AGENTIC_SDLC_OPERATING_MODEL.md
docs/engineering/REVIEW_RETRY_GOVERNANCE.md
docs/engineering/ASSURANCE_AND_DESIGN_PRESSURE.md
docs/engineering/DELIVERY_LIFECYCLE.md
docs/engineering/EFFICIENCY_AND_VALIDATION_STRATEGY.md
docs/engineering/HUMAN_ATTENTION_POLICY.md
docs/engineering/AGENTIC_SDLC_ROADMAP.md
scripts/validate-task-contract.mjs
scripts/check-task-path-policy.mjs
scripts/evaluate-task-done.mjs
```

如实现 delivery command，可新增 `scripts/task-delivery.mjs` 与对应 tests。

---

## 24. Files Expected To Modify

```text
AGENTS.md
README_TASKS.md
agents/BUILDER.md
agents/REVIEWER.md
agents/INTEGRATOR.md
tasks/TASKS.yaml
package.json
```

如 delivery/CI 需要最小调整，可修改 `.github/workflows/ci.yml`，但必须保持当前 CI 质量基线。

---

## 25. Protected / Forbidden Scope

不得修改业务实现：

```text
apps/web/src/**
packages/core/src/**
packages/simulation/src/**
packages/content/src/**
```

不得修改 frozen product specs：

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

---

## 26. Non-goals

本 Task 不实现：autonomous Agent spawning、full scheduler、parallel Builder orchestration、automatic worktree scheduler、model router、semantic/vector memory DB、AI Product Judge、AI Science Judge、full Context Router、full Change Impact Engine、full Selective Validation Engine、AI Test Planner、fully autonomous Failure Router、dashboard、token/cost telemetry backend、cross-repository orchestration、LangGraph/CrewAI/AutoGen/Microsoft Agent Framework。

---

## 27. Implementation Strategy

保持：

```text
Minimal
Deterministic
Auditable
Cross-platform
No new dependency unless strictly necessary
```

优先 Node.js/ESM、existing TypeScript、Git/gh CLI、GitHub Actions。需要新 dependency 必须先报告并等待批准。

---

## 28. Validation Strategy

本 Task 属于 high engineering + high architecture risk。

实现前必须输出并冻结：

```text
SCHEMA FREEZE
STATE MACHINE FREEZE
REVIEW CLASSIFICATION FREEZE
DELIVERY GATE FREEZE
DONE EVIDENCE FREEZE
```

每项必须有 in-scope/out-of-scope 与 acceptance cases。

Builder 内循环优先 focused tests。

Independent review 前必须：

```bash
pnpm architecture:check
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm verify
pnpm e2e
git diff --check
```

Windows PowerShell 允许 `pnpm.cmd` fallback，不修改 execution policy。

---

## 29. Acceptance Criteria

- AC-01 Task Schema Validator 存在并通过。
- AC-02 DAG invalid/cycle/illegal READY 被自动拒绝。
- AC-03 Path Policy Guard 能从真实 diff 检测 allowed/protected violation。
- AC-04 Risk Contract 支持 engineering/architecture/product/science/delivery。
- AC-05 Reviewer finding classification 固化并可验证。
- AC-06 Retry Budget 有 machine-readable 默认值。
- AC-07 same-class HIGH>=2 进入 design escalation。
- AC-08 Acceptance Freeze lifecycle 明确定义，Implementation 不得静默扩大 frozen contract。
- AC-09 Finding→Regression 规则固化。
- AC-10 Architecture/Product/Science Assurance routing contract 存在。
- AC-11 Design Pressure 支持 deterministic evidence/counters 与 escalation。
- AC-12 Evidence-driven state machine 有合法转换验证。
- AC-13 Definition of Done evaluator 能拒绝证据不足的 DONE。
- AC-14 Delivery Lifecycle 覆盖 PR→CI→Merge→Main Verify→Cleanup。
- AC-15 Integrator Contract 升级为 Delivery Integrator。
- AC-16 Delivery capability 使用 bootstrap + failure-triggered revalidation，而非每 Task full preflight。
- AC-17 Human Attention 只对真正决策/权限/安全边界升级。
- AC-18 治理文档完整落库，并被 AGENTS/Task 引用。
- AC-19 `pnpm verify` 与现有 architecture guard 不回退。
- AC-20 E2E 保持独立 gate。
- AC-21 无业务代码修改。
- AC-22 Frozen specs clean。
- AC-23 默认无新 dependency。
- AC-24 完整验证 PASS。

---

## 30. Required Adversarial Cases

至少测试：

```text
invalid task status
missing dependency
cyclic dependency
READY with unfinished dependency
protected path modified
file outside allowed paths
illegal risk value
invalid retry budget
illegal state transition
DONE without CI evidence
DONE without merge evidence
DONE without cleanup evidence
same-class HIGH x2
hardening finding does not automatically block
out-of-scope finding does not automatically block
product review not required for product:none
science review required when configured high
delivery capability revalidation triggered by auth failure
```

---

## 31. Completion Gate

Builder 不得报告 READY FOR REVIEW，除非：Task schema/DAG/path policy/review classification/retry-escalation/state machine/DoD evaluator/delivery dry-run tests PASS，architecture:check PASS，verify PASS，e2e PASS，git diff --check PASS，business source CLEAN，frozen specs CLEAN，dependencies unchanged。

---

## 32. Final Definition of Done

TASK_INFRA_001A 必须使用自身定义的完整 Delivery：

```text
Builder PASS → Reviewer PASS → Integrator PASS → Commit → Push → PR → CI PASS → Merge → Main Verified → Branch Cleanup → Task Metadata DONE
```

---

## 33. Roadmap After This Task

### INFRA-002 — Context & Token Efficiency
Context Router、Context Budget、Change Impact Analysis、Selective Validation、Test Tiering、ADR/Decision Memory。

### INFRA-003 — Autonomous Quality Loop
AI Test Planner、Failure Router execution、Controlled Retry、async CI continuation、Human Attention Queue automation。

### INFRA-004 — Multi-Agent Orchestration
Task Compiler、Worktree Orchestrator、DAG Scheduler、Parallel Builders、Merge Queue。

### INFRA-005 — Engineering Control Plane
dashboard、telemetry、token/cost、task lead time、review cycles、human interventions、architecture pressure。

---

## 34. Success Criterion

本 Task 的成功不是新增很多脚本，而是后续 TASK-004 开始，不再依赖临时 Prompt 才知道：什么时候需要 review、什么时候停止 retry、什么时候反推 architecture/product、什么时候需要 human、什么时候可以 merge、什么时候才真正 DONE。

工程运行模型必须成为仓库能力，而不是聊天记忆。
