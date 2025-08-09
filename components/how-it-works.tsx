import { ArrowRight, Factory, ShieldCheck, GitBranch, GraduationCap, Undo2 } from "lucide-react"

const steps = [
  {
    title: "Register",
    desc: "Institutions register with full organizational details and up to 3 verification wallets.",
    icon: Factory,
  },
  {
    title: "Verify",
    desc: "Factory agents validate authenticity and approve institutions.",
    icon: ShieldCheck,
  },
  {
    title: "Deploy",
    desc: "Verified institutions deploy proxy certificate contracts with metadata & Merkle root.",
    icon: GitBranch,
  },
  {
    title: "Claim",
    desc: "Students claim certificates using Merkle proofs; claims are stored on-chain.",
    icon: GraduationCap,
  },
  {
    title: "Verify / Revoke",
    desc: "Any verifier can check on-chain records. Authorized parties can revoke or update.",
    icon: Undo2,
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative z-10 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold">How it works</h2>
          <p className="mt-3 text-white/80">A transparent lifecycle from registration to verifiable credentials.</p>
        </header>

        <ol className="mt-10 relative grid gap-6 md:gap-8">
          {steps.map((s, idx) => (
            <li key={s.title} className="relative">
              <div className="grid md:grid-cols-[220px_1fr] gap-4 md:gap-8 items-start">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 border border-white/20">
                    <s.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-white/70">Step {idx + 1}</div>
                    <div className="font-semibold">{s.title}</div>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur px-4 py-3 text-white/85">
                  {s.desc}
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:flex items-center gap-2 my-4 ml-[52px] text-white/60">
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  <span className="text-xs">Next</span>
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
