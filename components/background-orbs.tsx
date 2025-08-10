"use client"

import type React from "react"

import { useEffect, useRef } from "react"

type BackgroundOrbsProps = {
  // 0 - 1: controls particle density and beam intensity
  density?: number
  // enable/disable interactivity
  interactive?: boolean
}

export default function BackgroundOrbs(
  { density = 0.9, interactive = true }: BackgroundOrbsProps = { density: 0.9, interactive: true },
) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    let width = 0
    let height = 0
    let raf = 0
    let pointerX = 0
    let pointerY = 0
    let mounted = true
    let lastTime = 0

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    type Star = {
      x: number
      y: number
      z: number // depth 0..1
      r: number // radius
      twinkle: number
      hue: number
    }

    const stars: Star[] = []
    const devicePixelRatio = Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1)

    function resize() {
      width = container.clientWidth
      height = container.clientHeight
      canvas.width = Math.floor(width * devicePixelRatio)
      canvas.height = Math.floor(height * devicePixelRatio)
      canvas.style.width = width + "px"
      canvas.style.height = height + "px"
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
    }

    function createStars() {
      stars.length = 0
      const count = Math.floor(((width * height) / 22000) * density) // ~100-180 on desktop
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random(), // 0(means near) .. 1(far)
          r: Math.random() * 1.8 + 0.4,
          twinkle: Math.random() * Math.PI * 2,
          hue: 220 + Math.random() * 40, // blue range
        })
      }
    }

    function setParallax(mx: number, my: number) {
      // mx, my are in pixels, provided by pointer or device tilt
      container.style.setProperty("--mx", mx.toFixed(2))
      container.style.setProperty("--my", my.toFixed(2))
    }

    function onPointerMove(e: PointerEvent) {
      if (!interactive) return
      const rect = container.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / (rect.width / 2) // -1..1
      const dy = (e.clientY - cy) / (rect.height / 2) // -1..1
      // scale the translation; smaller on mobile to avoid jitter
      const maxX = Math.min(36, rect.width * 0.04)
      const maxY = Math.min(24, rect.height * 0.035)
      pointerX = dx * maxX
      pointerY = dy * maxY
    }

    function onDeviceMotion(e: DeviceMotionEvent) {
      if (!interactive) return
      const ax = (e.accelerationIncludingGravity?.x || 0) / 9.81 // roughly -1..1
      const ay = (e.accelerationIncludingGravity?.y || 0) / 9.81
      const maxX = Math.min(30, width * 0.03)
      const maxY = Math.min(20, height * 0.025)
      pointerX = ax * maxX
      pointerY = ay * maxY
    }

    function draw(time: number) {
      if (!mounted) return
      const t = time / 1000
      const dt = lastTime ? Math.min(0.05, (time - lastTime) / 1000) : 0.016
      lastTime = time

      // Ease container parallax slightly for smoothness
      const currentMx = Number.parseFloat(getComputedStyle(container).getPropertyValue("--mx") || "0") || 0
      const currentMy = Number.parseFloat(getComputedStyle(container).getPropertyValue("--my") || "0") || 0
      const ease = 0.08
      const nextMx = currentMx + (pointerX - currentMx) * ease
      const nextMy = currentMy + (pointerY - currentMy) * ease
      setParallax(nextMx, nextMy)

      // Render stars
      ctx.clearRect(0, 0, width, height)

      if (!prefersReducedMotion) {
        for (let i = 0; i < stars.length; i++) {
          const s = stars[i]
          // parallax shift: closer stars move more with pointer
          const parallaxDepth = (1 - s.z) * 0.7 + 0.15 // 0.15..0.85
          const px = s.x + nextMx * parallaxDepth
          const py = s.y + nextMy * parallaxDepth

          // gentle drift
          s.x += (0.1 + (1 - s.z) * 0.2) * dt * 25
          if (s.x > width + 10) s.x = -10

          // twinkle
          const alpha = 0.25 + Math.abs(Math.sin(t * (1.0 + s.z * 1.2) + s.twinkle)) * (0.55 + 0.25 * (1 - s.z))
          const radius = s.r * (0.8 + 0.6 * Math.abs(Math.cos(t * 0.8 + s.twinkle)))

          // glow
          const grad = ctx.createRadialGradient(px, py, 0, px, py, radius * 6)
          grad.addColorStop(0, `hsla(${s.hue}, 90%, ${80 - s.z * 40}%, ${alpha})`)
          grad.addColorStop(1, `hsla(${s.hue}, 90%, 50%, 0)`)

          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(px, py, radius * (1.4 + (1 - s.z) * 0.6), 0, Math.PI * 2)
          ctx.fill()
        }
      } else {
        // Static subtle stars if reduced motion
        for (let i = 0; i < stars.length; i++) {
          const s = stars[i]
          ctx.fillStyle = `hsla(${s.hue}, 70%, ${70 - s.z * 30}%, 0.35)`
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      raf = requestAnimationFrame(draw)
    }

    function init() {
      resize()
      createStars()
      if (!prefersReducedMotion) {
        raf = requestAnimationFrame(draw)
      } else {
        // ensure first paint on reduced motion
        draw(0)
      }
    }

    window.addEventListener("resize", () => {
      resize()
      createStars()
    })

    if (interactive) {
      window.addEventListener("pointermove", onPointerMove, { passive: true })
      // Best-effort: some browsers require permission; this is optional
      window.addEventListener("devicemotion", onDeviceMotion as EventListener, { passive: true })
    }

    init()

    return () => {
      mounted = false
      cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onPointerMove as EventListener)
      window.removeEventListener("devicemotion", onDeviceMotion as EventListener)
    }
  }, [density, interactive])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      // CSS vars controlled at runtime
      style={
        {
          // fallback
          ["--mx" as any]: 0,
          ["--my" as any]: 0,
        } as React.CSSProperties
      }
    >
      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Animated gradient beams */}
      <div
        className="absolute -top-40 -left-40 h-[38rem] w-[38rem] rounded-full opacity-60 blur-3xl mix-blend-screen"
        style={{
          background:
            "conic-gradient(from 180deg at 50% 50%, rgba(255,255,255,0.15), rgba(65,105,225,0.35), rgba(0,0,139,0.25), rgba(255,255,255,0.15))",
          animation: "spin-slow 48s linear infinite",
        }}
      />
      <div
        className="absolute -bottom-48 -right-48 h-[32rem] w-[32rem] rounded-full opacity-50 blur-3xl mix-blend-screen"
        style={{
          background:
            "conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,0.12), rgba(65,105,225,0.3), rgba(0,0,139,0.2), rgba(255,255,255,0.12))",
          animation: "spin-rev 56s linear infinite",
        }}
      />

      {/* Orb wrappers for parallax (parent transforms), with animated children */}
      <div className="orb-wrap depth-12">
        <span className="orb orb-1" />
      </div>
      <div className="orb-wrap depth-10">
        <span className="orb orb-2" />
      </div>
      <div className="orb-wrap depth-8">
        <span className="orb orb-3" />
      </div>
      <div className="orb-wrap depth-6">
        <span className="orb orb-4" />
      </div>
      <div className="orb-wrap depth-4">
        <span className="orb orb-5" />
      </div>

      {/* Cursor light following pointer via CSS vars */}
      <div className="cursor-light" />

      <style jsx>{`
        .orb-wrap {
          position: absolute;
          will-change: transform;
          transform: translate3d(calc(var(--mx) * var(--depth)), calc(var(--my) * var(--depth)), 0);
          transition: transform 80ms ease-out;
        }

        .depth-12 { --depth: 1; }
        .depth-10 { --depth: 0.8; }
        .depth-8  { --depth: 0.6; }
        .depth-6  { --depth: 0.45; }
        .depth-4  { --depth: 0.3; }

        .orb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(22px);
          opacity: 0.5;
          mix-blend-mode: screen;
          will-change: transform, opacity, filter;
          transition: transform 0.6s ease, opacity 0.6s ease, filter 0.6s ease;
          box-shadow: 0 0 140px rgba(255, 255, 255, 0.16), inset 0 0 80px rgba(255, 255, 255, 0.14);
        }
        .orb:hover {
          opacity: 0.7;
          filter: blur(18px);
          transform: scale(1.05);
        }

        .orb-1 {
          width: 30rem; height: 30rem; top: -7rem; left: -7rem;
          background: radial-gradient(closest-side, rgba(255,255,255,0.5), rgba(65,105,225,0.35), rgba(0,0,139,0.2));
          animation: float-a 18s ease-in-out infinite;
        }
        .orb-2 {
          width: 24rem; height: 24rem; bottom: -5rem; right: -5rem;
          background: radial-gradient(closest-side, rgba(255,255,255,0.35), rgba(65,105,225,0.35), rgba(0,0,139,0.15));
          animation: float-b 20s ease-in-out infinite;
        }
        .orb-3 {
          width: 18rem; height: 18rem; top: 28%; right: 10%;
          background: radial-gradient(closest-side, rgba(255,255,255,0.34), rgba(65,105,225,0.3), rgba(0,0,139,0.14));
          animation: float-c 16s ease-in-out infinite;
        }
        .orb-4 {
          width: 14rem; height: 14rem; bottom: 16%; left: 12%;
          background: radial-gradient(closest-side, rgba(255,255,255,0.3), rgba(65,105,225,0.25), rgba(0,0,139,0.1));
          animation: float-d 22s ease-in-out infinite;
        }
        .orb-5 {
          width: 11rem; height: 11rem; top: 12%; left: 46%;
          background: radial-gradient(closest-side, rgba(255,255,255,0.28), rgba(65,105,225,0.22), rgba(0,0,139,0.08));
          animation: float-e 26s ease-in-out infinite;
        }

        .cursor-light {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            28rem 28rem at calc(50% + var(--mx) * 3) calc(50% + var(--my) * 3),
            rgba(255,255,255,0.08),
            rgba(255,255,255,0.02) 45%,
            rgba(255,255,255,0) 70%
          );
          transition: background 120ms ease-out;
          pointer-events: none;
          mix-blend-mode: screen;
        }

        @keyframes float-a { 0%,100% { transform: translate(0,0) } 50% { transform: translate(22px, 28px) } }
        @keyframes float-b { 0%,100% { transform: translate(0,0) } 50% { transform: translate(-24px, -18px) } }
        @keyframes float-c { 0%,100% { transform: translate(0,0) } 50% { transform: translate(16px, -16px) } }
        @keyframes float-d { 0%,100% { transform: translate(0,0) } 50% { transform: translate(-18px, 14px) } }
        @keyframes float-e { 0%,100% { transform: translate(0,0) } 50% { transform: translate(12px, -12px) } }

        @keyframes spin-slow { 0% { transform: rotate(0deg) } 100% { transform: rotate(360deg) } }
        @keyframes spin-rev  { 0% { transform: rotate(360deg) } 100% { transform: rotate(0deg) } }

        @media (prefers-reduced-motion: reduce) {
          .orb-1, .orb-2, .orb-3, .orb-4, .orb-5 { animation: none }
          .cursor-light { background: radial-gradient(24rem 24rem at 50% 50%, rgba(255,255,255,0.06), rgba(255,255,255,0.02) 45%, rgba(255,255,255,0) 70%) }
        }
      `}</style>
    </div>
  )
}
