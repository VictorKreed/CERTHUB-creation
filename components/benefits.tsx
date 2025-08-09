import { Shield, Lightbulb, Globe2 } from "lucide-react"

const benefits = [
  {
    title: "Trust",
    desc: "Certificates are tamper‑proof and verifiable on-chain. No centralized gatekeepers.",
    icon: Shield,
  },
  {
    title: "Innovation",
    desc: "Composable certificate contracts and Merkle eligibility streamline issuance at scale.",
    icon: Lightbulb,
  },
  {
    title: "Freedom",
    desc: "Portable, self‑sovereign credentials empower decentralized work and global payments.",
    icon: Globe2,
  },
]

export default function Benefits() {
  return (
    <section id="benefits" className="relative z-10 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold">Why CERTHUB</h2>
          <p className="mt-3 text-white/80">Built for credibility, designed for the future of decentralized work.</p>
        </header>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur p-6 text-white hover:bg-white/15 transition"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-white/15 p-2.5 border border-white/20">
                  <b.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold">{b.title}</h3>
              </div>
              <p className="mt-3 text-white/85">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
