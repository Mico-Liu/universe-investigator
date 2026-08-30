# Engineering Decisions

## D001 — Greenfield Web 技术骨架

- Date: 2026-08-30
- Decision: V6 是 Greenfield 项目；使用 React、React Three Fiber 与 Three.js；`core` 与 `simulation` 保持纯 TypeScript。
- Context: Vertical Slice 需要可测试的科学调查内核与浏览器 3D 表现层，同时适合单人配合 Codex 进行局部开发。
- Consequences: Web 层可以使用浏览器和渲染能力；Core 与 Simulation 不得依赖 React、Three.js、DOM 或 Web API。跨层功能通过明确的包入口组合。
