# Development

## 环境要求

- Node.js 22.13+（22.x），或 Node.js 24.0 及更高版本
- pnpm 11.24.0
- Chromium（运行 E2E；可用 `pnpm exec playwright install chromium` 安装）

## 安装与启动

```bash
pnpm install
pnpm dev
```

开发服务器默认由 Vite 启动，终端会显示实际访问地址。

## 质量门与构建

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm e2e
```

Core 与 Simulation 的生产 TypeScript 配置显式使用 `types: []`，且仅加载 `ES2022` library；生产源码不会获得 DOM、Web 或 Node globals。测试由独立的 `tsconfig.test.json` 引入 Vitest 类型，边界探针则由 `tsconfig.boundaries.json` 验证 `fetch`、`localStorage`、`process`、`Buffer`、React 和 Three.js 在生产环境中不可用。

`lint` 还会检查包依赖声明，并禁止 Core、Simulation 生产源码导入 React、Three.js、R3F 和 Node built-in modules。

## 常见问题

- PowerShell 禁止执行 `pnpm.ps1`：可运行同一安装所带的 `pnpm.cmd`，无需更改系统执行策略。
- Playwright 找不到 Chromium：运行 `pnpm exec playwright install chromium` 后重试。
- WebGL 在虚拟机中不可用：确认 Chromium 未禁用硬件或软件 WebGL；Smoke Test 只检查画布链路，不做截图比较。
