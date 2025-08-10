"use client"

import { Poppins, Inter } from "next/font/google"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import FloatingIcons from "@/components/floating-icons"

import Hero from "@/components/hero"
import Features from "@/components/features"
import HowItWorks from "@/components/how-it-works"
import Benefits from "@/components/benefits"
import SiteFooter from "@/components/site-footer"
import BackgroundOrbs from "@/components/background-orbs"
import HeaderBrand from "@/components/header-brand"

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
        "relative min-h-screen bg-gradient-to-br from-[#f8fbff] via-white to-[#eef3ff] text-slate-900 antialiased",
      ].join(" ")}
      aria-label="CERTHUB Landing Page"
    >
      <div className="absolute inset-0 opacity-25">
        <BackgroundOrbs />
      </div>
      <div className="absolute inset-0">
        <FloatingIcons intensity={1} interactive />
      </div>

      <header className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <HeaderBrand className="scale-110" />

            <nav className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-sm text-slate-600 hover:text-slate-900">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm text-slate-600 hover:text-slate-900">
                How it works
              </Link>
              <Link href="#benefits" className="text-sm text-slate-600 hover:text-slate-900">
                Benefits
              </Link>
              <Button asChild className="bg-[#1f3aaa] hover:bg-[#2a47a1] text-white shadow-md">
                <Link href="/issue">Issue a Certificate</Link>
              </Button>
              <div className="hidden sm:flex gap-3">
                <Button asChild className="bg-[#1f3aaa] hover:bg-[#2a47a1] text-white shadow-md">
                  <Link href="#register">Register Institution</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-slate-300 text-slate-800 hover:bg-slate-100 bg-transparent"
                >
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
