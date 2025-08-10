"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import HeroWordmark from "@/components/hero-wordmark"

export default function Hero() {
  return (
    <section className="relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="sr-only">CERTHUB</h1>

            <HeroWordmark className="h-auto" />

            <p className="mt-6 text-lg sm:text-xl text-slate-600">
              Secure Credentialing and Certifications on Blockchain
            </p>
            <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
              Issue tamper-proof, verifiable certificates. Empower decentralized work and payments with trustless
              verification.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-[#1f3aaa] hover:bg-[#2a47a1] text-white shadow-md"
              >
                <Link href="#register">Register Institution</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-slate-300 text-slate-800 hover:bg-slate-100 bg-transparent"
              >
                <Link href="#claim">Claim Certificate</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto bg-slate-900 text-white hover:bg-slate-800"
              >
                <Link href="/issue">Issue a Certificate</Link>
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-600">
              <div className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur px-3 py-2 shadow-sm">
                Non-transferable tokens
              </div>
              <div className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur px-3 py-2 shadow-sm">
                On-chain revocation
              </div>
              <div className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur px-3 py-2 shadow-sm">
                Merkle eligibility
              </div>
              <div className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur px-3 py-2 shadow-sm">
                Verifiable profiles
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
