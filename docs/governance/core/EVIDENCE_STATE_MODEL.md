# Evidence & State Model

## Evidence-driven State

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

状态必须来自证据。

## Engineering Event Log

```text
TASK_READY
TASK_STARTED
CONTRACT_FROZEN
BUILD_COMPLETED
VERIFY_FAILED
RETRY_STARTED
REVIEW_FAILED
DESIGN_PRESSURE_DETECTED
PR_CREATED
CI_PASSED
MERGED
TASK_DONE
```

事件至少支持：task / stage / timestamp / duration / result / evidence refs / actor or capability。

## Definition of Done as Code

```text
DONE =
dependencies DONE
AND implementation complete
AND path policy PASS
AND required tests PASS
AND architecture PASS when required
AND review PASS when required
AND integration PASS when required
AND PR exists
AND CI PASS
AND merged
AND target branch verified
AND cleanup complete
AND no blocking findings
```
