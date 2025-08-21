"use client"

import { useEffect, useRef } from "react"
import { GraduationCap, IdCard, ScrollText, FileCheck2, ShieldCheck } from "lucide-react"

/* ---------- Starfield (two twinkling layers, parallax with scroll) ---------- */
function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d", { alpha: true })!
    let raf = 0
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    let width = 0, height = 0

    type Star = { x: number; y: number; r: number; tw: number; v: number; drift: number }
    const far: Star[] = []
    const near: Star[] = []

    const seed = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = width + "px"
      canvas.style.height = height + "px"
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      far.length = 0; near.length = 0
      const countFar = Math.max(160, Math.floor((width * height) / 18000))
      const countNear = Math.max(110, Math.floor((width * height) / 26000))

      for (let i = 0; i < countFar; i++) {
        far.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.0 + 0.15,
          tw: Math.random() * Math.PI * 2,
          v: 0.4 + Math.random() * 1.0,
          drift: 0.02 + Math.random() * 0.03,
        })
      }
      for (let i = 0; i < countNear; i++) {
        near.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.6 + 0.35,
          tw: Math.random() * Math.PI * 2,
          v: 0.8 + Math.random() * 1.6,
          drift: 0.06 + Math.random() * 0.08,
        })
      }
    }

    let scrollY = 0
    const onScroll = () => { scrollY = window.scrollY }

    const draw = (t: number) => {
      const time = t / 1000
      ctx.clearRect(0, 0, width, height)

      for (const s of far) {
        const a = 0.15 + Math.abs(Math.sin(time * s.v + s.tw)) * 0.6
        ctx.globalAlpha = a
        ctx.fillStyle = "#e7ecff"
        const px = (s.x + scrollY * 0.03) % width
        ctx.beginPath()
        ctx.arc(px, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
        s.x += s.drift; if (s.x > width) s.x = 0
      }

      for (const s of near) {
        const a = 0.25 + Math.abs(Math.sin(time * s.v + s.tw)) * 0.75
        ctx.globalAlpha = a
        ctx.fillStyle = "#ffffff"
        const px = (s.x + scrollY * 0.06) % width
        ctx.beginPath()
        ctx.arc(px, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
        s.x += s.drift; if (s.x > width) s.x = 0
      }

      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    const onResize = () => seed()

    seed()
    window.addEventListener("resize", onResize)
    window.addEventListener("scroll", onScroll, { passive: true })
    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" aria-hidden="true" />
}

/* ---------- Futuristic grid + aurora beams ---------- */
function FuturisticBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "60px 60px, 60px 60px",
          maskImage:
            "radial-gradient(70% 60% at 50% 40%, rgba(0,0,0,0.9) 30%, rgba(0,0,0,0.6) 65%, rgba(0,0,0,1) 100%)",
        }}
      />
      <div
        className="absolute -top-40 -left-40 h-[44rem] w-[44rem] rounded-full blur-3xl opacity-50"
        style={{
          background:
            "conic-gradient(from 200deg at 50% 50%, rgba(117,157,255,0.15), rgba(30,60,170,0.25), rgba(255,255,255,0.12), rgba(117,157,255,0.15))",
          animation: "spin 70s linear infinite",
        }}
      />
      <div
        className="absolute -bottom-56 -right-56 h-[42rem] w-[42rem] rounded-full blur-3xl opacity-45"
        style={{
          background:
            "conic-gradient(from 20deg at 50% 50%, rgba(255,255,255,0.12), rgba(65,105,225,0.28), rgba(0,0,139,0.18), rgba(255,255,255,0.12))",
          animation: "spin-rev 80s linear infinite",
        }}
      />
      <style jsx>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes spin-rev { to { transform: rotate(-360deg); } }
      `}</style>
    </div>
  )
}

/* ---------- Drifting academic icons (background only) ---------- */
function FloatingAcademicIcons() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <IconChip style={{ top: "12%", left: "7%" }} hue="#8fb0ff"><ScrollText /></IconChip>
      <IconChip style={{ top: "22%", right: "9%" }} hue="#a7bbff"><GraduationCap /></IconChip>
      <IconChip style={{ bottom: "18%", left: "10%" }} hue="#a8c6ff"><IdCard /></IconChip>
      <IconChip style={{ bottom: "10%", right: "6%" }} hue="#9fb5ff"><FileCheck2 /></IconChip>
      <IconChip style={{ top: "55%", left: "45%" }} hue="#b8c8ff"><ShieldCheck /></IconChip>
    </div>
  )
}

function IconChip({
  children,
  style,
  hue = "#a8baff",
}: {
  children: React.ReactNode
  style?: React.CSSProperties
  hue?: string
}) {
  const delay = Math.random() * 4
  const dur = 10 + Math.random() * 6
  return (
    <div className="absolute" style={{ ...style, animation: `floatY ${dur}s ease-in-out ${delay}s infinite`, opacity: 0.22 }}>
      <div className="grid place-items-center rounded-2xl border border-white/10"
        style={{ width: 54, height: 54, background: "rgba(255,255,255,0.05)", boxShadow: "0 10px 30px rgba(0,0,0,0.25)", color: hue }}>
        <div className="[&>*]:h-6 [&>*]:w-6" style={{ color: hue }}>{children}</div>
      </div>
      <style jsx>{`
        @keyframes floatY { 0% { transform: translateY(0) } 50% { transform: translateY(-10px) } 100% { transform: translateY(0) } }
      `}</style>
    </div>
  )
}

/* ---------- Export a single background layer ---------- */
export default function BackgroundFX() {
  return (
    <>
      <Starfield />
      <FuturisticBackdrop />
      <FloatingAcademicIcons />
    </>
  )
}
