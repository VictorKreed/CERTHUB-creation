import Link from "next/link"

export default function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-slate-200 bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-8 flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="text-slate-600 text-sm">© {new Date().getFullYear()} CERTHUB. All rights reserved.</div>
          <nav className="flex items-center gap-6">
            <Link href="#" className="text-sm text-slate-600 hover:text-slate-900">
              Docs
            </Link>
            <Link href="#" className="text-sm text-slate-600 hover:text-slate-900">
              GitHub
            </Link>
            <Link href="#" className="text-sm text-slate-600 hover:text-slate-900">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
