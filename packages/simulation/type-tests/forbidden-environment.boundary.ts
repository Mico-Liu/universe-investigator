// This file is compiled only by tsconfig.boundaries.json. Each expected error
// proves that production code cannot access the corresponding environment API.

export {}

// @ts-expect-error -- browser network APIs are forbidden in Simulation.
void fetch('https://example.invalid')
// @ts-expect-error -- browser storage is forbidden in Simulation.
void localStorage
// @ts-expect-error -- browser navigator APIs are forbidden in Simulation.
void navigator
// @ts-expect-error -- browser WebSocket APIs are forbidden in Simulation.
void WebSocket
// @ts-expect-error -- Node process globals are forbidden in Simulation.
void process
// @ts-expect-error -- Node Buffer globals are forbidden in Simulation.
void Buffer
// @ts-expect-error -- the React module is unavailable in Simulation.
type ReactModule = typeof import('react')
// @ts-expect-error -- the Three.js module is unavailable in Simulation.
type ThreeModule = typeof import('three')
// @ts-expect-error -- Node built-in modules are unavailable in Simulation.
type NodeFsModule = typeof import('node:fs/promises')
