"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getWriteFactory, getConnectedAccount } from "@/lib/factory";
import Link from "next/link";

export default function UpdateCertificate() {
  const [account, setAccount] = useState<string | null>(null);
  const [form, setForm] = useState({
    institutionName: "",
    previousCertificateName: "",
    previousCertificateYear: "",
    certificateName: "",
    certificateId: "",
    uri: "",
    newCertificateYear: "",
    merkleRoot: "",
    recipients: "", // For generating merkle root
    certificateTokenUpdateQuantity: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [generatedRoot, setGeneratedRoot] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    (async () => {
      const acc = await getConnectedAccount();
      setAccount(acc);
    })();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const validateForm = () => {
    if (!account) {
      setError("Wallet not connected");
      return false;
    }
    if (!form.institutionName) {
      setError("Institution name is required");
      return false;
    }
    if (!form.previousCertificateName) {
      setError("Previous certificate name is required");
      return false;
    }
    if (!form.previousCertificateYear || isNaN(Number(form.previousCertificateYear))) {
      setError("Valid previous certificate year is required");
      return false;
    }
    if (!form.certificateName) {
      setError("New certificate name is required");
      return false;
    }
    if (!form.certificateId) {
      setError("Certificate ID is required");
      return false;
    }
    if (!form.uri) {
      setError("URI is required");
      return false;
    }
    if (!form.newCertificateYear || isNaN(Number(form.newCertificateYear))) {
      setError("Valid new certificate year is required");
      return false;
    }
    if (!form.merkleRoot || !/^0x[a-fA-F0-9]{64}$/.test(form.merkleRoot)) {
      setError("Invalid Merkle root (must be 32-byte hex string)");
      return false;
    }
    if (!form.certificateTokenUpdateQuantity || isNaN(Number(form.certificateTokenUpdateQuantity))) {
      setError("Valid certificate token quantity is required");
      return false;
    }
    return true;
  };

  const generateMerkle = async () => {
    setError(null);
    setGeneratedRoot(null);
    setGenerating(true);

    const addresses = form.recipients
      .split(/[\s,]+/)
      .map((a) => a.trim())
      .filter((a) => a && ethers.isAddress(a));
    if (addresses.length === 0) {
      setError("Please provide at least one valid Ethereum address.");
      setGenerating(false);
      return;
    }

    try {
      const res = await fetch("/api/merkle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addresses, sortPairs: true }),
      });
      const data = await res.json();
      if (!res.ok || !data?.root) {
        throw new Error(data?.error || "Failed to generate Merkle root.");
      }
      setGeneratedRoot(data.root);
      setForm({ ...form, merkleRoot: data.root });

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    if (!validateForm()) {
      setStatus("error");
      return;
    }

    try {
      const contract = await getWriteFactory();
      const tx = await contract.updateCertificate(
        account,
        form.institutionName,
        form.previousCertificateName,
        form.certificateName,
        form.certificateId,
        form.uri,
        Number(form.previousCertificateYear),
        Number(form.newCertificateYear),
        form.merkleRoot,
        Number(form.certificateTokenUpdateQuantity)
      );
      await tx.wait();
      setStatus("success");
    } catch (err: any) {
      console.error("Update certificate error:", err);
      setError(err.reason || err.message || "Failed to update certificate");
      setStatus("error");
    }
  };

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
                ⚠️ Please connect your wallet
              </span>
            )}
          </div>
        </header>

        <section className="mb-10">
          <h1 className="text-3xl font-bold sm:text-4xl">Update Certificate</h1>
          <p className="mt-2 text-white/70">
            Update certificate details on the Hyperion Testnet. Only verified institutions and admins can access this page.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="rounded-xl border border-white/10 bg-white/5 p-4">
          {/* Institution Name Box */}
          <div className="mb-6">
            <label className="text-sm text-white/70">Institution Name *</label>
            <input
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
              name="institutionName"
              value={form.institutionName}
              onChange={handleInputChange}
              placeholder="e.g., Havard"
              required
            />
          </div>

          {/* Previous Certificate Details Box */}
          <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <h2 className="text-lg font-semibold mb-4">Previous Certificate Details</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm text-white/70">Previous Certificate Name *</label>
                <input
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
                  name="previousCertificateName"
                  value={form.previousCertificateName}
                  onChange={handleInputChange}
                  placeholder="e.g., celo"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-white/70">Previous Certificate Year *</label>
                <input
                  type="number"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
                  name="previousCertificateYear"
                  value={form.previousCertificateYear}
                  onChange={handleInputChange}
                  placeholder="e.g., 2027"
                  required
                />
              </div>
            </div>
          </div>

          {/* Update Details Box */}
          <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <h2 className="text-lg font-semibold mb-4">Update Details</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm text-white/70">New Certificate Name *</label>
                <input
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
                  name="certificateName"
                  value={form.certificateName}
                  onChange={handleInputChange}
                  placeholder="e.g., New Celo"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-white/70">Certificate ID *</label>
                <input
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
                  name="certificateId"
                  value={form.certificateId}
                  onChange={handleInputChange}
                  placeholder="e.g., CEL23-UPD"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-white/70">URI *</label>
                <input
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
                  name="uri"
                  value={form.uri}
                  onChange={handleInputChange}
                  placeholder="e.g., ipfs://Qm..."
                  required
                />
              </div>
              <div>
                <label className="text-sm text-white/70">New Certificate Year *</label>
                <input
                  type="number"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
                  name="newCertificateYear"
                  value={form.newCertificateYear}
                  onChange={handleInputChange}
                  placeholder="e.g., 2028"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-white/70">Recipients (for new Merkle root, comma-separated)</label>
                <textarea
                  className="w-full min-h-[100px] rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
                  name="recipients"
                  value={form.recipients}
                  onChange={handleInputChange}
                  placeholder="0xabc..., 0xdef..."
                />
                <button
                  type="button"
                  onClick={generateMerkle}
                  disabled={generating || !form.recipients.trim()}
                  className="mt-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15 disabled:opacity-50"
                >
                  {generating ? "Generating…" : "Generate Merkle Root & Download Proofs"}
                </button>
                {generatedRoot && (
                  <p className="mt-2 text-xs text-emerald-400">
                    Generated Merkle Root: {generatedRoot}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-white/70">Certificate Token Update Quantity *</label>
                <input
                  type="number"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
                  name="certificateTokenUpdateQuantity"
                  value={form.certificateTokenUpdateQuantity}
                  onChange={handleInputChange}
                  placeholder="e.g., 100"
                  required
                />
              </div>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}
          {status === "success" && (
            <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
              Certificate updated successfully!
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {status === "loading" ? "Updating…" : "Update Certificate"}
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
            <li>An on-chain <em>CertificateUpdated</em> event is emitted.</li>
            <li>The certificate's details are updated in the contract.</li>
            <li>Recipients can continue to claim using the updated Merkle root.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}