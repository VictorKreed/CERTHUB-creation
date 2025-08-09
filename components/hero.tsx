"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-20 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1
              className="font-[var(--font-poppins)] text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight drop-shadow"
              aria-label="CERTHUB"
            >
              CERTHUB
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-white/85">
              Secure Credentialing and Certifications on Blockchain
            </p>
            <p className="mt-3 text-sm sm:text-base text-white/70 max-w-2xl mx-auto">
              Issue tamper&#45;proof, verifiable certificates. Empower decentralized work and payments with trustless
              verification.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur"
              >
                <Link href="#register">Register Institution</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto bg-white text-[#0F1D52] hover:bg-white/90"
              >
                <Link href="#claim">Claim Certificate</Link>
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-white/70">
              <div className="rounded-xl border border-white/15 bg-white/5 backdrop-blur px-3 py-2">
                Non&#45;transferable tokens
              </div>
              <div className="rounded-xl border border-white/15 bg-white/5 backdrop-blur px-3 py-2">
                On&#45;chain revocation
              </div>
              <div className="rounded-xl border border-white/15 bg-white/5 backdrop-blur px-3 py-2">
                Merkle eligibility
              </div>
              <div className="rounded-xl border border-white/15 bg-white/5 backdrop-blur px-3 py-2">
                Verifiable profiles
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
