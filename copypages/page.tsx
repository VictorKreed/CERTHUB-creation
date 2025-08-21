"use client";

import Image from "next/image";
import Link from "next/link";
import { Poppins, Inter } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { GraduationCap, IdCard, ScrollText, FileCheck2 } from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-poppins",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

/** Twinkling starfield — fixed to whole viewport */
function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    let mounted = true;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const stars: { x: number; y: number; tw: number; s: number; v: number }[] = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      stars.length = 0;
      const density = Math.max(200, Math.floor((width * height) / 15000));
      for (let i = 0; i < density; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          tw: Math.random() * Math.PI * 2,
          s: Math.random() * 1.2 + 0.3,
          v: 0.6 + Math.random() * 1.1,
        });
      }
    };

    const draw = (t: number) => {
      if (!mounted) return;
      const time = t / 1000;
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < stars.length; i++) {
        const st = stars[i];
        const a = 0.25 + Math.abs(Math.sin(time * st.v + st.tw)) * 0.7;
        ctx.globalAlpha = a;
        ctx.fillStyle = "#e7eefc";
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.s, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);
    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true" />;
}

/** Subtle floating academic icons */
function FloatingIcons() {
  return (
    <div className="fixed inset-0 z-[1] pointer-events-none" aria-hidden="true">
      <Icon style={{ top: "12%", left: "8%" }} delay={0.2}>
        <ScrollText className="h-6 w-6" />
      </Icon>
      <Icon style={{ top: "22%", right: "10%" }} delay={1.1}>
        <GraduationCap className="h-6 w-6" />
      </Icon>
      <Icon style={{ bottom: "18%", left: "10%" }} delay={0.6}>
        <IdCard className="h-6 w-6" />
      </Icon>
      <Icon style={{ bottom: "10%", right: "6%" }} delay={1.6}>
        <FileCheck2 className="h-6 w-6" />
      </Icon>
    </div>
  );
}

