import Link from "next/link"

export default function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-white/15 bg-white/5 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-8 flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="text-white/80 text-sm">© {new Date().getFullYear()} CERTHUB. All rights reserved.</div>
          <nav className="flex items-center gap-6">
            <Link href="#" className="text-sm text-white/80 hover:text-white">
              Docs
            </Link>
            <Link href="#" className="text-sm text-white/80 hover:text-white">
              GitHub
            </Link>
            <Link href="#" className="text-sm text-white/80 hover:text-white">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
