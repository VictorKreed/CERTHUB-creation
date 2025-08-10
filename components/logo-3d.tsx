"use client"

import type React from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, Text3D } from "@react-three/drei"
import { useEffect, useRef, useState } from "react"
import type { Group } from "three"

type Target = { rx: number; ry: number }

type Logo3DProps = {
  text?: string
  className?: string
  interactive?: boolean
}

function CerthubMesh({
  text = "CERTHUB",
  interactive = true,
  target,
}: {
  text?: string
  interactive?: boolean
  target: React.MutableRefObject<Target>
}) {
  const group = useRef<Group>(null)
  const baseY = useRef(0)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    }
  }, [])

  useFrame((_, delta) => {
    if (!group.current) return

    // Reduced idle motion
    if (!reduced) {
      baseY.current += delta * 0.05 // was 0.15
    }

    const desiredX = interactive && !reduced ? target.current.rx : 0
    const desiredY = (interactive && !reduced ? target.current.ry : 0) + baseY.current

    const ease = 6
    group.current.rotation.x += (desiredX - group.current.rotation.x) * Math.min(1, ease * delta)
    group.current.rotation.y += (desiredY - group.current.rotation.y) * Math.min(1, ease * delta)
  })

  return (
    <group ref={group}>
      {/* Neutral white lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[6, 6, 8]} intensity={1} color="#f0f4ff" />
      <directionalLight position={[-6, -3, 3]} intensity={0.5} color="#e8efff" />
      <spotLight position={[0, 8, 10]} angle={0.6} penumbra={0.5} intensity={0.8} color="#eef3ff" />

      {/* 3D Text with white material */}
      <Text3D
        font="/fonts/Geist_Bold.json"
        size={1.8}
        height={0.5}
        curveSegments={16}
        bevelEnabled
        bevelThickness={0.08}
        bevelSize={0.05}
        bevelSegments={8}
      >
        {text}
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0.72}
          roughness={0.36}
          clearcoat={0.95}
          clearcoatRoughness={0.18}
          envMapIntensity={1.0}
          emissive="#6ea8ff"
          emissiveIntensity={0.015}
        />
      </Text3D>

      {/* Subtle white under-glow */}
      <mesh position={[0, -1.2, -0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[6, 48]} />
        <meshStandardMaterial color="#6ea8ff" transparent opacity={0.1} />
      </mesh>

      {/* Neutral reflections */}
      <Environment preset="studio" />
    </group>
  )
}

function InteractionPlane({
  setTarget,
  enabled,
}: {
  setTarget: (xNorm: number, yNorm: number) => void
  enabled: boolean
}) {
  const { camera, viewport } = useThree()
  const { width, height } = viewport.getCurrentViewport(camera, [0, 0, 0])

  return (
    <mesh
      position={[0, 0, 0]}
      onPointerMove={(e) => {
        if (!enabled) return
        const xNorm = (e.pointer.x + 1) / 2
        const yNorm = (1 - e.pointer.y) / 2
        setTarget(xNorm, yNorm)
      }}
      onPointerLeave={() => {
        if (!enabled) return
        setTarget(0.5, 0.5)
      }}
    >
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial transparent opacity={0} color="#000" />
    </mesh>
  )
}

export default function Logo3D(
  { text = "CERTHUB", className = "", interactive = true }: Logo3DProps = {
    text: "CERTHUB",
    className: "",
    interactive: true,
  },
) {
  const target = useRef<Target>({ rx: 0, ry: 0 })
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    }
  }, [])

  const setTarget = (xNorm: number, yNorm: number) => {
    // Softer pointer tilt
    target.current.rx = (0.5 - yNorm) * 0.25 // was 0.5
    target.current.ry = (xNorm - 0.5) * 0.3 // was 0.6
  }

  return (
    <div className={["relative w-full h-40 sm:h-48 lg:h-56", className].join(" ")}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <CerthubMesh text={text} interactive={interactive} target={target} />
        <InteractionPlane setTarget={setTarget} enabled={interactive && !reduced} />
      </Canvas>
    </div>
  )
}
