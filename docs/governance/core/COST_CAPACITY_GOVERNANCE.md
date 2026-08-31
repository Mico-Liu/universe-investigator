# Cost & Capacity Governance

Agentic Engineering 成本至少包括：LLM tokens、LLM runtime、machine validation time、CI minutes、human wait、human intervention、review cycles、rework。

## Future Execution Budget

```yaml
execution_budget:
  context:
    mode: affected
    full_repo_scan: false
  validation:
    local: selective
    ci: full
  review:
    depth: risk_based
  retry:
    max_cycles: 2
  human_attention:
    only_on_escalation: true
```

North-star：Human Interventions / Completed Task；End-to-End Lead Time / Completed Task。
