"use client"

type Logo2DProps = {
  text?: string
  className?: string
  // Controls accent intensity (0 to 1)
  accent?: number
}

export default function Logo2D(
  { text = "CERTHUB", className = "", accent = 0.8 }: Logo2DProps = {
    text: "CERTHUB",
    className: "",
    accent: 0.8,
  },
) {
  // Keep accent sane
  const accentStrength = Math.max(0, Math.min(1, accent))

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
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="30%" stopColor="#334155" />
            <stop offset="70%" stopColor="#475569" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>

          <linearGradient id="certhub-accent" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>

          <pattern id="certhub-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill="none" />
            <circle cx="20" cy="20" r="1" fill="#ffffff" opacity="0.1" />
            <rect x="18" y="18" width="4" height="4" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.05" />
          </pattern>

          <filter id="certhub-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000000" floodOpacity="0.15" />
          </filter>

          <linearGradient id="accent-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity={accentStrength} />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect x="100" y="40" width="1000" height="2" fill="url(#accent-line)" opacity="0.6" />
        <rect x="150" y="180" width="900" height="2" fill="url(#accent-line)" opacity="0.4" />

        <text
          x="50%"
          y="53%"
          dominantBaseline="middle"
          textAnchor="middle"
          style={{
            fontFamily:
              "var(--font-poppins), Poppins, var(--font-inter), Inter, ui-sans-serif, system-ui, -apple-system",
            fontWeight: 800,
            letterSpacing: "0.08em",
          }}
          fontSize="144"
          fill="url(#certhub-fill)"
          filter="url(#certhub-shadow)"
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
            letterSpacing: "0.08em",
          }}
          fontSize="144"
          fill="url(#certhub-pattern)"
          opacity="0.3"
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
            letterSpacing: "0.08em",
          }}
          fontSize="144"
          fill="url(#certhub-accent)"
          opacity={accentStrength * 0.2}
          mask="url(#cert-mask)"
        >
          {text}
        </text>

        <defs>
          <mask id="cert-mask">
            <rect width="1200" height="220" fill="black" />
            <text
              x="50%"
              y="53%"
              dominantBaseline="middle"
              textAnchor="middle"
              style={{
                fontFamily:
                  "var(--font-poppins), Poppins, var(--font-inter), Inter, ui-sans-serif, system-ui, -apple-system",
                fontWeight: 800,
                letterSpacing: "0.08em",
              }}
              fontSize="144"
              fill="white"
            >
              CERT
            </text>
          </mask>
        </defs>

        <g opacity={accentStrength * 0.4}>
          <rect x="80" y="60" width="30" height="3" fill="url(#certhub-accent)" />
          <rect x="80" y="60" width="3" height="30" fill="url(#certhub-accent)" />
          <rect x="1090" y="157" width="30" height="3" fill="url(#certhub-accent)" />
          <rect x="1117" y="130" width="3" height="30" fill="url(#certhub-accent)" />
        </g>
      </svg>
    </div>
  )
}
