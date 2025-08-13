"use client"

type Logo2DProps = {
  text?: string
  className?: string
  // Controls glow intensity (0 to 1)
  glow?: number
}

export default function Logo2D(
  { text = "CERTHUB", className = "", glow = 0.6 }: Logo2DProps = {
    text: "CERTHUB",
    className: "",
    glow: 0.6,
  },
) {
  // Keep glow sane
  const glowStrength = Math.max(0, Math.min(1, glow))

  return (
    <div className={["relative select-none", className].join(" ")}>
      <svg
        role="img"
        aria-label={text}
        viewBox="0 0 1200 220"
        className="mx-auto h-32 w-full sm:h-40 lg:h-48"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="certhub-chrome" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="8%" stopColor="#f8fafc" />
            <stop offset="15%" stopColor="#e2e8f0" />
            <stop offset="25%" stopColor="#cbd5e1" />
            <stop offset="35%" stopColor="#94a3b8" />
            <stop offset="45%" stopColor="#64748b" />
            <stop offset="55%" stopColor="#475569" />
            <stop offset="65%" stopColor="#64748b" />
            <stop offset="75%" stopColor="#94a3b8" />
            <stop offset="85%" stopColor="#cbd5e1" />
            <stop offset="92%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#f8fafc" />
          </linearGradient>

          <linearGradient id="certhub-bevel" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="15%" stopColor="#f1f5f9" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#e2e8f0" stopOpacity="0.3" />
            <stop offset="85%" stopColor="#94a3b8" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#475569" stopOpacity="0" />
          </linearGradient>

          <filter id="certhub-pro-shadow" x="-50%" y="-50%" width="200%" height="200%">
            {/* Deep base shadow */}
            <feDropShadow dx="0" dy="12" stdDeviation="24" floodColor="#0f172a" floodOpacity="0.4" />
            {/* Medium shadow for depth */}
            <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="#1e293b" floodOpacity="0.3" />
            {/* Close shadow for definition */}
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#334155" floodOpacity="0.2" />
            {/* Tight shadow for crispness */}
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#475569" floodOpacity="0.15" />
          </filter>

          <linearGradient id="certhub-reflection" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="48%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="52%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              values="-120 0; 120 0; -120 0"
              dur="3s"
              repeatCount="indefinite"
            />
          </linearGradient>

          <filter id="certhub-inner-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="
                0 0 0 0 1
                0 0 0 0 1
                0 0 0 0 1
                0 0 0 0.6 0
              "
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="certhub-outer-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={8 + glowStrength * 12} result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="
                0 0 0 0 0.25
                0 0 0 0 0.45
                0 0 0 0 0.85
                0 0 0 0.4 0
              "
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <text
          x="50%"
          y="53%"
          dominantBaseline="middle"
          textAnchor="middle"
          style={{
            fontFamily:
              "var(--font-poppins), Poppins, var(--font-inter), Inter, ui-sans-serif, system-ui, -apple-system",
            fontWeight: 800,
            letterSpacing: "0.06em",
          }}
          fontSize="144"
          fill="url(#certhub-chrome)"
          filter="url(#certhub-pro-shadow)"
        >
          {text}
        </text>

        <text
          x="50%"
          y="53%"
          dominantBaseline="middle"
          textAnchor="middle"
          style={{
            fontFamily:
              "var(--font-poppins), Poppins, var(--font-inter), Inter, ui-sans-serif, system-ui, -apple-system",
            fontWeight: 800,
            letterSpacing: "0.06em",
          }}
          fontSize="144"
          fill="url(#certhub-bevel)"
          filter="url(#certhub-inner-glow)"
        >
          {text}
        </text>

        <text
          x="50%"
          y="53%"
          dominantBaseline="middle"
          textAnchor="middle"
          style={{
            fontFamily:
              "var(--font-poppins), Poppins, var(--font-inter), Inter, ui-sans-serif, system-ui, -apple-system",
            fontWeight: 800,
            letterSpacing: "0.06em",
          }}
          fontSize="144"
          fill="url(#certhub-reflection)"
          opacity="0.8"
        >
          {text}
        </text>

        <text
          x="50%"
          y="53%"
          dominantBaseline="middle"
          textAnchor="middle"
          style={{
            fontFamily:
              "var(--font-poppins), Poppins, var(--font-inter), Inter, ui-sans-serif, system-ui, -apple-system",
            fontWeight: 800,
            letterSpacing: "0.06em",
          }}
          fontSize="144"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="2"
          strokeOpacity="0.3"
          filter="url(#certhub-outer-glow)"
        >
          {text}
        </text>
      </svg>
    </div>
  )
}
