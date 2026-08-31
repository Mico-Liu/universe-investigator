# Efficiency & Validation Strategy

## 1. Objective

目标不是少测，而是：

```text
Fast local feedback + Full authoritative CI assurance + Minimal unnecessary context/review
```

## 2. Primary Time Components

Context load、Environment prep、Implementation、Validation、Review、Fix loops、CI wait、Delivery。优先优化重复和确定性工作。

## 3. Context Router

正常 Task 不应默认全仓阅读。生成最小 Context Pack：

```yaml
context:
  required: []
  affected_packages: []
  relevant_paths: []
  relevant_tests: []
  relevant_specs: []
  exclude: []
  full_repo_scan: false
```

Full repo scan 只在 architecture pressure、unknown dependency impact、public API change 或 Task 明确要求时触发。

## 4. Context Budget

默认只包括 current Task、relevant AGENTS sections、explicit specs、affected files/tests、necessary public interfaces；排除 unrelated completed task history、cases、assets、package internals。

## 5. Change Impact Analysis

```text
git diff → affected files → affected packages → affected public contracts → affected tests → required validations
```

## 6. Validation Tiers

### FAST

Builder 内循环：format changed surface、path policy、architecture guard、affected unit tests。

### STANDARD

完成一个实现增量：affected typecheck、package tests、affected build。

### FULL

Review/Integration/CI gate：pnpm verify、required E2E、full architecture checks、integration evidence。

## 7. Selective Validation

```text
docs only → format/check
core domain → architecture + typecheck + affected unit
simulation → architecture + deterministic tests + typecheck
web UI → typecheck + relevant unit + selected e2e
journey/persistence → full e2e
```

CI 保留 authoritative full validation。

## 8. Avoid Duplicate Mechanical Validation

```text
Builder → FAST repeatedly → STANDARD → FULL once before review
Reviewer → focused adversarial / semantic checks
CI → authoritative FULL
```

Reviewer 不应机械重复已有可信机器证据。

## 9. Review Depth Routing

```text
LOW → minimal/no independent semantic review
MEDIUM → focused reviewer
HIGH → preflight + adversarial + integrator
```

## 10. Environment Bootstrap & Cache

稳定环境不应每 Task 重装：pnpm store、Node/pnpm、Playwright browser/runtime、GitHub CLI auth、repo remote config。

CI 应评估 pnpm cache、Playwright cache where safe、build cache、TypeScript incremental opportunities。

## 11. Parallel Validation

独立验证可并行：architecture、lint、typecheck、unit、build、e2e，避免无必要串行累加。

## 12. Incremental TypeScript / Build

仓库变大后评估 project references、tsc --build、incremental compilation、affected package build；当前规模不足以产生收益时不应过早复杂化。

## 13. Async CI Continuation

未来交付不应让 Agent 长时间阻塞等待：

```text
create PR → CI async → workflow completion event/poll → resume Integrator
```

## 14. Deterministic-first Efficiency

优先脚本化 changed surface、path policy、DAG、acceptance completeness、test result parsing、CI result、merge state、cleanup state。

## 15. Task Granularity

目标：one clear capability、1–2 primary packages、independently testable、reviewable diff。过大增加 context/review/retry；过小增加 branch/PR/CI overhead。

## 16. Telemetry

以后至少记录：Context Load Time、Builder Runtime、Fast Validation Time、Full Verify Time、Reviewer Runtime、Review Cycles、Fix Loop Time、CI Time、Delivery Time、Total Lead Time、Tokens/Task、Human Interventions/Task。

## 17. Efficiency KPIs

优先：Human Interventions/Task、Task Lead Time、Tokens/Completed Task、First-pass Review Rate、Retry Rate、CI Failure After Review、Escaped Defects、Architecture Violations、Unrelated Change Rate。

## 18. Optimization Rule

只建设能至少降低一项的能力：human intervention、token consumption、lead time、defect risk、architecture drift。
