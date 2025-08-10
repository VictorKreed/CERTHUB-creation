"use client"

import { ScrollText } from "lucide-react"

type HeroWordmarkProps = {
  text?: string
  insertIndex?: number // split CERT|HUB
  className?: string
}

export default function HeroWordmark({ text = "CERTHUB", insertIndex = 4, className = "" }: HeroWordmarkProps) {
  const left = text.slice(0, insertIndex)
  const right = text.slice(insertIndex)

  return (
    <div className={["relative w-full select-none", className].join(" ")}>
      {/* Stroke layer for crisp edge */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center"
        style={{
          filter: "saturate(1.05)",
        }}
      >
        <div
          className="text-transparent"
          style={{
            WebkitTextStroke: "10px transparent",
            textShadow:
              "0 0 0 #cfe0ff, 0 1px 0 #cfe0ff, 0 2px 0 #cfe0ff, 0 3px 0 #cfe0ff, 0 4px 10px rgba(83,109,254,0.08)",
          }}
        >
          <span
            className="font-extrabold tracking-[0.06em]"
            style={{ fontSize: "clamp(48px, 10vw, 144px)", lineHeight: 1 }}
          >
            {left}
          </span>
          <span className="mx-3 sm:mx-4" />
          <span
            className="font-extrabold tracking-[0.06em]"
            style={{ fontSize: "clamp(48px, 10vw, 144px)", lineHeight: 1 }}
          >
            {right}
          </span>
        </div>
      </div>

      {/* Fill layer with gradient */}
      <div className="relative flex items-center justify-center">
        <div
          aria-label={text}
          className="text-transparent bg-clip-text [-webkit-background-clip:text]"
          style={{
            backgroundImage: "linear-gradient(90deg, #0f172a 0%, #1f2a44 40%, #2a47a1 100%)",
            filter: "saturate(1.02)",
          }}
        >
          <span
            className="font-extrabold tracking-[0.06em]"
            style={{ fontSize: "clamp(48px, 10vw, 144px)", lineHeight: 1 }}
          >
            {left}
          </span>

          {/* Faux-3D token with hover tilt + shine */}
          <span className="align-baseline mx-3 sm:mx-4 inline-flex items-center">
            <span
              className="token-3d group relative inline-flex items-center justify-center rounded-2xl"
              style={{
                height: "1.2em",
                width: "1.2em",
                background:
                  "linear-gradient(180deg, #f7faff 0%, #ffffff 40%, #e9f0ff 65%, #d9e5ff 100%), radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.85), rgba(255,255,255,0) 60%)",
                border: "1px solid rgba(42,71,161,0.25)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -6px 10px rgba(42,71,161,0.18), 0 12px 28px rgba(42,71,161,0.25), 0 2px 6px rgba(16,24,40,0.08)",
                transform: "perspective(700px) rotateX(4deg)",
                transition: "transform 220ms ease, box-shadow 220ms ease, filter 220ms ease",
              }}
              aria-hidden="true"
            >
              {/* Shine sweep */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{
                  background:
                    "linear-gradient(110deg, rgba(255,255,255,0) 0%, rgba(190,210,255,0.45) 50%, rgba(255,255,255,0) 100%)",
                  mixBlendMode: "screen",
                  transform: "translateX(-120%)",
                  transition: "transform 600ms ease",
                }}
              />
              <ScrollText
                className="text-[#2a47a1]"
                strokeWidth={2.6}
                style={{ height: "78%", width: "78%" }}
                aria-hidden="true"
              />
            </span>
          </span>

          <span
            className="font-extrabold tracking-[0.06em]"
            style={{ fontSize: "clamp(48px, 10vw, 144px)", lineHeight: 1 }}
          >
            {right}
          </span>
        </div>
      </div>

      {/* Animated sheen across text */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2"
        style={{
          height: "26%",
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(180,200,255,0.25) 45%, rgba(255,255,255,0) 100%)",
          maskImage: "linear-gradient(to bottom, transparent 0%, white 15%, white 85%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, white 15%, white 85%, transparent 100%)",
          animation: "sheen-hero 9s linear infinite",
        }}
      />
      <style jsx>{`
        @keyframes sheen-hero {
          0% { transform: translateY(-50%) translateX(-40%); opacity: 0.75; }
          50% { transform: translateY(-50%) translateX(30%); opacity: 0.95; }
          100% { transform: translateY(-50%) translateX(110%); opacity: 0.8; }
        }
        /* Hover interactions for the token */
        .token-3d:hover {
          transform: perspective(700px) rotateX(0deg) translateY(-1px);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.95),
            inset 0 -6px 12px rgba(42,71,161,0.22),
            0 16px 34px rgba(42,71,161,0.28),
            0 4px 10px rgba(16,24,40,0.12);
        }
        .token-3d:hover > span:first-child {
          transform: translateX(120%);
        }
      `}</style>
    </div>
  )
}
