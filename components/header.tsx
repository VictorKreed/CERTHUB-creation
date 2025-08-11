"use client"

import Link from "next/link"
import { useState } from "react"
import Button from "./Button"
import BrandWordmark from "./BrandWordmark"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="relative z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <BrandWordmark />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-slate-700 hover:text-slate-900 font-medium">
              Home
            </Link>
            <Link href="/register" className="text-slate-700 hover:text-slate-900 font-medium">
              Register
            </Link>
            <Link href="/profile" className="text-slate-700 hover:text-slate-900 font-medium">
              Profile
            </Link>
            <Button asChild className="bg-[#1f3aaa] hover:bg-[#2a47a1] text-white">
              <Link href="/issue">Issue a Certificate</Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-700 hover:text-slate-900">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-slate-200">
              <Link
                href="/"
                className="block px-3 py-2 text-slate-700 hover:text-slate-900 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/register"
                className="block px-3 py-2 text-slate-700 hover:text-slate-900 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
              <Link
                href="/profile"
                className="block px-3 py-2 text-slate-700 hover:text-slate-900 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <div className="px-3 py-2">
                <Button asChild className="w-full bg-[#1f3aaa] hover:bg-[#2a47a1] text-white">
                  <Link href="/issue" onClick={() => setMobileMenuOpen(false)}>
                    Issue a Certificate
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