function Icon({
  children,
  style,
  delay = 0,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  delay?: number;
}) {
  return (
    <div
      className="absolute"
      style={{
        ...style,
        animation: `floatY 7s ease-in-out ${delay}s infinite`,
        opacity: 0.28,
      }}
    >
      <div
        className="grid place-items-center rounded-2xl border border-white/10"
        style={{
          width: 48,
          height: 48,
          background: "rgba(255,255,255,0.06)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        }}
      >
        <div className="text-[#a9b7ff]">{children}</div>
      </div>
      <style jsx>{`
        @keyframes floatY {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default function Page() {
  const [open, setOpen] = useState(false);

  return (
    <main
      className={[
        poppins.variable,
        inter.variable,
        "relative min-h-[100dvh] text-white bg-gradient-to-b from-[#0b0f1a] to-black overflow-hidden",
      ].join(" ")}
    >
      {/* Background */}
      <Starfield />
      <FloatingIcons />

      {/* HEADER */}
      <header className="relative z-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-3 select-none">
              <Image
                src="/shield-logo.svg" // if missing, fallback is fine; you can keep /certhub-logo.png
                alt="CERTHUB logo"
                width={36}
                height={36}
                priority
                className="rounded-md ring-1 ring-white/20"
                onError={(e) => {
                  // Fallback to old logo if shield missing
                  (e.currentTarget as HTMLImageElement).src = "/certhub-logo.png";
                }}
              />
              <span
                className="font-extrabold tracking-[0.06em]"
                style={{
                  fontSize: "clamp(18px, 2.2vw, 28px)",
                  lineHeight: 1,
                  color: "#ffffff",
                }}
              >
                CERTHUB
              </span>
            </Link>

            {/* Right: links + hamburger */}
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-6 text-sm">
                <a href="#features" className="text-white/75 hover:text-white">
                  Features
                </a>
                <a href="#how" className="text-white/75 hover:text-white">
                  How it works
                </a>
                <a href="#why" className="text-white/75 hover:text-white">
                  Why CERTHUB
                </a>
              </nav>

              {/* Hamburger */}
              <button
                aria-label="Open menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="relative z-30 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <span
                  className={[
                    "block h-0.5 w-5 bg-white transition-transform",
                    open ? "translate-y-1.5 rotate-45" : "",
                  ].join(" ")}
                />
                <span
                  className={[
                    "absolute block h-0.5 w-5 bg-white transition-opacity",
                    open ? "opacity-0" : "opacity-100",
                  ].join(" ")}
                />
                <span
                  className={[
                    "block h-0.5 w-5 bg-white transition-transform",
                    open ? "-translate-y-1.5 -rotate-45" : "",
                  ].join(" ")}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Flyout menu */}
        <div
          className={[
            "fixed inset-0 z-20 transition",
            open ? "pointer-events-auto" : "pointer-events-none",
          ].join(" ")}
          onClick={() => setOpen(false)}
        >
          {/* Backdrop */}
          <div
            className={[
              "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity",
              open ? "opacity-100" : "opacity-0",
            ].join(" ")}
          />
          {/* Panel */}
          <div
            className={[
              "absolute right-4 top-20 w-64 rounded-2xl border border-white/10 bg-[#0e1117]/95 p-4 shadow-2xl",
              "transition-transform duration-200",
              open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
            ].join(" ")}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1">
              <Link
                href="/inspect"
                className="block rounded-lg px-3 py-2 text-sm text-white hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                Inspect a Certificate
              </Link>
              <Link
                href="/profile"
                className="block rounded-lg px-3 py-2 text-sm text-white/90 hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                Profile
              </Link>
              <Link
                href="/docs"
                className="block rounded-lg px-3 py-2 text-sm text-white/90 hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                Docs
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-16 pb-10">
          <div className="mx-auto max-w-5xl text-center">
            <h1
              className="uppercase font-extrabold tracking-[0.18em] text-white"
              style={{ fontSize: "clamp(48px, 10vw, 128px)" }}
            >
              CERTHUB
            </h1>

            <div className="mt-3 flex justify-center">
              <div className="relative h-[10px] w-[220px] sm:w-[280px]">
                <div
                  className="absolute left-1/2 top-1/2 h-[2px] w-full -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%)",
                  }}
                />
              </div>
            </div>

            <p className="mt-6 text-white/85 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
              <strong>Revolutionizing Global Credentialing and Certifications</strong> by ensuring
              tamper-proof, globally accessible credentials on‑chain represented as soulbound ERC‑1155 NFTs.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                aria-label="Register Institution"
                className={[
                  "group relative inline-flex items-center justify-center",
                  "rounded-xl px-6 py-3",
                  "font-semibold tracking-wide",
                  "bg-[#111317]/90 text-white",
                  "border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
                  "backdrop-blur-sm",
                  "transition-transform transition-colors duration-200",
                  "hover:scale-[1.03] hover:border-blue-400/50 hover:shadow-blue-400/30",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60",
                ].join(" ")}
              >
                Register Institution
              </Link>

              <Link
                href="/claim"
                aria-label="Claim Certificate"
                className={[
                  "group relative inline-flex items-center justify-center",
                  "rounded-xl px-6 py-3",
                  "font-semibold tracking-wide",
                  "bg-white text-slate-900",
                  "border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)]",
                  "transition-transform transition-colors duration-200",
                  "hover:scale-[1.03] hover:shadow-slate-400/30 hover:border-slate-400/40",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70",
                ].join(" ")}
              >
                Claim Certificate
              </Link>

              <Link
                href="/issue"
                aria-label="Issue a Certificate"
                className={[
                  "group relative inline-flex items-center justify-center",
                  "rounded-xl px-6 py-3",
                  "font-semibold tracking-wide",
                  "bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] text-white",
                  "shadow-[0_10px_30px_rgba(37,99,235,0.35)] border border-white/10",
                  "backdrop-blur-[2px]",
                  "transition-transform transition-colors duration-200",
                  "hover:scale-[1.03] hover:shadow-blue-600/50 hover:border-blue-200/50",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/80",
                ].join(" ")}
              >
                Issue a Certificate
              </Link>
            </div>

            {/* quick badges */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-white/85">
              <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">ERC‑1155 (SBT‑style)</div>
              <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">EIP‑1167 Clones</div>
              <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Merkle Proof Claiming</div>
              <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Public Verification</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative z-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-6 sm:py-10">
          <div className="rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-md p-6 sm:p-10">
            <header className="max-w-3xl">
              <h2 className="text-3xl sm:text-4xl font-bold">Everything you need to trust credentials</h2>
              <p className="mt-2 text-white/75">Onboarding, issuance, claiming, and verification on a transparent ledger.</p>
            </header>

            <div className="mt-8 grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 text-white/85">
              {[
                ["Register Institutions", "Onboard orgs with verified metadata and up to three wallets."],
                ["Verify Institutions", "Factory agents review/approve before issuance."],
                ["Deploy Certificate Clones", "Create ERC‑1155 contracts with name, ID, year, URI, Merkle root."],
                ["Claim with Merkle Proofs", "Recipients prove eligibility and receive a non‑transferable token."],
                ["Update & Revoke", "Authorized roles can update or revoke; all actions emit on‑chain events."],
                ["Public Verification", "Validate claims by address, certificate, year, and institution."],
              ].map(([t, d]) => (
                <div
                  key={t as string}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
                >
                  <h3 className="text-lg font-semibold text-white">{t}</h3>
                  <p className="mt-2">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="relative z-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-6 sm:py-10">
          <div className="rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-md p-6 sm:p-10">
            <header className="max-w-3xl">
              <h2 className="text-3xl sm:text-4xl font-bold">How it works</h2>
              <p className="mt-2 text-white/75">Minimal, auditable pipeline.</p>
            </header>

            <ol className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4 text-white/85">
              <li className="rounded-xl border border-white/10 bg-white/5 p-5">
                <h4 className="text-white font-semibold">1) Register</h4>
                <p className="mt-1">Institution submits details & wallets.</p>
              </li>
              <li className="rounded-xl border border-white/10 bg-white/5 p-5">
                <h4 className="text-white font-semibold">2) Verify</h4>
                <p className="mt-1">Factory agent verifies on‑chain.</p>
              </li>
              <li className="rounded-xl border border-white/10 bg-white/5 p-5">
                <h4 className="text-white font-semibold">3) Issue</h4>
                <p className="mt-1">Deploy a certificate clone with metadata + Merkle root.</p>
              </li>
              <li className="rounded-xl border border-white/10 bg-white/5 p-5">
                <h4 className="text-white font-semibold">4) Claim</h4>
                <p className="mt-1">Recipients claim with proofs; anyone can verify.</p>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section id="why" className="relative z-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-6 sm:py-12">
          <div className="rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-md p-6 sm:p-10">
            <header className="max-w-3xl">
              <h2 className="text-3xl sm:text-4xl font-bold">Why CERTHUB</h2>
              <p className="mt-2 text-white/75">Trust, scale, and control by design.</p>
            </header>
            <div className="mt-8 grid gap-6 md:grid-cols-3 text-white/85">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-xl font-semibold text-white">Trust</h3>
                <p className="mt-2">Tamper‑proof, verifiable on‑chain. No centralized gatekeepers.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-xl font-semibold text-white">Scale</h3>
                <p className="mt-2">EIP‑1167 clones keep gas low for parallel issuance.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-xl font-semibold text-white">Control</h3>
                <p className="mt-2">Issue, update, revoke — all captured via events.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER (your global footer can still be in layout) */}
      <footer className="relative z-10 py-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 text-center text-white/60">
          © {new Date().getFullYear()} CERTHUB — Decentralized Credentials. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
