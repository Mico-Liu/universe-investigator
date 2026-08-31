# Governance Framework Overview

## Positioning

AEGF 是工程治理层，不是 Coding Agent、Workflow Engine、MCP Runtime 或 CI 平台。

它回答：任务能否开始、需要多少上下文、需要多深的架构检查、需要哪些测试、Review 何时阻塞、Retry 何时停止、何时反推架构/产品假设、何时需要人工、何时允许交付、何时才真正 DONE。

## Layer Model

```text
L0  Generic Governance Kernel
L1  Reusable / Composable Profiles
L2  Project Profile
L3  Task Contract
L4  Runtime Evidence
L5  Control Plane / Visualization
```

## Governance Kernel

```text
Task / Risk / Architecture / Quality / Review / Retry / Assurance
Evidence / State / Delivery / Efficiency / Observability / Knowledge
Environment / Cost / Human Attention
```

## Replaceable Execution Layer

```text
Skill / MCP / CLI / Script / Agent / CI / External API
```

Kernel 定义“需要什么能力”，Capability Layer 决定“由谁执行”。

## Implementation Strategy

```text
Design broad
Implement narrow
Validate on real projects
Extract only after reuse boundary is proven
```
