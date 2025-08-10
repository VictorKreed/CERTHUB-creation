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

  // Color system: for dark backgrounds the gradient is brighter; for light backgrounds it’s slightly cooler
  const fillGradient =
    variant === "dark"
      ? "bg-[linear-gradient(90deg,#ffffff_0%,#f2f6ff_45%,#dbe7ff_100%)]"
      : "bg-[linear-gradient(90deg,#0b1020_0%,#1b2440_40%,#243a78_100%)]"

  const strokeGradient =
    variant === "dark"
      ? "bg-[linear-gradient(90deg,#ffffff_0%,#eaf1ff_60%,#c7d7ff_100%)]"
      : "bg-[linear-gradient(90deg,#4a5b8f_0%,#5d79d6_60%,#6e8cff_100%)]"

  const textShadow =
    variant === "dark"
      ? "drop-shadow-[0_6px_24px_rgba(160,190,255,0.25)]"
      : "drop-shadow-[0_6px_24px_rgba(70,90,160,0.15)]"

  return (
    <div className={["relative w-full select-none", sizeClass].join(" ")}>
      {/* Scales typography with container height using CSS clamp */}
      <div className="flex w-full items-center justify-center">
        {/* Wordmark wrapper: we render stroke and fill layers for a crisp edge */}
        <div className="relative inline-flex items-center">
          {/* Stroke layer */}
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
              WebkitTextStroke: "10px transparent",
              filter: "saturate(1.05)",
              opacity: variant === "dark" ? 0.9 : 0.8,
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

          {/* Fill layer */}
          <div
            className={[
              "relative",
              "text-transparent [background-clip:text] [-webkit-background-clip:text]",
              fillGradient,
              textShadow,
            ].join(" ")}
            style={{ filter: "saturate(1.02)" }}
            aria-label={text}
          >
            <span
              className="font-extrabold tracking-[0.06em]"
              style={{ fontSize: "clamp(40px, 12vw, 144px)", lineHeight: 1 }}
            >
              {left}
            </span>

            {/* Inline logo token */}
            <span className={["inline-flex items-center align-baseline", gapClass].join(" ")}>
              {/* We use the exact Source URL per your request; using img avoids Next image domain config */}
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/shield%20certhub.jpg-sA98LABQNLs5VcEkLeeCGPjYQoOuiV.jpeg"
                alt={logoAlt}
                className={[
                  "inline-block rounded-xl",
                  // Size relative to text cap height
                  "h-[0.85em] w-[0.85em]",
                  // Futuristic glassy edge and soft glow
                  variant === "dark"
                    ? "shadow-[0_0_0_2px_rgba(255,255,255,0.35)]"
                    : "shadow-[0_0_0_2px_rgba(100,130,220,0.35)]",
                  variant === "dark" ? "ring-1 ring-white/30" : "ring-1 ring-[#6e8cff]/30",
                  variant === "dark"
                    ? "drop-shadow-[0_10px_30px_rgba(130,160,255,0.35)]"
                    : "drop-shadow-[0_10px_30px_rgba(90,120,200,0.25)]",
                ].join(" ")}
                style={{
                  objectFit: "cover",
                  // Slight animated sheen on hover
                  transition: "transform 220ms ease, filter 220ms ease",
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

      {/* Subtle animated sheen across the text */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2"
        style={{
          height: "25%",
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(200,220,255,0.18) 45%, rgba(255,255,255,0) 100%)",
          maskImage: "linear-gradient(to bottom, transparent 0%, white 15%, white 85%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, white 15%, white 85%, transparent 100%)",
          animation: "sheen 9s linear infinite",
        }}
      />
      <style jsx>{`
        @keyframes sheen {
          0% { transform: translateY(-50%) translateX(-30%); opacity: 0.85; }
          50% { transform: translateY(-50%) translateX(30%); opacity: 1; }
          100% { transform: translateY(-50%) translateX(110%); opacity: 0.9; }
        }
      `}</style>
    </div>
  )
}
