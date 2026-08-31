# Assurance & Design Pressure

## 1. Four Levels of Correctness

```text
Implementation Correctness
Architecture Correctness
Product Correctness
Science Integrity
```

代码 PASS 不代表产品和架构合理。

## 2. Engineering Assurance

检查 task contract、scope、tests、type safety、path policy、architecture fitness、build、required e2e、delivery evidence。

## 3. Architecture Assurance

### Always-on Architecture Fitness

优先机器化、确定性、低成本：package boundaries、source boundaries、forbidden imports、core no React/Three/DOM、simulation no React/Three/DOM/LLM、simulation deterministic、science formulas not in React、protected paths、public API rules。

### Architecture Reassessment Triggers

出现以下信号时，不允许继续默认“只是实现 bug”：

- same-class HIGH review finding >= 2
- 同一模块连续多个 Task 反复修改
- actual changed files/packages 显著超出预期
- 小功能迫使修改多个 package public interfaces
- architecture exceptions / special cases 持续增加
- 一个 fix 引发多个 unrelated regressions
- 为实现需求反复绕过已有 abstraction
- public API 频繁 breaking
- 同一业务规则在多个层重复
- tests 大量 mock 内部细节
- 简单需求导致异常复杂数据流/状态同步
- Reviewer 多次指出“局部正确、职责归属错误”

触发：

```text
DESIGN_PRESSURE_DETECTED
→ stop normal implementation loop
→ Architecture Reassessment
```

可能结论：KEEP_ARCHITECTURE / REFACTOR_BOUNDARY / REDESIGN_INTERFACE / SPLIT_RESPONSIBILITY / CHANGE_TASK_DESIGN。

## 4. Change Friction as Evidence

建议记录：expected_files、actual_files、expected_packages、actual_packages、review_cycles、regression_count、architecture_exceptions、public_api_changes。

高 friction 不代表架构一定错，但代表必须重新验证架构假设。

## 5. Product Assurance

核心产品 Task 应声明：

```yaml
product_hypothesis:
  statement: ''
  success_evidence: []
```

调查玩法核心假设示例：玩家能够在没有被直接告知答案的情况下，经历 Evidence → Hypothesis → Claim → Verify，并感知“这是我自己查出来的”。

### Product Reassessment Triggers

- 玩家可绕过核心调查流程仍通关
- Evidence/Hypothesis/Claim 对结果没有实际影响
- NOVA 事实上成为答案机器人
- 功能必须靠大量强制教程才能成立
- 玩家行为持续违背 product_hypothesis
- 实现复杂度高但体验价值低
- 多个 Task 都在给同一个 UX friction 打补丁
- 系统不断增加限制规则来阻止自然玩家行为
- playtest 表现为 quiz 而非 investigation
- 玩家 agency 被系统逻辑替代
- 玩家频繁不知道下一步做什么
- 设计要求与实际可理解性持续冲突

触发：

```text
PRODUCT_ASSUMPTION_PRESSURE
→ Product Reassessment
```

可能结论：KEEP / CHANGE / SIMPLIFY / REMOVE / REDESIGN_LOOP。

## 6. Product Adversarial Review

对 product-impacting Task 至少考虑：

```text
Can the player bypass evidence?
Can the player guess through the flow?
Does NOVA leak the answer?
Does hypothesis materially affect decision?
Does Verify actually resolve investigation?
Does the flow preserve player agency?
Does the system become a quiz?
```

## 7. Investigation Loop Fitness

核心案件必须保护：

```text
DETECT → SCAN → EVIDENCE → HYPOTHESIS → SIMULATE → DECIDE → VERIFY → DEBRIEF
```

Task 应声明强化/改变哪一步，以及是否 bypass、make meaningless、transfer agency、convert investigation into answer selection。

## 8. Science Assurance

science-bearing Task 应声明：

```yaml
science:
  state: observed | reconstructed | simulated | enhanced | hypothesis | fiction
  source_required: true | false
  deterministic_test: true | false
  simplification: explicit
  units: explicit
```

Science review 关注 observed vs simulated、近似、单位、determinism、真实来源、表现层不得偷偷改变科学结果。

## 9. Assurance Routing

```text
architecture risk high → Architecture Review
product risk high → Product Review / Experience Acceptance
science risk high → Science Review
engineering risk high → stronger tests + reviewer
```

不相关 Assurance 不应机械运行。

## 10. Design Reassessment Gate

统一原则：

```text
Repeated implementation difficulty is evidence.
```

当 review cycle、diff/package 扩张、exceptions、regressions、bypass behavior 增加时，系统必须允许反推：Task Design? Architecture? Product Assumption? Science Assumption? 而不是继续无限修代码。
