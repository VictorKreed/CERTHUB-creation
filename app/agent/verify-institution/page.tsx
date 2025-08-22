"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { isAddress, getAddress } from "ethers";
import { getConnectedAccount, ensureHyperionNetwork, isFactoryAgent, getWriteFactory, getRegisteredInstitutions } from "@/lib/factory";
import { HYPERION_TESTNET } from "@/lib/chain";
import { CheckCircle, XCircle } from "lucide-react";

type VerifyForm = {
  institutionName: string;
  institutionWalletAddress: string;
};

type Institution = {
  walletAddress: string;
  name: string;
  institutionType: string;
  industryOrSector: string;
  legalOrOperatingAddress: string;
  emailAddress: string;
  websiteUrlOrDomainName: string;
  verified: boolean;
};

const initialForm: VerifyForm = {
  institutionName: "",
  institutionWalletAddress: "",
};

export default function VerifyInstitutionPage() {
  const [account, setAccount] = useState<string | null>(null);
  const [isAgent, setIsAgent] = useState(false);
  const [form, setForm] = useState<VerifyForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [institutions, setInstitutions] = useState<Institution[]>([]);

  // Check wallet and agent status, fetch institutions
  useEffect(() => {
    (async () => {
      try {
        await ensureHyperionNetwork();
        const acc = await getConnectedAccount();
        setAccount(acc);
        if (acc) {
          const agentStatus = await isFactoryAgent(acc);
          setIsAgent(agentStatus);
          if (agentStatus) {
            const registered = await getRegisteredInstitutions();
            const provider = new ethers.JsonRpcProvider(
              process.env.NEXT_PUBLIC_RPC_URL || "https://hyperion-testnet.metisdevops.link"
            );
            const contract = new ethers.Contract(
              "0xC04b063F5Fd9F03B67359DE79d3b18a55f73cB0c",
              [
                {
                  "inputs": [
                    { "name": "", "type": "string" },
                    { "name": "", "type": "address" }
                  ],
                  "name": "verified_institutions",
                  "outputs": [{ "name": "", "type": "bool" }],
                  "stateMutability": "view",
                  "type": "function"
                }
              ],
              provider
            );
            const institutionsWithStatus = await Promise.all(
              registered.map(async (inst) => ({
                ...inst,
                verified: await contract.verified_institutions(inst.name, inst.walletAddress)
              }))
            );
            setInstitutions(institutionsWithStatus);
          }
        }
      } catch (e) {
        console.error("Initialization failed:", e);
      }
    })();
  }, []);

  const validForm = isAddress(form.institutionWalletAddress) && form.institutionName.trim().length > 1;

  function onChange<K extends keyof VerifyForm>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function verifyInstitution() {
    if (!validForm) {
      setError("Please provide a valid institution name and wallet address.");
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      const factory = await getWriteFactory();
      const tx = await factory.verifyInstitution(
        form.institutionName,
        getAddress(form.institutionWalletAddress)
      );
      await tx.wait();
      setSuccess(`Institution ${form.institutionName} verified successfully!`);
      setForm(initialForm);
      setInstitutions((prev) =>
        prev.map((inst) =>
          inst.name === form.institutionName && inst.walletAddress.toLowerCase() === getAddress(form.institutionWalletAddress).toLowerCase()
            ? { ...inst, verified: true }
            : inst
        )
      );
    } catch (err: any) {
      const msg = err.reason || err.message || "Failed to verify institution. Ensure details match registration records.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function unverifyInstitution(name: string, walletAddress: string) {
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      const factory = await getWriteFactory();
      const tx = await factory.unverifyInstitution(name, getAddress(walletAddress));
      await tx.wait();
      setSuccess(`Institution ${name} unverified successfully!`);
      setInstitutions((prev) =>
        prev.map((inst) =>
          inst.walletAddress.toLowerCase() === walletAddress.toLowerCase() && inst.name === name
            ? { ...inst, verified: false }
            : inst
        )
      );
    } catch (err: any) {
      const msg = err.reason || err.message || "Failed to unverify institution.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (!account || !isAgent) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0b0f1a] to-black text-white">
        <div className="mx-auto max-w-4xl px-6 py-12">
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
                  ⚠️ Wallet not connected
                </span>
              )}
            </div>
          </header>
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center">
            <h2 className="text-2xl font-semibold text-red-300">Not Authorized</h2>
            <p className="mt-2 text-white/70">
              This page is restricted to factory agents. Please connect an authorized wallet or return to the homepage.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-lg bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0b0f1a] to-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            CERTHUB
          </Link>
          <div className="text-sm">
            <span className="rounded-md bg-emerald-500/10 px-3 py-1 text-emerald-300">
              ✅ Agent: {account.slice(0, 6)}…{account.slice(-4)}
            </span>
          </div>
        </header>

        {/* Intro */}
        <section className="mb-10">
          <h1 className="text-3xl font-bold sm:text-4xl">Verify Institutions</h1>
          <p className="mt-2 text-white/70">
            Authenticate institutions on the Hyperion Testnet to enable them to issue certificates. Only factory agents can access this page.
          </p>
        </section>

        {/* Form */}
        <section className="mb-12 rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold mb-4">Verify New Institution</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              verifyInstitution();
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <label className="text-sm text-white/70">Institution Name *</label>
              <input
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
                value={form.institutionName}
                onChange={(e) => onChange("institutionName", e.target.value)}
                placeholder="Havard"
                required
              />
            </div>
            <div>
              <label className="text-sm text-white/70">Institution Wallet Address *</label>
              <input
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
                value={form.institutionWalletAddress}
                onChange={(e) => onChange("institutionWalletAddress", e.target.value)}
                placeholder="0x..."
                required
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submitting || !validForm}
                className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {submitting ? "Verifying…" : "Verify Institution"}
              </button>
            </div>
          </form>
          {error && (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
              {success}
            </div>
          )}
        </section>

        {/* Institutions Table */}
        <section className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold mb-4">Registered Institutions</h2>
          {institutions.length === 0 ? (
            <p className="text-white/70">No institutions registered yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-3 px-4 text-left text-white/70">Institution Name</th>
                    <th className="py-3 px-4 text-left text-white/70">Wallet Address</th>
                    <th className="py-3 px-4 text-left text-white/70">Type</th>
                    <th className="py-3 px-4 text-left text-white/70">Industry</th>
                    <th className="py-3 px-4 text-left text-white/70">Status</th>
                    <th className="py-3 px-4 text-left text-white/70">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {institutions.map((inst) => (
                    <tr key={`${inst.name}-${inst.walletAddress}`} className="border-b border-white/5">
                      <td className="py-3 px-4">{inst.name}</td>
                      <td className="py-3 px-4">
                        <a
                          href={`${HYPERION_TESTNET.blockExplorers.default.url}/address/${inst.walletAddress}`}
                          target="_blank"
                          rel="noreferrer"
                          className="underline hover:text-emerald-200"
                        >
                          {inst.walletAddress.slice(0, 6)}…{inst.walletAddress.slice(-4)}
                        </a>
                      </td>
                      <td className="py-3 px-4">{inst.institutionType}</td>
                      <td className="py-3 px-4">{inst.industryOrSector}</td>
                      <td className="py-3 px-4">
                        {inst.verified ? (
                          <span className="flex items-center gap-1 text-emerald-300">
                            <CheckCircle size={16} /> Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-yellow-300">
                            <XCircle size={16} /> Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {inst.verified ? (
                          <button
                            onClick={() => unverifyInstitution(inst.name, inst.walletAddress)}
                            disabled={submitting}
                            className="rounded-lg bg-red-600 px-4 py-1 text-sm text-white hover:bg-red-700 disabled:opacity-50"
                          >
                            Unverify
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setForm({ institutionName: inst.name, institutionWalletAddress: inst.walletAddress });
                              verifyInstitution();
                            }}
                            disabled={submitting}
                            className="rounded-lg bg-emerald-600 px-4 py-1 text-sm text-white hover:bg-emerald-700 disabled:opacity-50"
                          >
                            Verify
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}