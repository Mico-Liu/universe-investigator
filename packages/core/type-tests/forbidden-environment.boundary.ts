// This file is compiled only by tsconfig.boundaries.json. Each expected error
// proves that production code cannot access the corresponding environment API.

export {}

// @ts-expect-error -- browser network APIs are forbidden in Core.
void fetch('https://example.invalid')
// @ts-expect-error -- browser storage is forbidden in Core.
void localStorage
// @ts-expect-error -- browser navigator APIs are forbidden in Core.
void navigator
// @ts-expect-error -- browser WebSocket APIs are forbidden in Core.
void WebSocket
// @ts-expect-error -- Node process globals are forbidden in Core.
void process
// @ts-expect-error -- Node Buffer globals are forbidden in Core.
void Buffer
// @ts-expect-error -- the React module is unavailable in Core.
type ReactModule = typeof import('react')
// @ts-expect-error -- the Three.js module is unavailable in Core.
type ThreeModule = typeof import('three')
// @ts-expect-error -- Node built-in modules are unavailable in Core.
type NodeFsModule = typeof import('node:fs/promises')
