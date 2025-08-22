"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { isAddress, getAddress } from "ethers";
import { HYPERION_TESTNET } from "@/lib/chain";
import { getConnectedAccount, ensureHyperionNetwork } from "@/lib/factory";
import { FACTORY_ABI } from "@/lib/factoryAbi";

type InspectForm = {
  institutionWalletAddress: string;
  certificateName: string;
  certificateYear: string;
};

const initialForm: InspectForm = {
  institutionWalletAddress: "",
  certificateName: "",
  certificateYear: "",
};

type CertificateDetails = {
  InstitutionAddress: string;
  IssuerAddress: string;
  InstitutionName: string;
  CertificateName: string;
  CertificateId: string;
  CertificateYear: string;
  Uri: string;
  MerkleRoot: string;
  CertificateTokenQuantity: string;
};

export default function InspectPage() {
  const [form, setForm] = useState<InspectForm>(initialForm);
  const [account, setAccount] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [certificateDetails, setCertificateDetails] = useState<CertificateDetails | null>(null);

  // Connect wallet for status display (optional)
  useEffect(() => {
    (async () => {
      try {
        await ensureHyperionNetwork();
        const acc = await getConnectedAccount();
        setAccount(acc);
      } catch (e) {
        // Ignore – wallet connection is optional for read-only
      }
    })();
  }, []);

  const valid = useMemo(() => {
    const yearNum = Number(form.certificateYear);
    return (
      isAddress(form.institutionWalletAddress) &&
      form.certificateName.trim().length > 1 &&
      yearNum >= 1900 && yearNum <= 3000
    );
  }, [form]);

  function onChange<K extends keyof InspectForm>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setError(null);
    setCertificateDetails(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCertificateDetails(null);

    if (!valid) {
      setError("Please provide a valid institution wallet address, certificate name, and year (1900–3000).");
      return;
    }

    try {
      setSubmitting(true);
      const provider = new ethers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL || "https://hyperion-testnet.metisdevops.link"
      );
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_FACTORY_ADDRESS || "0xC04b063F5Fd9F03B67359DE79d3b18a55f73cB0c",
        FACTORY_ABI,
        provider
      );

      // Debug: Log inputs
      console.log("Calling expandCertificateDetails with:", {
        institutionWalletAddress: getAddress(form.institutionWalletAddress),
        certificateName: form.certificateName,
        certificateYear: Number(form.certificateYear),
      });

      const details = await contract.expandCertificateDetails(
        getAddress(form.institutionWalletAddress),
        form.certificateName,
        Number(form.certificateYear)
      );

      // Debug: Log raw output
      console.log("Raw contract output:", details);

      // Parse tuple output
      const parsedDetails: CertificateDetails = {
        InstitutionAddress: details.InstitutionAddress || details[0],
        IssuerAddress: details.IssuerAddress || details[1],
        InstitutionName: details.InstitutionName || details[2],
        CertificateName: details.CertificateName || details[3],
        CertificateId: details.CertificateId || details[4],
        CertificateYear: (details.CertificateYear || details[5]).toString(),
        Uri: details.Uri || details[6],
        MerkleRoot: details.MerkleRoot || details[7],
        CertificateTokenQuantity: (details.CertificateTokenQuantity || details[8]).toString(),
      };

      // Debug: Log parsed details
      console.log("Parsed certificate details:", parsedDetails);

      setCertificateDetails(parsedDetails);
    } catch (err: any) {
      console.error("Error details:", err);
      let msg = err.reason || err.message || "Failed to fetch certificate details.";
      if (err.code === "CALL_EXCEPTION" && err.data) {
        try {
          const parsedError = contract.interface.parseError(err.data);
          msg = parsedError?.args?.[0] || parsedError?.name || msg;
        } catch (parseErr) {
          console.error("Error parsing revert reason:", parseErr);
        }
      }
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
                ⚠️ Wallet not connected
              </span>
            )}
          </div>
        </header>

        {/* Intro */}
        <section className="mb-10">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Inspect Certificate Details
          </h1>
          <p className="mt-2 text-white/70">
            View details of a certificate deployed on the Hyperion Testnet by providing the institution's wallet address, certificate name, and year.
          </p>
        </section>

        {/* Form */}
        <form onSubmit={onSubmit} className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
              <label className="text-sm text-white/70">Certificate Year *</label>
              <input
                type="number"
                min={1900}
                max={3000}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
                value={form.certificateYear}
                onChange={(e) => onChange("certificateYear", e.target.value)}
                placeholder="2025"
                required
              />
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}
          {certificateDetails && (
            <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <h3 className="mb-2 text-lg font-semibold text-emerald-300">Certificate Details</h3>
              <div className="grid grid-cols-1 gap-3 text-sm text-white/90">
                <div>
                  <span className="text-white/70">Institution Name:</span>{" "}
                  {certificateDetails.InstitutionName || "Not provided"}
                </div>
                <div>
                  <span className="text-white/70">Certificate Name:</span>{" "}
                  {certificateDetails.CertificateName}
                </div>
                <div>
                  <span className="text-white/70">Certificate ID:</span>{" "}
                  {certificateDetails.CertificateId}
                </div>
                <div>
                  <span className="text-white/70">Year:</span>{" "}
                  {certificateDetails.CertificateYear}
                </div>
                <div>
                  <span className="text-white/70">Institution Address:</span>{" "}
                  <a
                    className="underline hover:text-emerald-200"
                    href={`${HYPERION_TESTNET.blockExplorers.default.url}/address/${certificateDetails.InstitutionAddress}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {certificateDetails.InstitutionAddress.slice(0, 6)}…{certificateDetails.InstitutionAddress.slice(-4)}
                  </a>
                </div>
                <div>
                  <span className="text-white/70">Issuer Address:</span>{" "}
                  <a
                    className="underline hover:text-emerald-200"
                    href={`${HYPERION_TESTNET.blockExplorers.default.url}/address/${certificateDetails.IssuerAddress}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {certificateDetails.IssuerAddress.slice(0, 6)}…{certificateDetails.IssuerAddress.slice(-4)}
                  </a>
                </div>
                <div>
                  <span className="text-white/70">URI:</span>{" "}
                  <a
                    className="underline hover:text-emerald-200"
                    href={certificateDetails.Uri}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {certificateDetails.Uri}
                  </a>
                </div>
                <div>
                  <span className="text-white/70">Merkle Root:</span>{" "}
                  <span className="font-mono">{certificateDetails.MerkleRoot.slice(0, 10)}…{certificateDetails.MerkleRoot.slice(-8)}</span>
                </div>
                <div>
                  <span className="text-white/70">Token Quantity:</span>{" "}
                  {certificateDetails.CertificateTokenQuantity}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting || !valid}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {submitting ? "Fetching…" : "Inspect Certificate"}
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
            <li>Certificate details are fetched from the Hyperion Testnet.</li>
            <li>View the institution, issuer, and certificate metadata, including the Merkle root and token quantity.</li>
            <li>Use these details to verify or claim the certificate.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}