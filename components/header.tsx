import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Scroll } from "lucide-react"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Scroll className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold text-slate-900">CERTHUB</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/features" className="text-slate-600 hover:text-slate-900 transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="text-slate-600 hover:text-slate-900 transition-colors">
            Pricing
          </Link>
          <Link href="/docs" className="text-slate-600 hover:text-slate-900 transition-colors">
            Documentation
          </Link>
          <Link href="/claim" className="text-slate-600 hover:text-slate-900 transition-colors">
            Claim
          </Link>
        </nav>

        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Link href="/issue">Issue Certificate</Link>
        </Button>
      </div>
    </header>
  )
}
