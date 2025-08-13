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
          <linearGradient id="certhub-blue" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#dbeafe" />
            <stop offset="8%" stopColor="#bfdbfe" />
            <stop offset="15%" stopColor="#93c5fd" />
            <stop offset="25%" stopColor="#60a5fa" />
            <stop offset="35%" stopColor="#3b82f6" />
            <stop offset="45%" stopColor="#2563eb" />
            <stop offset="55%" stopColor="#1d4ed8" />
            <stop offset="65%" stopColor="#1e40af" />
            <stop offset="75%" stopColor="#1e3a8a" />
            <stop offset="85%" stopColor="#1e3a8a" />
            <stop offset="92%" stopColor="#312e81" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>

          <linearGradient id="certhub-blue-bevel" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.9" />
            <stop offset="15%" stopColor="#bfdbfe" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.3" />
            <stop offset="85%" stopColor="#1d4ed8" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="scroll-brown" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="15%" stopColor="#fde68a" />
            <stop offset="30%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="70%" stopColor="#b45309" />
            <stop offset="85%" stopColor="#92400e" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          <linearGradient id="scroll-shadow" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#78350f" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#451a03" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#1c0701" stopOpacity="0.4" />
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
            <stop offset="0%" stopColor="#dbeafe" stopOpacity="0" />
            <stop offset="40%" stopColor="#dbeafe" stopOpacity="0" />
            <stop offset="48%" stopColor="#dbeafe" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="52%" stopColor="#dbeafe" stopOpacity="0.3" />
            <stop offset="60%" stopColor="#dbeafe" stopOpacity="0" />
            <stop offset="100%" stopColor="#dbeafe" stopOpacity="0" />
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
                0 0 0 0 0.2
                0 0 0 0 0.4
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
                0 0 0 0 0.1
                0 0 0 0 0.3
                0 0 0 0 0.9
                0 0 0 0.4 0
              "
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="scroll-shadow-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#451a03" floodOpacity="0.5" />
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#78350f" floodOpacity="0.3" />
          </filter>
        </defs>

        <g transform="translate(600, 110)">
          {/* Scroll body */}
          <rect
            x="-180"
            y="-45"
            width="360"
            height="90"
            rx="8"
            ry="8"
            fill="url(#scroll-brown)"
            filter="url(#scroll-shadow-filter)"
          />

          {/* Left scroll end */}
          <circle cx="-180" cy="0" r="45" fill="url(#scroll-brown)" filter="url(#scroll-shadow-filter)" />

          {/* Right scroll end */}
          <circle cx="180" cy="0" r="45" fill="url(#scroll-brown)" filter="url(#scroll-shadow-filter)" />

          {/* Scroll inner shadow for depth */}
          <rect x="-175" y="-40" width="350" height="80" rx="6" ry="6" fill="url(#scroll-shadow)" opacity="0.3" />

          {/* Scroll highlight */}
          <rect x="-175" y="-40" width="350" height="15" rx="6" ry="6" fill="#fef3c7" opacity="0.6" />
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
          fill="url(#certhub-blue)"
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
          fill="url(#certhub-blue-bevel)"
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
          stroke="#1d4ed8"
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
