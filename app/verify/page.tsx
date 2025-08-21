"use client";

import { useState } from "react";
import { ethers } from "ethers";
import Link from "next/link";

export default function VerifyCertificateClaim() {
  const [form, setForm] = useState({
    institutionWalletAddress: "",
    institutionName: "",
    certificateName: "",
    certificateYear: "",
    recipientAddress: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<{
    RecipientName: string;
    CertificateName: string;
    CertificateYear: number;
    CertificateId: string;
    RecipientId: number;
    InstitutionName: string;
    Claimed: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
    setResult(null);
  };

  const validateForm = () => {
    if (!ethers.isAddress(form.institutionWalletAddress)) {
      setError("Invalid institution wallet address");
      return false;
    }
    if (!form.certificateName) {
      setError("Certificate name is required");
      return false;
    }
    if (!form.certificateYear || isNaN(Number(form.certificateYear))) {
      setError("Valid certificate year is required");
      return false;
    }
    if (!ethers.isAddress(form.recipientAddress)) {
      setError("Invalid recipient address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    setResult(null);

    if (!validateForm()) {
      setStatus("error");
      return;
    }

    try {
      const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL || "https://hyperion-testnet.metisdevops.link");
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_FACTORY_ADDRESS || "0xC04b063F5Fd9F03B67359DE79d3b18a55f73cB0c",
        [
          "function verifyCertificate(address recipientAddress, string calldata certificateName, uint256 certificateYear, address institutionWalletAddress) public view returns ((string RecipientName, string CertificateName, uint256 CertificateYear, string CertificateId, uint256 RecipientId, string InstitutionName, bool Claimed) memory details)"
        ],
        provider
      );

      const details = await contract.verifyCertificate(
        form.recipientAddress,
        form.certificateName,
        Number(form.certificateYear),
        form.institutionWalletAddress
      );

      setResult({
        RecipientName: details[0],
        CertificateName: details[1],
        CertificateYear: Number(details[2]),
        CertificateId: details[3],
        RecipientId: Number(details[4]),
        InstitutionName: details[5],
        Claimed: details[6],
      });
      setStatus("success");
    } catch (err: any) {
      console.error("Verify certificate error:", err);
      setError(err.reason || err.message || "Failed to verify certificate claim");
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
            <span className="rounded-md bg-emerald-500/10 px-3 py-1 text-emerald-300">
              Public Verification
            </span>
          </div>
        </header>

        <section className="mb-10">
          <h1 className="text-3xl font-bold sm:text-4xl">Verify Certificate Claim</h1>
          <p className="mt-2 text-white/70">
            Verify a recipient's certificate claim on the Hyperion Testnet. Enter the institution, certificate, and recipient details below.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="rounded-xl border border-white/10 bg-white/5 p-4">
          {/* Institution Details Box */}
          <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <h2 className="text-lg font-semibold mb-4">Institution Details</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm text-white/70">Institution Wallet Address *</label>
                <input
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
                  name="institutionWalletAddress"
                  value={form.institutionWalletAddress}
                  onChange={handleInputChange}
                  placeholder="e.g., 0xabc..."
                  required
                />
              </div>
              <div>
                <label className="text-sm text-white/70">Institution Name (optional)</label>
                <input
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
                  name="institutionName"
                  value={form.institutionName}
                  onChange={handleInputChange}
                  placeholder="e.g., Harvard"
                />
              </div>
            </div>
          </div>

          {/* Certificate Details Box */}
          <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <h2 className="text-lg font-semibold mb-4">Certificate Details</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm text-white/70">Certificate Name *</label>
                <input
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
                  name="certificateName"
                  value={form.certificateName}
                  onChange={handleInputChange}
                  placeholder="e.g., Bachelor of Science"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-white/70">Certificate Year *</label>
                <input
                  type="number"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
                  name="certificateYear"
                  value={form.certificateYear}
                  onChange={handleInputChange}
                  placeholder="e.g., 2023"
                  required
                />
              </div>
            </div>
          </div>

          {/* Recipient Details Box */}
          <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <h2 className="text-lg font-semibold mb-4">Recipient Details</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm text-white/70">Recipient Address *</label>
                <input
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
                  name="recipientAddress"
                  value={form.recipientAddress}
                  onChange={handleInputChange}
                  placeholder="e.g., 0x123..."
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
          {status === "success" && result && (
            <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
              {result.Claimed ? (
                <>
                  <p>✅ Valid Certificate Claim!</p>
                  <ul className="mt-2 list-disc pl-5">
                    <li>Recipient Name: {result.RecipientName || "Not provided"}</li>
                    <li>Certificate Name: {result.CertificateName}</li>
                    <li>Certificate Year: {result.CertificateYear}</li>
                    <li>Certificate ID: {result.CertificateId}</li>
                    <li>Recipient ID: {result.RecipientId}</li>
                    <li>Institution Name: {result.InstitutionName}</li>
                  </ul>
                </>
              ) : (
                <p>❌ No Claim Found for this Recipient</p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {status === "loading" ? "Verifying…" : "Verify Claim"}
            </button>
            <Link href="/" className="text-white/70 hover:underline">
              Back to Home
            </Link>
          </div>
        </form>

        {/* Info box */}
        <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-4">
          <h3 className="mb-2 text-lg font-semibold">How it works</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-white/70">
            <li>Enter the institution wallet address, certificate name, certificate year, and recipient address.</li>
            <li>The contract checks if the recipient has a valid claim for the specified certificate.</li>
            <li>Results show whether the claim is valid, along with details like recipient name, certificate ID, and institution name.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}