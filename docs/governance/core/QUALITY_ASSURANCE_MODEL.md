# Quality & Assurance Model

## Correctness Layers

```text
Implementation Correctness
Architecture Correctness
Product Correctness
Domain / Science / Security Integrity
```

## Modular Assurance

Kernel 只理解：Assurance Module / Trigger / Evidence / Result / Escalation。Profile 定义具体语义。

```yaml
assurance_modules:
  architecture: enabled
  product: enabled
  science: disabled
  security: enabled
  compliance: disabled
```

## Product Assurance

```yaml
product_hypothesis:
  statement: ''
  success_evidence: []
  failure_signals: []
```

体验持续背离假设时：`PRODUCT_ASSUMPTION_PRESSURE → Product Reassessment`。

## Acceptance Freeze

适合机器化的 Acceptance 表达为：Case ID / Scenario / Expected Result / Expected Diagnostic or Behavior / Regression Test。
