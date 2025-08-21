"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  getWriteFactory,
  getConnectedAccount,
  ensureHyperionNetwork,
} from "@/lib/factory";

type FormState = {
  institutionName: string;
  institutionType: string;
  industryOrSector: string;
  legalOrOperatingAddress: string;
  emailAddress: string;
  websiteUrlOrDomainName: string;
  walletAddress1: string;
  walletAddress2: string;
  walletAddress3: string;
};

const initialForm: FormState = {
  institutionName: "",
  institutionType: "",
  industryOrSector: "",
  legalOrOperatingAddress: "",
  emailAddress: "",
  websiteUrlOrDomainName: "",
  walletAddress1: "",
  walletAddress2: "",
  walletAddress3: "",
};

export default function RegisterPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [account, setAccount] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Connect wallet & prefill Wallet 1 if empty
  useEffect(() => {
    (async () => {
      try {
        await ensureHyperionNetwork();
        const acc = await getConnectedAccount();
        setAccount(acc);
        if (acc && !form.walletAddress1) {
          setForm((f) => ({ ...f, walletAddress1: acc }));
        }
      } catch (e) {
        // ignore – user may connect later
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isCallerOneOfWallets = useMemo(() => {
    if (!account) return false;
    const a = account.toLowerCase();
    return [form.walletAddress1, form.walletAddress2, form.walletAddress3]
      .filter(Boolean)
      .map((w) => w.toLowerCase())
      .includes(a);
  }, [account, form.walletAddress1, form.walletAddress2, form.walletAddress3]);

  const valid = useMemo(() => {
    const isAddr = (s: string) => /^0x[a-fA-F0-9]{40}$/.test(s);
    const emailOk = /\S+@\S+\.\S+/.test(form.emailAddress);
    return (
      form.institutionName.trim().length > 1 &&
      form.institutionType.trim().length > 1 &&
      form.industryOrSector.trim().length > 1 &&
      form.legalOrOperatingAddress.trim().length > 3 &&
      emailOk &&
      form.websiteUrlOrDomainName.trim().length > 3 &&
      isAddr(form.walletAddress1) &&
      (!form.walletAddress2 || isAddr(form.walletAddress2)) &&
      (!form.walletAddress3 || isAddr(form.walletAddress3))
    );
  }, [form]);

  function onChange<K extends keyof FormState>(key: K, value: string) {
    if (key === "websiteUrlOrDomainName") {
      // tidy URL (prepend https:// if user types a bare domain)
      if (value && !/^https?:\/\//i.test(value)) {
        setForm((f) => ({ ...f, [key]: value }));
        return;
      }
    }
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setTxHash(null);

    if (!valid) {
      setError("Please complete all required fields with valid values.");
      return;
    }
    if (!isCallerOneOfWallets) {
      setError(
        "The connected wallet must be listed as Wallet 1, 2, or 3. Connect the correct wallet and try again."
      );
      return;
    }

    try {
      setSubmitting(true);
      const factory = await getWriteFactory();
      const tx = await factory.registerInstitution(
        form.institutionName,
        form.institutionType,
        form.industryOrSector,
        form.legalOrOperatingAddress,
        form.emailAddress,
        form.websiteUrlOrDomainName,
        form.walletAddress1,
        form.walletAddress2 || "0x0000000000000000000000000000000000000000",
        form.walletAddress3 || "0x0000000000000000000000000000000000000000"
      );
      const receipt = await tx.wait();
      setTxHash(receipt?.hash ?? tx?.hash ?? null);
    } catch (err: any) {
      const msg =
        err?.reason ||
        err?.shortMessage ||
        err?.message ||
        "Transaction failed. Please check your wallet and try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0b0f1a] to-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            CERTHUB
          </Link>
          <div className="text-sm">
            {account ? (
              <span className="rounded-md bg-emerald-500/10 px-3 py-1 text-emerald-300">
                ✅ Connected: {account.slice(0, 6)}…{account.slice(-4)}
              </span>
            ) : (
              <span className="rounded-md bg-yellow-500/10 px-3 py-1 text-yellow-300">
                ⚠️ Please connect your wallet
              </span>
            )}
          </div>
        </header>

        {/* Intro */}
        <section className="mb-10">
          <h1 className="text-3xl font-bold leading-tight">
            Register Your Institution
          </h1>
          <p className="mt-2 text-white/70">
            Use one of the wallets you list below to submit this transaction.
            A factory agent will verify your registration before you can issue certificates.
          </p>
        </section>

        {/* Form */}
        <form onSubmit={onSubmit} className="grid gap-6">
          <div className="grid gap-2">
            <label className="text-sm text-white/70">Institution Name *</label>
            <input
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
              value={form.institutionName}
              onChange={(e) => onChange("institutionName", e.target.value)}
              placeholder="e.g., Alpha University"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm text-white/70">Institution Type *</label>
              <input
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
                value={form.institutionType}
                onChange={(e) => onChange("institutionType", e.target.value)}
                placeholder="University / Accreditor / Training Org"
                required
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm text-white/70">Industry or Sector *</label>
              <input
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
                value={form.industryOrSector}
                onChange={(e) => onChange("industryOrSector", e.target.value)}
                placeholder="Education, Healthcare, Tech…"
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-white/70">Legal or Operating Address *</label>
            <input
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
              value={form.legalOrOperatingAddress}
              onChange={(e) => onChange("legalOrOperatingAddress", e.target.value)}
              placeholder="123 Blockchain St, City, Country"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm text-white/70">Email Address *</label>
              <input
                type="email"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
                value={form.emailAddress}
                onChange={(e) => onChange("emailAddress", e.target.value)}
                placeholder="admin@alpha.edu"
                required
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm text-white/70">Website / Domain *</label>
              <input
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
                value={form.websiteUrlOrDomainName}
                onChange={(e) => onChange("websiteUrlOrDomainName", e.target.value)}
                placeholder="alpha.edu or https://alpha.edu"
                required
              />
            </div>
          </div>

          {/* Wallets */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="mb-4 text-sm text-white/70">
              Wallets (the connected wallet must be one of these)
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="grid gap-2">
                <label className="text-sm text-white/70">Wallet 1 *</label>
                <input
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
                  value={form.walletAddress1}
                  onChange={(e) => onChange("walletAddress1", e.target.value)}
                  placeholder="0x..."
                  required
                />
                {account &&
                  form.walletAddress1 &&
                  account.toLowerCase() === form.walletAddress1.toLowerCase() && (
                    <span className="text-xs text-emerald-400">Connected</span>
                  )}
              </div>
              <div className="grid gap-2">
                <label className="text-sm text-white/70">Wallet 2 (optional)</label>
                <input
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
                  value={form.walletAddress2}
                  onChange={(e) => onChange("walletAddress2", e.target.value)}
                  placeholder="0x..."
                />
                {account &&
                  form.walletAddress2 &&
                  account.toLowerCase() === form.walletAddress2.toLowerCase() && (
                    <span className="text-xs text-emerald-400">Connected</span>
                  )}
              </div>
              <div className="grid gap-2">
                <label className="text-sm text-white/70">Wallet 3 (optional)</label>
                <input
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
                  value={form.walletAddress3}
                  onChange={(e) => onChange("walletAddress3", e.target.value)}
                  placeholder="0x..."
                />
                {account &&
                  form.walletAddress3 &&
                  account.toLowerCase() === form.walletAddress3.toLowerCase() && (
                    <span className="text-xs text-emerald-400">Connected</span>
                  )}
              </div>
            </div>
            {!isCallerOneOfWallets && (
              <div className="mt-3 text-xs text-amber-400">
                Note: Connect a wallet that appears as Wallet 1, 2, or 3. The contract will reject others.
              </div>
            )}
          </div>

          {/* Messages */}
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {txHash && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
              Registration submitted.{" "}
              <a
                className="ml-1 inline-block rounded-md bg-slate-800 px-3 py-1 text-xs text-cyan-300 underline hover:bg-slate-700"
                href={`https://hyperion-testnet-explorer.metisdevops.link/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
              >
                View on Explorer
              </a>
              <p className="mt-2 text-xs text-white/60">
                After confirmation, a factory agent must call <code>verifyInstitution</code>.
                Only then will you be able to issue certificates.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={submitting || !valid}>
              {submitting ? "Submitting…" : "Register Institution"}
            </Button>
            <Link href="/" className="text-white/70 hover:underline">
              Back to Home
            </Link>
          </div>
        </form>

        {/* Info box */}
        <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-4">
          <h3 className="mb-2 text-lg font-semibold">What happens next?</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-white/70">
            <li>On-chain <em>InstitutionRegistered</em> event is emitted.</li>
            <li>A factory agent reviews and verifies your institution on the factory.</li>
            <li>Once verified, you can issue certificate clones and manage them.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
