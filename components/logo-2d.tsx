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
          <linearGradient id="certhub-fill" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="15%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#e2e8f0" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="65%" stopColor="#cbd5e1" />
            <stop offset="85%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
            <animateTransform
              attributeName="gradientTransform"
              type="rotate"
              from="0 600 110"
              to="360 600 110"
              dur="20s"
              repeatCount="indefinite"
            />
          </linearGradient>

          <linearGradient id="certhub-stroke" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="25%" stopColor="#94a3b8" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="75%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          <filter id="certhub-glow" x="-50%" y="-80%" width="200%" height="260%">
            {/* Outer blue glow */}
            <feGaussianBlur in="SourceGraphic" stdDeviation={12 + glowStrength * 15} result="blur1" />
            <feColorMatrix
              in="blur1"
              type="matrix"
              values="
                0 0 0 0 0.40
                0 0 0 0 0.60
                0 0 0 0 1.00
                0 0 0 0.3 0
              "
              result="glow1"
            />

            {/* Inner white glow */}
            <feGaussianBlur in="SourceGraphic" stdDeviation={6 + glowStrength * 8} result="blur2" />
            <feColorMatrix
              in="blur2"
              type="matrix"
              values="
                0 0 0 0 0.95
                0 0 0 0 0.98
                0 0 0 0 1.00
                0 0 0 0.4 0
              "
              result="glow2"
            />

            {/* Tight highlight glow */}
            <feGaussianBlur in="SourceGraphic" stdDeviation={2} result="blur3" />
            <feColorMatrix
              in="blur3"
              type="matrix"
              values="
                0 0 0 0 1.00
                0 0 0 0 1.00
                0 0 0 0 1.00
                0 0 0 0.6 0
              "
              result="glow3"
            />

            <feMerge>
              <feMergeNode in="glow1" />
              <feMergeNode in="glow2" />
              <feMergeNode in="glow3" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="certhub-highlight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="30%" stopColor="#f1f5f9" stopOpacity="0.7" />
            <stop offset="70%" stopColor="#e2e8f0" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0" />
          </linearGradient>

          <filter id="certhub-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="#1e293b" floodOpacity="0.25" />
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#334155" floodOpacity="0.15" />
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#475569" floodOpacity="0.1" />
          </filter>

          <linearGradient id="certhub-shine" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              values="-100 0; 200 0; -100 0"
              dur="4s"
              repeatCount="indefinite"
            />
          </linearGradient>

          <mask id="certhub-highlight-mask">
            <rect x="0" y="0" width="1200" height="220" fill="url(#certhub-highlight)" />
          </mask>
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
          fill="#6366f1"
          opacity={0.15 + glowStrength * 0.2}
          filter="url(#certhub-glow)"
        >
          {text}
        </text>

        <text
          x="50%"
          y="53%"
          dominantBaseline="middle"
          textAnchor="middle"
          style={{
            paintOrder: "stroke fill",
            fontFamily:
              "var(--font-poppins), Poppins, var(--font-inter), Inter, ui-sans-serif, system-ui, -apple-system",
            fontWeight: 800,
            letterSpacing: "0.06em",
          }}
          fontSize="144"
          fill="none"
          stroke="url(#certhub-stroke)"
          strokeWidth="14"
          strokeLinejoin="round"
          strokeLinecap="round"
          filter="url(#certhub-shadow)"
        >
          {text}
        </text>

        {/* Main metallic fill with shadow */}
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
          fill="url(#certhub-fill)"
          filter="url(#certhub-shadow)"
        >
          {text}
        </text>

        <g mask="url(#certhub-highlight-mask)">
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
            fill="#ffffff"
            opacity="0.4"
          >
            {text}
          </text>
        </g>

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
          fill="url(#certhub-shine)"
          opacity="0.6"
        >
          {text}
        </text>
      </svg>
    </div>
  )
}
