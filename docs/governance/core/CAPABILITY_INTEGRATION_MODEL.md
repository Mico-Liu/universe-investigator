# Capability & Integration Model

Governance Kernel 不绑定执行工具。

```text
Skill
MCP
CLI
Script
Agent
CI Provider
External API
```

## Separation

```text
Governance: “I need Architecture Review”
Capability Layer: “Which skill/agent/script performs it?”
```

## Skill vs MCP

Skill = reusable way of doing work。MCP = standardized access to external systems/capabilities。

## Capability Contract

```yaml
capability:
  id: source-control
  type: mcp | cli | skill | script | agent
  operations: []
  required: true
  health: ready | degraded | unavailable
  cost_class: low | medium | high
  latency_class: low | medium | high
  evidence_provider: true
```

## Router Principle

```text
Deterministic Script
→ Skill / Semantic Agent
→ External MCP/API
→ Human Attention when required
```
