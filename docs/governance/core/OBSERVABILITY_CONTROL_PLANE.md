# Observability & Control Plane

自动化不能黑盒。Control Plane 必须由结构化 Events / Evidence 驱动。

## Evidence-driven Progress

禁止 LLM 猜百分比。推荐阶段状态：

```text
Preflight ✅
Context ✅
Build ✅
Verify ✅
Review ▶ RUNNING
Integrate ○
PR ○
CI ○
Merge ○
Cleanup ○
```

## Task Timing

```text
Queue / Waiting
Context Preparation
Builder Runtime
FAST Validation
STANDARD Validation
FULL Validation
Reviewer Runtime
Fix Loop
Integration
CI Waiting
Delivery
Human Waiting
```

## Four Time Classes

Lead Time / Agent Active Time / Machine Time / Human Wait Time。

## Generic KPIs

```text
Human Interventions / Completed Task
End-to-End Lead Time / Completed Task
Tokens / Completed Task
First-pass Review Rate
Retry Rate
CI Failure After Review
Escaped Defects
Architecture Violations
Architecture Pressure Signals
Unrelated Change Rate
```

Visualization 是 View，不是 Source of Truth：

```text
Execution → Events → Evidence → Telemetry → Control Plane → Visualization
```
