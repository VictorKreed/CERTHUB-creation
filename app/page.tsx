"use client"

import { Poppins, Inter } from "next/font/google"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import Hero from "@/components/hero"
import Features from "@/components/features"
import HowItWorks from "@/components/how-it-works"
import Benefits from "@/components/benefits"
import SiteFooter from "@/components/site-footer"
import BackgroundOrbs from "@/components/background-orbs"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-poppins",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export default function Page() {
  return (
    <main
      className={[
        poppins.variable,
        inter.variable,
        "relative min-h-screen bg-gradient-to-br from-[#00008B] to-[#4169E1] text-white antialiased",
      ].join(" ")}
      aria-label="CERTHUB Landing Page"
    >
      <BackgroundOrbs />

      <header className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="#"
              className="font-bold tracking-wider text-white/90 hover:text-white"
              aria-label="CERTHUB Home"
            >
              CERTHUB
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-sm text-white/80 hover:text-white">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm text-white/80 hover:text-white">
                How it works
              </Link>
              <Link href="#benefits" className="text-sm text-white/80 hover:text-white">
                Benefits
              </Link>
              <div className="hidden sm:flex gap-3">
                <Button
                  asChild
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur"
                >
                  <Link href="#register">Register Institution</Link>
                </Button>
                <Button asChild variant="secondary" className="bg-white text-[#0F1D52] hover:bg-white/90">
                  <Link href="#claim">Claim Certificate</Link>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <Hero />

      <Features />

      <HowItWorks />

      <Benefits />

      <SiteFooter />
    </main>
  )
}
