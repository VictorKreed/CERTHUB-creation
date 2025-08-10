"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { type LucideIcon, ScrollText, GraduationCap, BookOpen, ShieldCheck, FileCheck2 } from "lucide-react"

type FloatingIconsProps = {
  className?: string
  // 0..1 controls overall visibility of the icons
  intensity?: number
  // enable/disable pointer parallax
  interactive?: boolean
}

export default function FloatingIcons(
  { className = "", intensity = 1, interactive = true }: FloatingIconsProps = {
    className: "",
    intensity: 1,
    interactive: true,
  },
) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let mx = 0
    let my = 0
    let tx = 0
    let ty = 0
    let raf = 0
    let mounted = true

    function setVars(x: number, y: number) {
      el.style.setProperty("--mx", x.toFixed(2))
      el.style.setProperty("--my", y.toFixed(2))
    }

    function onPointerMove(e: PointerEvent) {
      if (!interactive) return
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / (rect.width / 2) // -1..1
      const dy = (e.clientY - cy) / (rect.height / 2)
      const maxX = Math.min(28, rect.width * 0.04)
      const maxY = Math.min(18, rect.height * 0.03)
      mx = dx * maxX
      my = dy * maxY
    }

    function tick() {
      if (!mounted) return
      // smooth easing
      tx += (mx - tx) * 0.08
      ty += (my - ty) * 0.08
      setVars(tx, ty)
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true })
    setVars(0, 0)
    raf = requestAnimationFrame(tick)

    return () => {
      mounted = false
      cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onPointerMove)
    }
  }, [interactive])

  // visible, darker bluish icons by design; opacity scaled by intensity
  const op = Math.max(0, Math.min(1, intensity))

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={["pointer-events-none absolute inset-0 overflow-hidden", className].join(" ")}
      style={
        {
          ["--mx" as any]: 0,
          ["--my" as any]: 0,
        } as React.CSSProperties
      }
    >
      {/* Outer-edge larger icons */}
      <IconBubble
        icon={ScrollText}
        style={{ top: "8%", left: "6%" }}
        size="clamp(34px, 5.5vw, 64px)"
        opacity={0.26 * op}
        delay="0s"
        hue="#203b94"
        depth={0.9}
      />
      <IconBubble
        icon={GraduationCap}
        style={{ top: "20%", right: "8%" }}
        size="clamp(32px, 5vw, 60px)"
        opacity={0.28 * op}
        delay="1.5s"
        hue="#1f3aaa"
        depth={0.75}
      />
      <IconBubble
        icon={BookOpen}
        className="hidden md:block"
        style={{ bottom: "14%", left: "10%" }}
        size="clamp(30px, 4.6vw, 56px)"
        opacity={0.26 * op}
        delay="0.8s"
        hue="#243a78"
        depth={0.7}
      />
      <IconBubble
        icon={ShieldCheck}
        className="hidden sm:block"
        style={{ bottom: "8%", right: "6%" }}
        size="clamp(30px, 4.6vw, 56px)"
        opacity={0.24 * op}
        delay="2.2s"
        hue="#2a47a1"
        depth={0.6}
      />
      <IconBubble
        icon={FileCheck2}
        className="hidden lg:block"
        style={{ top: "44%", left: "48%" }}
        size="clamp(28px, 4vw, 52px)"
        opacity={0.26 * op}
        delay="1.1s"
        hue="#27439a"
        depth={0.5}
      />

      {/* Inner, smaller icons */}
      <IconBubble
        icon={ScrollText}
        className="hidden md:block"
        style={{ top: "32%", left: "18%" }}
        size="clamp(24px, 3.6vw, 44px)"
        opacity={0.22 * op}
        delay="0.4s"
        hue="#23366e"
        depth={0.45}
      />
      <IconBubble
        icon={GraduationCap}
        className="hidden md:block"
        style={{ top: "62%", right: "18%" }}
        size="clamp(24px, 3.6vw, 44px)"
        opacity={0.22 * op}
        delay="1.8s"
        hue="#20326a"
        depth={0.4}
      />

      <style jsx>{`
        .parallax-wrap {
          position: absolute;
          will-change: transform;
          transform: translate3d(calc(var(--mx) * var(--depth)), calc(var(--my) * var(--depth)), 0);
          transition: transform 80ms ease-out;
        }

        @keyframes float-slow {
          0%   { transform: translateY(0) rotate(0deg); }
          50%  { transform: translateY(-10px) rotate(2deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        @keyframes drift {
          0%   { transform: translateX(0); }
          50%  { transform: translateX(10px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}

function IconBubble({
  icon: Icon,
  style,
  size,
  opacity = 0.26,
  delay = "0s",
  hue = "#2a47a1",
  depth = 0.6,
  className = "",
}: {
  icon: LucideIcon
  style?: React.CSSProperties
  size: string
  opacity?: number
  delay?: string
  hue?: string
  depth?: number
  className?: string
}) {
  return (
    <div
      className={["parallax-wrap", className].join(" ")}
      style={{
        ...style,
        ["--depth" as any]: String(depth),
      }}
    >
      {/* The animated bubble itself */}
      <div
        className="flex items-center justify-center rounded-2xl"
        style={{
          width: size,
          height: size,
          color: hue,
          opacity,
          background: "radial-gradient(120% 120% at 50% 15%, rgba(240,245,255,0.42), rgba(240,245,255,0) 62%)",
          // stronger presence
          boxShadow:
            "0 0 0 1px rgba(42,71,161,0.12), 0 10px 34px rgba(42,71,161,0.12), inset 0 -6px 14px rgba(42,71,161,0.14)",
          mixBlendMode: "normal",
          willChange: "transform, opacity",
          // stack both idle float and lateral drift on an inner wrapper
          animation: `float-slow 10s ease-in-out ${delay} infinite alternate`,
        }}
      >
        <div
          className="grid place-items-center"
          style={{
            width: "74%",
            height: "74%",
            filter: "drop-shadow(0 6px 18px rgba(42,71,161,0.18))",
          }}
        >
          <Icon className="w-full h-full" strokeWidth={2.6} />
        </div>
      </div>
    </div>
  )
}
