"use client"

import Link from "next/link"
import { Mail, Github, Twitter } from "lucide-react"

export default function SiteFooter() {
  return (
    <footer className="relative z-20 border-t border-white/10 bg-black/40 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-8 flex flex-col sm:flex-row items-center gap-6 justify-between">
          {/* Left side: copyright */}
          <div className="text-white/60 text-sm">
            © {new Date().getFullYear()} CERTHUB — Decentralized Credentials
          </div>

          {/* Right side: links */}
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/docs"
              className="text-white/70 hover:text-white transition-colors"
            >
              Docs
            </Link>

            <Link
              href="https://github.com/VictorKreed/CERTHUB-CONTRACTs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-white/70 hover:text-white transition-colors"
            >
              <Github className="h-4 w-4" />
              GitHub
            </Link>

            <Link
              href="mailto:certhubcerthub@gmail.com"
              className="flex items-center gap-1 text-white/70 hover:text-white transition-colors"
            >
              <Mail className="h-4 w-4" />
              Gmail
            </Link>

            <Link
              href="https://x.com/certhubcerthub"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-white/70 hover:text-white transition-colors"
            >
              <Twitter className="h-4 w-4" />
              X
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
