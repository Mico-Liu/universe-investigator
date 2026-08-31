# Architecture Governance

## Architecture Is First-class

```text
Architecture Intent
→ Architecture Impact Assessment
→ Architecture Gate
→ ADR when required
→ Architecture Contract / Freeze
→ Implementation
→ Architecture Fitness Functions
→ Architecture Review
→ Architecture Pressure Detection
→ Reassessment
→ Post-change Architecture Evidence
```

## Three Architecture Conditions

### ARCHITECTURE_VIOLATION

规则仍正确，实现违反规则。默认：`FIX IMPLEMENTATION`。

### ARCHITECTURE_PRESSURE

反复实现摩擦表明架构假设可能不再合理。默认：`ARCHITECTURE REASSESSMENT`。

### ARCHITECTURE_FAILURE

架构无法满足必要 Functional / NFR 目标。默认：`ARCHITECTURE CHANGE + ADR + Human Decision when required`。

## Architecture Impact Assessment

```yaml
architecture_impact:
  modules_changed: []
  public_interfaces_changed: false
  dependency_graph_changed: false
  state_ownership_changed: false
  persistence_changed: false
  data_contract_changed: false
  runtime_topology_changed: false
  security_boundary_changed: false
  architectural_exception: false
```

## Routing

```text
NONE → fitness only
LOW / MEDIUM → focused architecture validation
HIGH → architecture pre-flight
BREAKING / EXCEPTION → ADR + Architecture Gate
```

## Design Pressure Signals

```text
same-class HIGH >= 2
actual files >> expected
actual modules >> expected
repeated public API churn
repeated cross-module workaround
architecture exception growth
unrelated regressions
same module touched by unrelated tasks
simple request causing disproportionate complexity
```

Pressure 不代表架构必然错误，而是架构假设不能继续被默认视为正确。

## NFR Governance

```yaml
nfr:
  performance: []
  reliability: []
  scalability: []
  security: []
  observability: []
  maintainability: []
  operability: []
  cost: []
```

## ADR

至少包含：Context / Decision / Alternatives / Consequences / Constraints / Revisit Triggers。
