import { expect, test } from '@playwright/test'

test('NEXUS bootstrap scene is online', async ({ page }) => {
  const consoleErrors: string[] = []
  const pageErrors: string[] = []

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text())
    }
  })
  page.on('pageerror', (error) => {
    pageErrors.push(error.message)
  })

  await page.goto('/')

  const webglRegion = page.getByTestId('webgl-region')
  const canvas = webglRegion.locator('canvas')

  await expect(page.getByRole('heading', { name: 'NEXUS' })).toBeVisible()
  await expect(webglRegion).toHaveAttribute('data-renderer-ready', 'true')
  await expect(page.getByText('SYSTEM ONLINE')).toBeVisible()
  await expect(canvas).toBeVisible()

  const completedFrame = Number(
    await webglRegion.getAttribute('data-renderer-completed-frame'),
  )
  const renderCalls = Number(
    await webglRegion.getAttribute('data-renderer-draw-calls'),
  )

  expect(completedFrame).toBeGreaterThan(0)
  expect(renderCalls).toBeGreaterThan(0)

  const contextState = await canvas.evaluate((element) => {
    const webglCanvas = element as HTMLCanvasElement
    const context =
      webglCanvas.getContext('webgl2') ?? webglCanvas.getContext('webgl')

    if (!context) {
      return null
    }

    return {
      drawingBufferHeight: context.drawingBufferHeight,
      drawingBufferWidth: context.drawingBufferWidth,
      isLost: context.isContextLost(),
    }
  })

  expect(contextState, 'WebGL/WebGL2 context must be available').not.toBeNull()
  expect(contextState?.isLost).toBe(false)
  expect(contextState?.drawingBufferWidth).toBeGreaterThan(0)
  expect(contextState?.drawingBufferHeight).toBeGreaterThan(0)

  await canvas.evaluate((element) => {
    const webglCanvas = element as HTMLCanvasElement
    const context =
      webglCanvas.getContext('webgl2') ?? webglCanvas.getContext('webgl')
    const extension = context?.getExtension('WEBGL_lose_context')

    if (!extension) {
      throw new Error('WEBGL_lose_context is required for the regression test')
    }

    const testWindow = window as Window & {
      __webglLoseContextExtension?: WEBGL_lose_context
    }
    testWindow.__webglLoseContextExtension = extension
    extension.loseContext()
  })

  await expect(webglRegion).toHaveAttribute('data-renderer-ready', 'false')
  await expect(webglRegion).toHaveAttribute(
    'data-renderer-completed-frame',
    '0',
  )
  await expect(page.getByText('SYSTEM INITIALIZING')).toBeVisible()
  await expect(page.getByText('SYSTEM ONLINE')).toHaveCount(0)

  const restoreObservation = await canvas.evaluate((element) => {
    const webglCanvas = element as HTMLCanvasElement
    const webglRegion = webglCanvas.closest('[data-testid="webgl-region"]')
    const testWindow = window as Window & {
      __webglLoseContextExtension?: WEBGL_lose_context
    }
    const extension = testWindow.__webglLoseContextExtension

    if (!webglRegion || !extension) {
      throw new Error('WebGL restore test state is unavailable')
    }

    return new Promise<{
      readyAfterFirstAnimationFrame: string | null
      readyAtRestore: string | null
    }>((resolve) => {
      webglCanvas.addEventListener(
        'webglcontextrestored',
        () => {
          const readyAtRestore = webglRegion.getAttribute('data-renderer-ready')

          requestAnimationFrame(() => {
            resolve({
              readyAfterFirstAnimationFrame: webglRegion.getAttribute(
                'data-renderer-ready',
              ),
              readyAtRestore,
            })
          })
        },
        { once: true },
      )

      extension.restoreContext()
    })
  })

  expect(restoreObservation.readyAtRestore).toBe('false')
  expect(restoreObservation.readyAfterFirstAnimationFrame).toBe('false')
  await expect(webglRegion).toHaveAttribute('data-renderer-ready', 'true')
  await expect(page.getByText('SYSTEM ONLINE')).toBeVisible()

  expect(pageErrors, 'pageerror events must fail the smoke test').toEqual([])
  expect(consoleErrors, 'console errors must fail the smoke test').toEqual([])
})
