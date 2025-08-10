"use client"

import Link from "next/link"

type HeaderBrandProps = {
  href?: string
  className?: string
}

export default function HeaderBrand({ href = "/", className = "" }: HeaderBrandProps) {
  // Pure text brand (image removed), with subtle gradient for emphasis on white theme
  return (
    <Link
      href={href}
      aria-label="CERTHUB Home"
      className={["group inline-flex items-center gap-2 sm:gap-3 select-none", className].join(" ")}
    >
      <span
        className="font-extrabold tracking-[0.06em] text-transparent bg-clip-text [-webkit-background-clip:text]"
        style={{
          fontSize: "clamp(18px, 2.8vw, 30px)",
          lineHeight: 1,
          backgroundImage: "linear-gradient(90deg, #0f172a 0%, #1f2a44 40%, #2a47a1 100%)",
          filter: "saturate(1.02)",
        }}
      >
        {"CERTHUB"}
      </span>
    </Link>
  )
}
