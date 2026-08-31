# Review & Retry Governance

## 1. Problem

禁止形成：

```text
Builder → Reviewer discovers new acceptance rule → Builder patches → Reviewer discovers equivalent rule → repeat
```

Review 不能成为实现完成后的规格发现过程。

## 2. Pre-flight Review

以下类型默认要求 Pre-flight：architecture guard、parser/static analysis、persistence、state machine、public interface、end-to-end journey、scientific model、product-critical investigation loop、高 architecture/product/science risk。

Pre-flight 至少输出：root cause/behavior model、in-scope、out-of-scope、acceptance matrix、test contract、completion gate。

## 3. Acceptance Freeze Lifecycle

```text
DRAFT → PREFLIGHT_REVIEW → FROZEN → IMPLEMENTATION → REVIEW
```

如果出现 DESIGN_DEFECT：

```text
STOP ordinary retry → UNFREEZE → revise → RE-FREEZE
```

不得在 Builder 修复过程中偷偷扩大 Acceptance Matrix。

## 4. Acceptance Matrix

适合机器化的验收标准必须尽量表达：

```text
Case ID
Input / scenario
Expected PASS / FAIL
Expected diagnostic / behavior
Required regression test
```

高风险 parser/guard/state-machine Task 应有 completeness meta-test。

## 5. Finding → Regression Rule

可测试 correctness finding：

```text
Finding → Regression Test → RED → Fix → GREEN
```

纯文档、无法合理自动化 UX observation、明确 out-of-scope hardening 需分类而非强行造测试。

## 6. Finding Classification

### CONTRACT_VIOLATION

冻结 Contract 内失败。BLOCKING。

### NEW_REGRESSION

破坏已有受保护行为。BLOCKING。

### DESIGN_DEFECT

冻结设计/任务假设本身有系统性缺陷。STOP ordinary retry → DESIGN ESCALATION。

### HARDENING_OPPORTUNITY

合理但不属于冻结边界。NON-BLOCKING，进入 backlog。

### OUT_OF_SCOPE

明确排除。NON-BLOCKING。

## 7. Retry Budget

默认：

```yaml
automation:
  max_builder_retries: 2
  max_review_cycles: 2
  same_class_high_escalates: true
```

```text
same-class HIGH >= 2 → STOP blind retry → architecture/product/task reassessment
```

## 8. Failure Classification

```text
FORMAT
LINT
TYPECHECK
UNIT_TEST
INTEGRATION_TEST
E2E
ARCHITECTURE
PATH_POLICY
REVIEW_FINDING
CI_INFRA
SPEC_CONFLICT
DESIGN_DEFECT
PRODUCT_CONFLICT
SCIENCE_AMBIGUITY
DEPENDENCY_CONFLICT
```

| Failure           | Default action                         |
| ----------------- | -------------------------------------- |
| FORMAT            | auto-fix / retry                       |
| LINT              | Builder retry                          |
| TYPECHECK         | Builder retry                          |
| UNIT_TEST         | regression + Builder retry             |
| E2E               | classify implementation vs environment |
| ARCHITECTURE      | architecture correction/review         |
| REVIEW_FINDING    | classify finding first                 |
| CI_INFRA          | bounded retry                          |
| SPEC_CONFLICT     | Human decision                         |
| DESIGN_DEFECT     | Design escalation                      |
| PRODUCT_CONFLICT  | Product review                         |
| SCIENCE_AMBIGUITY | Science review                         |

## 9. Review Depth Routing

```text
LOW → machine gates; reviewer optional
MEDIUM → focused contract review
HIGH → pre-flight + adversarial review + integration review
```

Reviewer 不应机械重复 format/lint/typecheck/full unit/build 等已有可信证据，应重点投入 frozen contract、architecture semantics、scope、regression surface、design pressure、product/science risk。

## 10. Review Evidence

每轮记录：cycle、finding id、severity、classification、blocking、regression test id、status，用于计算 review cycles、same-class repeat、first-pass review rate、escalation trigger。
