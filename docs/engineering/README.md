# Engineering Governance Index

本目录保留《宇宙科学调查局》的项目工程文档与既有治理材料。跨项目 Generic Governance 真源位于 `docs/governance/`；重叠材料仅作为后续迁移候选，不在本次集成中合并或重写。

核心原则：

```text
Artifact-driven
>
Conversation-driven
```

长期规则必须逐步演进为：

```text
Prose
→ Structured Contract
→ Executable Check
→ Automated Test
→ Machine State
```

## 文档地图

| 文档                                    | 目的                                                                      |
| --------------------------------------- | ------------------------------------------------------------------------- |
| `AGENTIC_SDLC_OPERATING_MODEL.md`       | 总体运行模型、角色、状态机、风险路由                                      |
| `REVIEW_RETRY_GOVERNANCE.md`            | Pre-flight、Acceptance Freeze、Finding→Regression、Review/Retry Budget    |
| `ASSURANCE_AND_DESIGN_PRESSURE.md`      | 架构/产品/科学 Assurance、Design Pressure 与假设反推                      |
| `DELIVERY_LIFECYCLE.md`                 | Commit→PR→CI→Merge→Cleanup→DONE                                           |
| `EFFICIENCY_AND_VALIDATION_STRATEGY.md` | Context、Impact、Selective Validation、Test Tiering、缓存、并行、效率指标 |
| `HUMAN_ATTENTION_POLICY.md`             | 何时必须找人、何时不得打断人                                              |
| `AGENTIC_SDLC_ROADMAP.md`               | INFRA-001A 至 INFRA-005 路线                                              |
| `DEVELOPMENT.md`                        | 本地开发、验证与跨平台命令指引                                            |
| `DECISIONS.md`                          | 已接受的工程决策记录                                                      |

## Documentation Information Architecture

Documentation and operational artifacts have one canonical home:

| Responsibility                                    | Canonical location        |
| ------------------------------------------------- | ------------------------- |
| Product truth                                     | `docs/product/`           |
| Architecture truth                                | `docs/architecture/`      |
| Generic governance                                | `docs/governance/`        |
| Current project governance/profile                | `project-governance/`     |
| Future reusable architecture standards            | `architecture-standards/` |
| Project engineering docs and migration candidates | `docs/engineering/`       |
| Task specifications                               | `docs/tasks/`             |
| Machine task state                                | `tasks/`                  |
| Agent contracts                                   | `agents/`                 |
| Executable policy                                 | `scripts/`                |
| CI and delivery enforcement                       | `.github/`                |
| High-value entrypoints and configuration only     | repository root           |

## 最高治理原则

1. Stable capabilities are not fully revalidated on every Task.
2. Baseline once, validate incrementally.
3. Risk-triggered Assurance.
4. Evidence-driven escalation.
5. Deterministic-first.
6. Review and retry are bounded.
7. Correctness findings become regression tests where practical.
8. Repeated implementation friction is architectural/product evidence.
9. Push is not delivery completion; merge + cleanup + evidence is.
10. Agent cannot self-declare DONE.

工程治理不得覆盖或重写产品上位规格；发生冲突时，按 `AGENTS.md` 既有优先级与 Change Request 机制处理。
