import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BadgeCheck, FileCheck2, GraduationCap, ShieldCheck, GitBranch, UserSquare2, Undo2 } from "lucide-react"

export default function Features() {
  const items = [
    {
      title: "Register Institutions",
      icon: UserSquare2,
      desc: "Onboard institutions with name, type, sector, address, email, website, and up to 3 wallet addresses.",
    },
    {
      title: "Verify Institutions",
      icon: ShieldCheck,
      desc: "Factory agents verify metadata and wallets to ensure authenticity before issuing rights.",
    },
    {
      title: "Deploy Certificate Contracts",
      icon: GitBranch,
      desc: "Deploy proxy certificate contracts with metadata: name, ID, year, URI, Merkle root, and token quantity.",
    },
    {
      title: "Issue Certificates",
      icon: FileCheck2,
      desc: "Issue non‑transferable tokens (SBT-style) representing certificates with on‑chain records.",
    },
    {
      title: "Claim with Merkle Proofs",
      icon: GraduationCap,
      desc: "Students claim eligibility using Merkle proofs; claims are stored on‑chain for global verification.",
    },
    {
      title: "Revoke & Update",
      icon: Undo2,
      desc: "Authorized parties can revoke or update certificates; changes are recorded immutably.",
    },
    {
      title: "Profiles",
      icon: BadgeCheck,
      desc: "Mini profiles for recipients and institutions to showcase claimed and issued certificates.",
    },
  ]

  return (
    <section id="features" className="relative z-10 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Powerful features</h2>
          <p className="mt-3 text-slate-600">
            Everything you need to issue, claim, verify, and manage credentials on-chain.
          </p>
        </header>

        <div className="mt-10 grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map(({ title, icon: Icon, desc }) => (
            <Card
              key={title}
              className="border-slate-200 bg-white text-slate-800 backdrop-blur hover:bg-slate-50 hover:translate-y-[-2px] transition-all shadow-sm"
            >
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="rounded-lg bg-slate-100 p-2.5 border border-slate-200">
                  <Icon className="h-6 w-6 text-[#2a47a1]" aria-hidden="true" />
                </div>
                <CardTitle className="text-slate-900">{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">{desc}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
