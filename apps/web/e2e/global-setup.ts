import { fileURLToPath } from 'node:url'

import { createServer } from 'vite'

export default async function globalSetup() {
  const root = fileURLToPath(new URL('..', import.meta.url))
  const server = await createServer({
    root,
    server: {
      host: '127.0.0.1',
      port: 4173,
      strictPort: true,
    },
  })

  await server.listen()

  return async () => {
    await server.close()
  }
}
