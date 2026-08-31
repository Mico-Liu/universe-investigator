# Task & Risk Governance

Task Contract 至少包括：id、status、goal、scope、non-goals、depends_on、allowed/protected paths、risk、architecture impact、assurance、acceptance、retry、delivery、completion。

## Multi-dimensional Risk

```yaml
risk:
  engineering: low | medium | high
  architecture: low | medium | high
  product: none | low | medium | high
  science: none | low | medium | high
  security: none | low | medium | high
  compliance: none | low | medium | high
  delivery: low | medium | high
```

## Routing

```text
LOW → machine gates / minimal semantic review
MEDIUM → focused review
HIGH → pre-flight + adversarial checks + integration gate
```

## DAG Rules
机器验证：task id unique、dependency exists、acyclic、READY deps DONE、BLOCKED has blocker、legal state transitions。

## Path Policy

```text
git diff
→ allowed paths
→ protected paths
→ deterministic result
```
