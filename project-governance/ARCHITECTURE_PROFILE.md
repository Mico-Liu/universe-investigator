# Current Project Architecture Profile

Logical Modules：`apps/web`、`packages/core`、`packages/simulation`、`packages/content`。

Responsibilities：web→presentation/browser adapters；core→pure domain；simulation→pure deterministic scientific models；content→data-driven content。

Current fitness：core no React/Three/DOM；simulation no React/Three/DOM/LLM and deterministic；science formulas not in React。

详细架构真源仍为 `docs/architecture/V6_ARCHITECTURE.md`。
