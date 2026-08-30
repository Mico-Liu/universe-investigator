import { Float } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ProjectMetadataSchema } from '@universe-investigator/content'
import { CORE_VERSION } from '@universe-investigator/core'
import { clamp01 } from '@universe-investigator/simulation'
import { useEffect, useRef, useState } from 'react'

const metadata = ProjectMetadataSchema.parse({
  id: 'universe-investigator',
  version: CORE_VERSION,
})

function NovaPlaceholder() {
  const glowOpacity = clamp01(0.2)

  return (
    <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.4}>
      <group aria-label="NOVA placeholder">
        <mesh>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial
            color="#7de7ff"
            emissive="#169ec5"
            emissiveIntensity={2.4}
            metalness={0.35}
            roughness={0.18}
          />
        </mesh>
        <mesh scale={1.35}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            color="#5ad7ff"
            opacity={glowOpacity}
            transparent
            wireframe
          />
        </mesh>
      </group>
    </Float>
  )
}

interface RendererReadyEvidence {
  completedFrame: number
  renderCalls: number
}

interface RendererReadySignalProps {
  onReadyChange: (evidence: RendererReadyEvidence | null) => void
}

function RendererReadySignal({ onReadyChange }: RendererReadySignalProps) {
  const renderer = useThree((state) => state.gl)
  const readyRef = useRef(false)
  const observedFrameRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = renderer.domElement
    const resetQualification = () => {
      readyRef.current = false
      observedFrameRef.current = null
      onReadyChange(null)
    }
    const handleContextLost = (event: Event) => {
      event.preventDefault()
      resetQualification()
    }
    const handleContextRestored = () => resetQualification()

    canvas.addEventListener('webglcontextlost', handleContextLost)
    canvas.addEventListener('webglcontextrestored', handleContextRestored)

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost)
      canvas.removeEventListener('webglcontextrestored', handleContextRestored)
    }
  }, [onReadyChange, renderer])

  useFrame(() => {
    const context = renderer.getContext()
    const hasDrawingBuffer =
      context.drawingBufferWidth > 0 && context.drawingBufferHeight > 0

    if (context.isContextLost() || !hasDrawingBuffer) {
      if (readyRef.current || observedFrameRef.current !== null) {
        readyRef.current = false
        observedFrameRef.current = null
        onReadyChange(null)
      }
      return
    }

    if (readyRef.current) {
      return
    }

    const currentRendererFrame = renderer.info.render.frame

    if (observedFrameRef.current === null) {
      // R3F invokes useFrame subscribers before gl.render. Record only a
      // baseline here; this callback cannot prove that its own frame rendered.
      observedFrameRef.current = currentRendererFrame
      return
    }

    const previousFrameRendered =
      currentRendererFrame > observedFrameRef.current &&
      renderer.info.render.calls > 0

    if (previousFrameRendered) {
      readyRef.current = true
      onReadyChange({
        completedFrame: currentRendererFrame,
        renderCalls: renderer.info.render.calls,
      })
    }
  })

  return null
}

export function App() {
  const [rendererEvidence, setRendererEvidence] =
    useState<RendererReadyEvidence | null>(null)
  const rendererReady = rendererEvidence !== null

  return (
    <main className="bootstrap-shell" data-version={metadata.version}>
      <div
        aria-busy={!rendererReady}
        className="scene"
        data-renderer-completed-frame={rendererEvidence?.completedFrame ?? 0}
        data-renderer-draw-calls={rendererEvidence?.renderCalls ?? 0}
        data-renderer-ready={rendererReady}
        data-testid="webgl-region"
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <color attach="background" args={['#02070d']} />
          <ambientLight intensity={0.35} />
          <pointLight position={[3, 3, 4]} color="#9aeaff" intensity={15} />
          <pointLight position={[-3, -2, 2]} color="#264dff" intensity={8} />
          <NovaPlaceholder />
          <RendererReadySignal onReadyChange={setRendererEvidence} />
        </Canvas>
      </div>

      <header className="hud" aria-label="NEXUS bootstrap status">
        <p className="eyebrow">VERTICAL SLICE / BOOTSTRAP</p>
        <h1>NEXUS</h1>
        <p className="status">
          <span className="status-dot" aria-hidden="true" />
          {rendererReady ? 'SYSTEM ONLINE' : 'SYSTEM INITIALIZING'}
        </p>
      </header>
    </main>
  )
}
