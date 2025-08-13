import { Button } from "@/components/ui/button"
import Link from "next/link"
import Logo2D from "@/components/logo-2d"

export default function Hero() {
  return (
    <section className="relative z-10 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-8">
          <Logo2D text="CERTHUB" className="mx-auto" glow={0.8} />
        </div>

        <h2 className="mb-6 text-xl font-medium text-slate-600 sm:text-2xl">
          Secure Credentialing and Certifications on Blockchain
        </h2>

        <p className="mb-12 text-lg text-slate-500 max-w-2xl mx-auto">
          Issue tamper-proof, verifiable certificates. Empower decentralized work and payments with trustless
          verification.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="bg-[#1f3aaa] hover:bg-[#2a47a1] text-white shadow-lg">
            <Link href="#register">Register Institution</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-slate-300 text-slate-800 hover:bg-slate-100 bg-transparent"
          >
            <Link href="/claim">Claim Certificate</Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="bg-slate-900 hover:bg-slate-800 text-white">
            <Link href="/issue">Issue a Certificate</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
