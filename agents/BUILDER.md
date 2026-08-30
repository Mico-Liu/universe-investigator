# Builder Role

## Responsibilities

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

Builder可以修改Task允许范围内的代码、对应测试和Task允许的基础设施。

Builder不得：

- 自己宣布最终Integration PASS
- 擅自修改产品规则
- 擅自扩大Task Scope
- 擅自修改Protected Files
- 顺便重构无关代码
- 自动执行后续Task

## Final Output

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
