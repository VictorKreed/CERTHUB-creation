"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getWriteFactory, getConnectedAccount, ensureHyperionNetwork } from "@/lib/factory";
import { FACTORY_ABI } from "@/lib/factoryAbi";
import { isAddress, getAddress } from "ethers";

type IssueForm = {
  institutionName: string;
  certificateName: string;
  certificateId: string;
  uri: string;
  year: string;
  quantity: string;
  recipients: string; // Comma/space/newline-separated addresses
  verifiedWalletAddress: string;
};

const initialForm: IssueForm = {
  institutionName: "",
  certificateName: "",
  certificateId: "",
  uri: "",
  year: "",
  quantity: "",
  recipients: "",
  verifiedWalletAddress: "",
};

type ProofsPayload = {
  root: string;
  count: number;
  addresses: string[];
  leaves: string[];
  proofs: Record<string, string[]>;
  params: { hash: string; sortedPairs: boolean };
} | null;

export default function IssuePage() {
  const [form, setForm] = useState<IssueForm>(initialForm);
  const [account, setAccount] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [deployedAddress, setDeployedAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatedRoot, setGeneratedRoot] = useState<string | null>(null);
  const [proofsCount, setProofsCount] = useState<number | null>(null);
  const [proofsData, setProofsData] = useState<ProofsPayload>(null);

  // Connect wallet & prefill verifiedWalletAddress if empty
  useEffect(() => {
    (async () => {
      try {
        await ensureHyperionNetwork();
        const acc = await getConnectedAccount();
        setAccount(acc);
        if (acc && !form.verifiedWalletAddress) {
          setForm((f) => ({ ...f, verifiedWalletAddress: acc }));
        }
      } catch (e) {
        // Ignore – user may connect later
      }
    })();
  }, []);

  const isCallerVerifiedWallet = useMemo(() => {
    if (!account) return false;
    return account.toLowerCase() === form.verifiedWalletAddress.toLowerCase();
  }, [account, form.verifiedWalletAddress]);

  const valid = useMemo(() => {
    const isAddr = (s: string) => /^0x[a-fA-F0-9]{40}$/.test(s);
    const yearNum = Number(form.year);
    const quantityNum = Number(form.quantity);
    return (
      form.institutionName.trim().length > 1 &&
      form.certificateName.trim().length > 1 &&
      form.certificateId.trim().length > 1 &&
      form.uri.trim().length > 3 &&
      yearNum >= 1900 && yearNum <= 3000 &&
      quantityNum >= 1 &&
      isAddr(form.verifiedWalletAddress) &&
      form.recipients.trim().length > 0
    );
  }, [form]);

  function onChange<K extends keyof IssueForm>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function generateMerkle() {
    setError(null);
    setGeneratedRoot(null);
    setProofsCount(null);
    setProofsData(null);

    const addresses = form.recipients
      .split(/[\s,]+/)
      .map((a) => a.trim())
      .filter((a) => a && isAddress(a));
    if (addresses.length === 0) {
      setError("Please provide at least one valid Ethereum address.");
      return;
    }

    try {
      setGenerating(true);
      const res = await fetch("/api/merkle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addresses, sortPairs: true }),
      });
      const data: ProofsPayload = await res.json();
      if (!res.ok || !data?.root) {
        throw new Error("Failed to generate Merkle root.");
      }
      setGeneratedRoot(data.root);
      setProofsCount(data.count);
      setProofsData(data);

      // Trigger download
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `proofs-${form.certificateId || "certificate"}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || "Failed to generate Merkle root.");
    } finally {
      setGenerating(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setTxHash(null);
    setDeployedAddress(null);

    if (!valid) {
      setError("Please complete all required fields with valid values.");
      return;
    }
    if (!isCallerVerifiedWallet) {
      setError("The connected wallet must match the verified wallet address.");
      return;
    }
    if (!generatedRoot) {
      setError("Please generate a Merkle root first.");
      return;
    }

    try {
      setSubmitting(true);
      const factory = await getWriteFactory();
      const tx = await factory.createCertificate(
        form.institutionName,
        form.certificateName,
        form.certificateId,
        form.uri,
        generatedRoot,
        Number(form.year),
        Number(form.quantity),
        getAddress(form.verifiedWalletAddress)
      );
      const receipt = await tx.wait();
      setTxHash(receipt?.hash ?? tx?.hash ?? null);

      // Extract deployed address from CertificateDeployed event
      const logs = receipt.logs.filter((log: any) =>
        log.address.toLowerCase() === factory.address//.toLowerCase()
      );
      const parsed = logs
        .map((log: any) => factory.interface.parseLog(log))
        .find((log: any) => log?.name === "CertificateDeployed");
      if (parsed) {
        setDeployedAddress(parsed.args.certificateAddress);
      }
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
          <h1 className="text-3xl font-bold sm:text-4xl">
            Issue a New Certificate
          </h1>
          <p className="mt-2 text-white/70">
            Deploy a new certificate clone on the Hyperion Testnet. Provide details
            and recipient addresses to generate a Merkle root for claiming.
          </p>
        </section>

        {/* Form */}
        <form onSubmit={onSubmit} className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm text-white/70">Institution Name *</label>
              <input
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
                value={form.institutionName}
                onChange={(e) => onChange("institutionName", e.target.value)}
                placeholder="University of Blockchain"
                required
              />
            </div>
            <div>
              <label className="text-sm text-white/70">Certificate Name *</label>
              <input
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
                value={form.certificateName}
                onChange={(e) => onChange("certificateName", e.target.value)}
                placeholder="Advanced Solidity"
                required
              />
            </div>
            <div>
              <label className="text-sm text-white/70">Certificate ID *</label>
              <input
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
                value={form.certificateId}
                onChange={(e) => onChange("certificateId", e.target.value)}
                placeholder="CERT-2025-0001"
                required
              />
            </div>
            <div>
              <label className="text-sm text-white/70">Year *</label>
              <input
                type="number"
                min={1900}
                max={3000}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
                value={form.year}
                onChange={(e) => onChange("year", e.target.value)}
                placeholder="2025"
                required
              />
            </div>
            <div>
              <label className="text-sm text-white/70">Token Quantity *</label>
              <input
                type="number"
                min={1}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
                value={form.quantity}
                onChange={(e) => onChange("quantity", e.target.value)}
                placeholder="100"
                required
              />
            </div>
            <div>
              <label className="text-sm text-white/70">Verified Wallet Address *</label>
              <input
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
                value={form.verifiedWalletAddress}
                onChange={(e) => onChange("verifiedWalletAddress", e.target.value)}
                placeholder="0x..."
                required
              />
              {account &&
                form.verifiedWalletAddress &&
                account.toLowerCase() === form.verifiedWalletAddress.toLowerCase() && (
                  <span className="text-xs text-emerald-400">Connected</span>
                )}
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-white/70">Certificate URI *</label>
              <input
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
                value={form.uri}
                onChange={(e) => onChange("uri", e.target.value)}
                placeholder="ipfs://... or https://example.com/metadata.json"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-white/70">
                Recipients (comma, space, or newline-separated addresses) *
              </label>
              <textarea
                className="w-full min-h-[100px] rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
                value={form.recipients}
                onChange={(e) => onChange("recipients", e.target.value)}
                placeholder="0xabc..., 0xdef..., 0x123..."
                required
              />
              <button
                type="button"
                onClick={generateMerkle}
                disabled={generating || !form.recipients.trim()}
                className="mt-3 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15 disabled:opacity-50"
              >
                {generating ? "Generating…" : "Generate Merkle Root & Download Proofs"}
              </button>
              {generatedRoot && (
                <div className="mt-2 text-xs text-emerald-400">
                  Merkle Root: {generatedRoot} ({proofsCount} recipients)
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}
          {txHash && (
            <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
              Certificate deployed successfully.{" "}
              <a
                className="underline hover:text-emerald-200"
                href={`https://hyperion-testnet-explorer.metisdevops.link/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
              >
                View Transaction
              </a>
              {deployedAddress && (
                <>
                  {" • "}
                  <a
                    className="underline hover:text-emerald-200"
                    href={`https://hyperion-testnet-explorer.metisdevops.link/address/${deployedAddress}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Contract
                  </a>
                </>
              )}
              <p className="mt-2 text-xs text-white/60">
                Recipients can now claim their certificates using the downloaded proofs.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting || !valid || !isCallerVerifiedWallet || !generatedRoot}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Issue Certificate"}
            </button>
            <Link href="/" className="text-white/70 hover:underline">
              Back to Home
            </Link>
          </div>
        </form>

        {/* Info box */}
        <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-4">
          <h3 className="mb-2 text-lg font-semibold">What happens next?</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-white/70">
            <li>A new certificate clone is deployed via the factory contract.</li>
            <li>An on-chain <em>CertificateDeployed</em> event is emitted.</li>
            <li>Recipients can claim their certificates using the generated Merkle proofs.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}