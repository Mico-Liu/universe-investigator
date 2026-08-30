# 宇宙科学调查局

《宇宙科学调查局》是面向 9–12 岁玩家的科学调查体验。当前仓库只实施 V6.1 Vertical Slice，以验证玩家能否借助工具、证据与模拟自主破解宇宙谜案。

当前阶段是 TASK 001 工程骨架：提供最小 NEXUS 3D 启动画面、纯 TypeScript 包边界、测试与 CI，不包含正式案件逻辑。

## 环境与安装

- Node.js 22.13+（22.x），或 Node.js 24.0 及更高版本
- pnpm 11.24.0

```bash
pnpm install
pnpm dev
```

## 常用命令

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm e2e
```

## Repository 结构

```text
apps/web             React + R3F 表现层
packages/core        纯 TypeScript 领域包骨架
packages/simulation  纯 TypeScript 科学模拟包骨架
packages/content     数据与运行时校验包骨架
docs                 开发与决策记录
```

## 文档入口

- `V6_MASTER_BLUEPRINT_FINAL.md`
- `V6_VERTICAL_SLICE_SPEC.md`
- `V6_ARCHITECTURE.md`
- `AGENTS.md`
- `docs/DEVELOPMENT.md`
