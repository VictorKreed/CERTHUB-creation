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
          {/* Soft blue-white fill gradient */}
          <linearGradient id="certhub-fill" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#f2f6ff" />
            <stop offset="100%" stopColor="#dbe7ff" />
            <animateTransform
              attributeName="gradientTransform"
              type="rotate"
              from="0 600 110"
              to="360 600 110"
              dur="24s"
              repeatCount="indefinite"
            />
          </linearGradient>

          {/* Stroke gradient for a subtle beveled edge look */}
          <linearGradient id="certhub-stroke" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#eaf1ff" />
            <stop offset="100%" stopColor="#c7d7ff" />
            <animateTransform
              attributeName="gradientTransform"
              type="rotate"
              from="360 600 110"
              to="0 600 110"
              dur="28s"
              repeatCount="indefinite"
            />
          </linearGradient>

          {/* Soft outer glow */}
          <filter id="certhub-glow" x="-30%" y="-50%" width="160%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={8 + glowStrength * 10} result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="
                0 0 0 0 0.80
                0 0 0 0 0.88
                0 0 0 0 1.00
                0 0 0 0.0 0
              "
              result="tint"
            />
            <feMerge>
              <feMergeNode in="tint" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Slight inner highlight using a vertical gradient mask */}
          <linearGradient id="certhub-highlight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <mask id="certhub-highlight-mask">
            <rect x="0" y="0" width="1200" height="220" fill="url(#certhub-highlight)" />
          </mask>
        </defs>

        {/* Optional base glow behind the text for legibility */}
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
          fill="#a6bfff"
          opacity={0.22 + glowStrength * 0.15}
          filter="url(#certhub-glow)"
        >
          {text}
        </text>

        {/* Stroke (paint first for crisp edges) */}
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
          strokeWidth="10"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity="0.9"
        >
          {text}
        </text>

        {/* Main gradient fill */}
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
        >
          {text}
        </text>

        {/* Subtle top highlight masked across the text */}
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
            opacity="0.08"
          >
            {text}
          </text>
        </g>
      </svg>
    </div>
  )
}
