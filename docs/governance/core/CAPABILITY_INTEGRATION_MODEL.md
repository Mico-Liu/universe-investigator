# Capability Availability, Quota & Resume Contract

Governance defines the required operation. The Capability Layer chooses how it is executed. Kernel policy must not hard-code a Skill, Agent, model, MCP provider, CI provider, or external API.

## Capability Contract

```yaml
capability_id:
provider:
type: skill | mcp | cli | script | agent | ci_provider | external_api
operations: []
permissions: []
health: READY | DEGRADED | RATE_LIMITED | UNAVAILABLE
quota_dimensions:
  - kind: invocation_allowance | rolling_window | weekly_limit | credits | provider_outage
    limit: null
    remaining: null
    window_started_at: null
    window_ends_at: null
    reset_at: null
checked_at:
fallbacks:
  - capability_id:
    priority:
    eligible_operations: []
```

Health semantics:

- `READY`: required operation and capacity are available.
- `DEGRADED`: operation remains valid with declared latency, quality, or capacity degradation.
- `RATE_LIMITED`: at least one independent quota dimension temporarily prevents execution.
- `UNAVAILABLE`: outage, permission, credential, unsupported-operation, or permanent provider failure prevents execution.

One headline percentage is never sufficient capacity evidence.

## Fallback

```text
required capability unavailable
→ select eligible fallback by ascending priority
→ otherwise WAITING_EXTERNAL_CAPABILITY
```

A fallback is eligible only when it supports the operation, has required permissions, produces equivalent Evidence, does not reduce mandatory assurance, remains within budget, and is explicitly allowed by a Profile or Task Contract.

## Wait and Resume

```yaml
waiting:
  root_cause_key:
  capability_id:
  required_operation:
  prior_state:
  reset_at:
  resume_condition:
  fallback_attempts: []
```

Automatic resume requires both a reached `reset_at`, when present, and a fresh health check proving usable capacity. Time alone is insufficient. The resume Event is `CAPABILITY_RESUMED`.

Permission failure sets `UNAVAILABLE` with reason `PERMISSION` and prohibits blind retry. Use an eligible fallback or request Human Attention for credentials/authority.

Terminal escalation occurs when no safe fallback exists and recovery cannot occur within the effective deadline/budget, or the provider permanently rejects the operation. The same `root_cause_key` produces one active wait/attention record.

Resolution preference remains:

```text
Deterministic Script
→ Semantic Skill / Agent
→ MCP / External System
→ Human Attention when required
```

This is a contract only. Skills, MCP integrations, external adapters, and automatic resume scheduling are deferred.
