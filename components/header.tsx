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
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <BrandWordmark />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
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

          {/* Hamburger Menu Button - Always Visible */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-3 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            aria-label="Open menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="py-4 space-y-1">
                <Link
                  href="/"
                  className="block px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-md font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-md font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register Institution
                </Link>
                <Link
                  href="/profile"
                  className="block px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-md font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <div className="px-4 py-2">
                  <Button asChild className="w-full bg-[#1f3aaa] hover:bg-[#2a47a1] text-white">
                    <Link href="/issue" onClick={() => setMobileMenuOpen(false)}>
                      Issue a Certificate
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
