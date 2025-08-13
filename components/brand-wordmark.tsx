"use client"

type BrandWordmarkProps = {
  text?: string
  // Insert the logo between text segments, defaults to after 4 chars for "CERT[logo]HUB"
  insertIndex?: number
  // Exact Source URL as requested
  logoSrc?: string
  // Tailwind height class for the wordmark container (scales the whole unit)
  sizeClass?: string
  // Controls visual style on dark vs light backgrounds
  variant?: "light" | "dark"
  // Adjust spacing around the logo token
  gapClass?: string
  // Accessibility alt text for the embedded logo
  logoAlt?: string
}

export default function BrandWordmark({
  text = "CERTHUB",
  insertIndex = 4,
  logoSrc = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/shield%20certhub.jpg-sA98LABQNLs5VcEkLeeCGPjYQoOuiV.jpeg",
  sizeClass = "h-16 sm:h-20 lg:h-24",
  variant = "dark",
  gapClass = "mx-2 sm:mx-3",
  logoAlt = "CERTHUB logo",
}: BrandWordmarkProps) {
  const left = text.slice(0, insertIndex)
  const right = text.slice(insertIndex)

  const fillGradient =
    variant === "dark"
      ? "bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_20%,#e2e8f0_40%,#ffffff_60%,#cbd5e1_80%,#f1f5f9_100%)]"
      : "bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_25%,#334155_50%,#475569_75%,#64748b_100%)]"

  const strokeGradient =
    variant === "dark"
      ? "bg-[linear-gradient(90deg,#94a3b8_0%,#ffffff_30%,#e2e8f0_50%,#ffffff_70%,#94a3b8_100%)]"
      : "bg-[linear-gradient(90deg,#4a5b8f_0%,#5d79d6_30%,#ffffff_50%,#5d79d6_70%,#4a5b8f_100%)]"

  const textShadow =
    variant === "dark"
      ? "drop-shadow-[0_8px_32px_rgba(100,116,139,0.4)] drop-shadow-[0_4px_16px_rgba(148,163,184,0.3)] drop-shadow-[0_2px_8px_rgba(203,213,225,0.2)]"
      : "drop-shadow-[0_8px_32px_rgba(15,23,42,0.4)] drop-shadow-[0_4px_16px_rgba(30,41,59,0.3)] drop-shadow-[0_2px_8px_rgba(51,65,85,0.2)]"

  return (
    <div className={["relative w-full select-none", sizeClass].join(" ")}>
      {/* Scales typography with container height using CSS clamp */}
      <div className="flex w-full items-center justify-center">
        {/* Wordmark wrapper: we render stroke and fill layers for a crisp edge */}
        <div className="relative inline-flex items-center">
          <div
            aria-hidden="true"
            className={[
              "pointer-events-none absolute inset-0",
              "text-transparent [background-clip:text] [-webkit-background-clip:text]",
              strokeGradient,
              textShadow,
            ].join(" ")}
            style={{
              // Create a faux stroke by spreading text with text-shadow; crisp and GPU-friendly
              WebkitTextStroke: "12px transparent",
              filter: "saturate(1.1) contrast(1.05)",
              opacity: variant === "dark" ? 0.95 : 0.85,
            }}
          >
            <span
              className="font-extrabold tracking-[0.06em]"
              style={{ fontSize: "clamp(40px, 12vw, 144px)", lineHeight: 1 }}
            >
              {left}
            </span>
            {/* Spacer for logo width; actual logo is layered above, so we keep flow consistent */}
            <span className={gapClass} />
            <span
              className="font-extrabold tracking-[0.06em]"
              style={{ fontSize: "clamp(40px, 12vw, 144px)", lineHeight: 1 }}
            >
              {right}
            </span>
          </div>

          <div
            className={[
              "relative",
              "text-transparent [background-clip:text] [-webkit-background-clip:text]",
              fillGradient,
              textShadow,
            ].join(" ")}
            style={{ filter: "saturate(1.05) contrast(1.02)" }}
            aria-label={text}
          >
            <span
              className="font-extrabold tracking-[0.06em]"
              style={{ fontSize: "clamp(40px, 12vw, 144px)", lineHeight: 1 }}
            >
              {left}
            </span>

            <span className={["inline-flex items-center align-baseline", gapClass].join(" ")}>
              {/* We use the exact Source URL per your request; using img avoids Next image domain config */}
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/shield%20certhub.jpg-sA98LABQNLs5VcEkLeeCGPjYQoOuiV.jpeg"
                alt={logoAlt}
                className={[
                  "inline-block rounded-xl",
                  // Size relative to text cap height
                  "h-[0.85em] w-[0.85em]",
                  variant === "dark"
                    ? "shadow-[0_0_0_3px_rgba(255,255,255,0.5),0_0_0_6px_rgba(148,163,184,0.3)]"
                    : "shadow-[0_0_0_3px_rgba(71,85,105,0.5),0_0_0_6px_rgba(100,116,139,0.3)]",
                  variant === "dark" ? "ring-2 ring-white/40" : "ring-2 ring-slate-600/40",
                  variant === "dark"
                    ? "drop-shadow-[0_12px_40px_rgba(100,116,139,0.5)] drop-shadow-[0_6px_20px_rgba(148,163,184,0.3)] drop-shadow-[0_3px_10px_rgba(203,213,225,0.2)]"
                    : "drop-shadow-[0_12px_40px_rgba(15,23,42,0.5)] drop-shadow-[0_6px_20px_rgba(30,41,59,0.3)] drop-shadow-[0_3px_10px_rgba(51,65,85,0.2)]",
                ].join(" ")}
                style={{
                  objectFit: "cover",
                  transition:
                    "transform 300ms cubic-bezier(0.4, 0, 0.2, 1), filter 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                  filter: "brightness(1.05) contrast(1.02) saturate(1.1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05) rotateY(5deg)"
                  e.currentTarget.style.filter = "brightness(1.15) contrast(1.05) saturate(1.2)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1) rotateY(0deg)"
                  e.currentTarget.style.filter = "brightness(1.05) contrast(1.02) saturate(1.1)"
                }}
              />
            </span>

            <span
              className="font-extrabold tracking-[0.06em]"
              style={{ fontSize: "clamp(40px, 12vw, 144px)", lineHeight: 1 }}
            >
              {right}
            </span>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2"
        style={{
          height: "30%",
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.4) 55%, rgba(255,255,255,0.1) 80%, rgba(255,255,255,0) 100%)",
          maskImage: "linear-gradient(to bottom, transparent 0%, white 20%, white 80%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, white 20%, white 80%, transparent 100%)",
          animation: "professionalSheen 6s ease-in-out infinite",
        }}
      />
      <style jsx>{`
        @keyframes professionalSheen {
          0% { transform: translateY(-50%) translateX(-40%) skewX(-15deg); opacity: 0.7; }
          50% { transform: translateY(-50%) translateX(40%) skewX(-15deg); opacity: 1; }
          100% { transform: translateY(-50%) translateX(140%) skewX(-15deg); opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}
