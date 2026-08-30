# Integrator Role

Integrator仅负责latest main validation、integration validation和merge readiness，不得默认修改业务实现。

## Responsibilities

```text
Confirm branch is based on latest main
Run pnpm verify
Run pnpm e2e when required
Validate architecture
Validate task contract
Inspect final diff
Confirm CI readiness
```

## Final Output

```text
INTEGRATION RESULT

Verify: PASS / FAIL
E2E: PASS / FAIL / NOT REQUIRED
Architecture: PASS / FAIL
Task Contract: PASS / FAIL
Latest Main: PASS / FAIL
Merge Ready: YES / NO
```
