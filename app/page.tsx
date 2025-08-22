"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { getConnectedAccount, ensureHyperionNetwork, isFactoryAgent } from "@/lib/factory";
import { MoreVertical } from "lucide-react";

export default function HomePage() {
  const [account, setAccount] = useState<string | null>(null);
  const [isAgent, setIsAgent] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Connect wallet
  async function connectWallet() {
    try {
      setConnecting(true);
      await ensureHyperionNetwork();
      const acc = await getConnectedAccount();
      setAccount(acc);
      if (acc) {
        const agentStatus = await isFactoryAgent(acc);
        setIsAgent(agentStatus);
        // Set wallet address in session via API
        await fetch("/api/set-wallet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ walletAddress: acc }),
        });
      }
    } catch (e: any) {
      console.error("Wallet connection failed:", e);
    } finally {
      setConnecting(false);
    }
  }

  // Starfield animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars: { x: number; y: number; radius: number; speed: number }[] = [];
    const numStars = 100;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        speed: Math.random() * 0.5 + 0.1,
      });
    }

    function animate() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      for (const star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      }

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update wallet status and agent status
  useEffect(() => {
    (async () => {
      try {
        const acc = await getConnectedAccount();
        console.log("Connected account:", acc);
        setAccount(acc);
        if (acc) {
          const agentStatus = await isFactoryAgent(acc);
          console.log("Agent status:", agentStatus);
          setIsAgent(agentStatus);
          // Set wallet address in session via API
          await fetch("/api/set-wallet", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ walletAddress: acc }),
          });
        }
      } catch (e) {
        console.error("Wallet status check failed:", e);
      }
    })();
  }, []);

  // Handle navigation to agent page
  const handleAgentNavigation = async () => {
    if (account) {
      try {
        const response = await fetch("/api/set-wallet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ walletAddress: account }),
        });
        if (response.ok) {
          window.location.href = "/agent/verify-institution";
        } else {
          console.error("Failed to set wallet address for navigation");
        }
      } catch (e) {
        console.error("Navigation error:", e);
      }
    }
    setMenuOpen(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0b0f1a] to-black text-white relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ opacity: 0.5 }}
      />
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-12">
        <header className="mb-12 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight">CERTHUB📜</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              {account ? (
                <span className="rounded-md bg-emerald-500/10 px-3 py-1 text-emerald-300">
                  ✅ Connected: {account.slice(0, 6)}…{account.slice(-4)}
                </span>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={connecting}
                  className="rounded-md bg-emerald-600 px-3 py-1 text-emerald-100 hover:bg-emerald-700 disabled:opacity-50"
                >
                  {connecting ? "Connecting…" : "Connect Wallet"}
                </button>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="rounded-md bg-white/10 p-2 hover:bg-white/15"
              >
                <MoreVertical size={20} className="text-white" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-white/5 p-2 shadow-lg">
                  <Link
                    href="/docs"
                    className="block px-4 py-2 text-sm hover:bg-white/10"
                    onClick={() => setMenuOpen(false)}
                  >
                    Docs
                  </Link>
                  <Link
                    href="/claim"
                    className="block px-4 py-2 text-sm hover:bg-white/10"
                    onClick={() => setMenuOpen(false)}
                  >
                    Claim
                  </Link>
                  <Link
                    href="/verify"
                    className="block px-4 py-2 text-sm hover:bg-white/10"
                    onClick={() => setMenuOpen(false)}
                  >
                    Verify a Certificate Claim
                  </Link>
                   <Link
                    href="/update-certificate"
                    className="block px-4 py-2 text-sm hover:bg-white/10"
                    onClick={() => setMenuOpen(false)}
                  >
                    Update a Certificate
                  </Link>
                  <Link
                    href="/inspect"
                    className="block px-4 py-2 text-sm hover:bg-white/10"
                    onClick={() => setMenuOpen(false)}
                  >
                    Inspect a Certificate
                  </Link>
                  {isAgent && (
                    <button
                      onClick={handleAgentNavigation}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-white/10"
                    >
                      Verify Institution
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>
        <section className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Welcome to <span className="text-emerald-400">CERTHUB</span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-6">
            Issue, inspect, and claim blockchain-based certificates on Hyperion Infrastructure with unparalleled security and transparency.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/register"
              className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Register Institution
            </Link>
            <Link
              href="/issue"
              className="rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/15"
            >
              Issue Certificate
            </Link>
          </div>
        </section>
        <section className="mb-16 rounded-xl border border-white/10 bg-white/5 p-8">
          <h3 className="text-3xl font-semibold text-center mb-8">Why CERTHUB?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-lg bg-white/10 p-6">
              <h4 className="text-lg font-semibold mb-2 text-emerald-400">Revolutionizing Certificate Issuance</h4>
              <p className="text-sm text-white/70">
                CERTHUB is transforming the landscape of certificate issuance by bringing authenticity and safety to real-world credentials. Say goodbye to falsified claims and forged documentation.
              </p>
            </div>
            <div className="rounded-lg bg-white/10 p-6">
              <h4 className="text-lg font-semibold mb-2 text-emerald-400">Ensuring True Ownership</h4>
              <p className="text-sm text-white/70">
                With blockchain technology, every certificate is verifiable and tamper-proof, preventing fraud and ensuring true ownership of skillsets and achievements.
              </p>
            </div>
            <div className="rounded-lg bg-white/10 p-6">
              <h4 className="text-lg font-semibold mb-2 text-emerald-400">Building Trust</h4>
              <p className="text-sm text-white/70">
                CERTHUB empowers employers, educators, and individuals with a reliable way to verify credentials, fostering trust in professional and academic landscapes.
              </p>
            </div>
          </div>
        </section>
        <section className="mb-16">
          <h3 className="text-2xl font-semibold text-center mb-8">CORE CERTHUB?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h4 className="text-lg font-semibold mb-2">Issue Certificates</h4>
              <p className="text-sm text-white/70">
                Deploy certificate contracts on the Hyperion Testnet with Merkle proofs for secure, scalable distribution.
              </p>
              <Link
                href="/issue"
                className="mt-4 inline-block text-emerald-400 hover:underline"
              >
                Learn More →
              </Link>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h4 className="text-lg font-semibold mb-2">Inspect Certificates</h4>
              <p className="text-sm text-white/70">
                Verify certificate details on-chain, including institution, issuer, and metadata, with a single query.
              </p>
              <Link
                href="/inspect"
                className="mt-4 inline-block text-emerald-400 hover:underline"
              >
                Learn More →
              </Link>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h4 className="text-lg font-semibold mb-2">Claim Certificates</h4>
              <p className="text-sm text-white/70">
                Recipients can claim their certificates using Merkle proofs, ensuring authenticity and ownership.
              </p>
              <Link
                href="/claim"
                className="mt-4 inline-block text-emerald-400 hover:underline"
              >
                Learn More →
              </Link>
            </div>
          </div>
        </section>
        <section className="mb-16">
          <h3 className="text-3xl font-semibold text-center mb-8">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h4 className="text-lg font-semibold mb-2">Soulboundness</h4>
              <p className="text-sm text-white/70">
                Certificates are soulbound, meaning they are non-transferable and tied directly to the recipient's wallet, ensuring true ownership and preventing unauthorized transfers.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h4 className="text-lg font-semibold mb-2">Merkle-Proof Claiming Mode</h4>
              <p className="text-sm text-white/70">
                Utilize Merkle proofs for secure and efficient claiming, allowing recipients to prove eligibility without revealing the entire list, enhancing privacy and scalability.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h4 className="text-lg font-semibold mb-2">Institution Authentication</h4>
              <p className="text-sm text-white/70">
                Institutions are authenticated by platform agents, ensuring only verified entities can issue certificates, adding a layer of trust and security to the process.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h4 className="text-lg font-semibold mb-2">Additional Institution Admins</h4>
              <p className="text-sm text-white/70">
                Institutions can add extra admins for issuing convenience, allowing teams to collaborate seamlessly while maintaining strict access controls.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h4 className="text-lg font-semibold mb-2">Minimal Contracts as Independent Certificates</h4>
              <p className="text-sm text-white/70">
                Each certificate is deployed as a minimal proxy contract, keeping costs low and allowing independent management for each credential.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h4 className="text-lg font-semibold mb-2">Institution and Recipient Profiles</h4>
              <p className="text-sm text-white/70">
                Comprehensive profiles for institutions and recipients, providing a centralized view of issued and claimed certificates for easy verification and management.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 md:col-span-2">
              <h4 className="text-lg font-semibold mb-2">Future A.I Agent Mode</h4>
              <p className="text-sm text-white/70">
                Upcoming A.I agent mode for easier automation, enabling intelligent workflows for certificate issuance, verification, and management.
              </p>
            </div>
          </div>
        </section>
        <section className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Powered by Hyperion</h3>
          <p className="text-sm text-white/70 max-w-xl mx-auto">
            CERTHUB leverages Hyperion Infrastructure for fast, secure, and transparent certificate management. Connect your wallet to get started.
          </p>
          {!account && (
            <button
              onClick={connectWallet}
              disabled={connecting}
              className="mt-4 rounded-lg bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {connecting ? "Connecting…" : "Get Started"}
            </button>
          )}
        </section>
      </div>
    </main>
  );
}