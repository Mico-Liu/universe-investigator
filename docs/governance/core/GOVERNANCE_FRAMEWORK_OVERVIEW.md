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

Capability execution is orthogonal to L0–L5. It does not introduce another policy authority. Runtime Evidence reports facts; the Control Plane is a derived view only.

## Runtime Repository Information Architecture

Runtime machine artifacts must not be mixed with human-readable documentation.

```text
governance/
├─ schemas/
├─ profiles/
└─ runtime/
   ├─ events/
   └─ evidence/

tasks/
├─ registry.json
└─ contracts/

scripts/
└─ governance/
   ├─ validators/
   ├─ evaluators/
   ├─ project-adapters/
   └─ tests/
```

Schemas, normalized Profiles, registry, and Task Contracts are version-controlled. Event streams and Evidence manifests are append-only and machine-owned; large Evidence artifacts are referenced by URI and digest.

`tasks/TASKS.yaml` remains authoritative until INFRA-001A validates deterministic equivalence and an approved cutover gate replaces it with `tasks/registry.json`. Dual authority is forbidden. Runtime Event/Evidence persistence, State projection, and DONE activation remain INFRA-001B responsibilities.

## Implementation Strategy

```text
Design broad
Implement narrow
Validate on real projects
Extract only after reuse boundary is proven
```
