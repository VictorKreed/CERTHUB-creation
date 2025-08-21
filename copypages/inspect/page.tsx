"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Contract,
  JsonRpcProvider,
  isAddress,
  getAddress,
} from "ethers";

/* ----------------------------- Chain / Factory ----------------------------- */

const RPC_URL = "https://hyperion-testnet.metisdevops.link";
const EXPLORER_ADDR = "https://hyperion-testnet-explorer.metisdevops.link/address/";

// Updated Factory Address
const FACTORY_ADDRESS = "0xC04b063F5Fd9F03B67359DE79d3b18a55f73cB0c" as const;

// Updated ABI (expandCertificateDetails + institution_certificates)
const FACTORY_ABI = [
  {
    type: "function",
    stateMutability: "view",
    name: "expandCertificateDetails",
    inputs: [
      { name: "institutionWalletAddress", type: "address" },
      { name: "certificateName", type: "string" },
      { name: "certificateYear", type: "uint256" },
    ],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "InstitutionAddress", type: "address" },
          { name: "IssuerAddress", type: "address" },
          { name: "InstitutionName", type: "string" },
          { name: "CertificateName", type: "string" },
          { name: "CertificateId", type: "string" },
          { name: "CertificateYear", type: "uint256" },
          { name: "Uri", type: "string" },
          { name: "MerkleRoot", type: "bytes32" },
          { name: "CertificateTokenQuantity", type: "uint256" },
        ],
      },
    ],
  },
  {
    type: "function",
    stateMutability: "view",
    name: "institution_certificates",
    inputs: [
      { name: "", type: "address" },
      { name: "", type: "string" },
      { name: "", type: "uint256" },
    ],
    outputs: [{ name: "", type: "address" }],
  },
] as const;

const provider = new JsonRpcProvider(RPC_URL);

/* --------------------------------- Types ---------------------------------- */

type Form = {
  institutionWallet: string;
  certificateName: string;
  certificateYear: string;
};

const DEFAULTS: Form = {
  institutionWallet: "",
  certificateName: "",
  certificateYear: "",
};

/* -------------------------------- Helpers --------------------------------- */

function normalizeAddr(a: string) {
  if (!isAddress(a)) throw new Error(`Invalid address: ${a}`);
  return getAddress(a);
}
function short(a: string) {
  return a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "";
}

/* --------------------------------- Page ----------------------------------- */

export default function InspectPage() {
  const [form, setForm] = useState<Form>(DEFAULTS);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // Data we render
  const [cloneAddress, setCloneAddress] = useState<string | null>(null);
  const [data, setData] = useState<any | null>(null);

  function update<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onInspect(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setData(null);
    setCloneAddress(null);

    try {
      const inst = normalizeAddr(form.institutionWallet.trim());
      const name = form.certificateName.trim();
      const yearStr = form.certificateYear.trim();

      if (!name) throw new Error("Certificate Name is required.");
      if (!/^\d+$/.test(yearStr)) throw new Error("Year must be a whole number.");

      setLoading(true);

      const factory = new Contract(FACTORY_ADDRESS, FACTORY_ABI as any, provider);

      // first fetch the clone address to show link
      const addr: string = await factory.institution_certificates(
        inst,
        name,
        BigInt(yearStr)
      );
      if (addr === "0x0000000000000000000000000000000000000000") {
        throw new Error("No certificate clone found for those inputs.");
      }
      setCloneAddress(addr);

      // then pull the expanded struct
      const res = await factory.expandCertificateDetails(inst, name, BigInt(yearStr));
      setData(res);
    } catch (err: any) {
      setStatus(err?.reason || err?.message || "Failed to inspect certificate.");
    } finally {
      setLoading(false);
    }
  }

  // Some ABIs may name IssuerAddress as issuerAddress. Helper:
  function issuer(res: any): string {
    return res?.IssuerAddress ?? res?.issuerAddress ?? "";
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0b0f1a] to-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            CERTHUB
          </Link>
        </header>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-sm">
          <h1 className="mb-6 text-center text-2xl font-bold">Inspect a Certificate</h1>

          <form className="grid grid-cols-1 gap-5" onSubmit={onInspect}>
            <div>
              <label className="text-sm text-white/70">Institution Wallet *</label>
              <input
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-cyan-400"
                value={form.institutionWallet}
                onChange={(e) => update("institutionWallet", e.target.value)}
                placeholder="0x…"
                required
              />
            </div>
            <div>
              <label className="text-sm text-white/70">Certificate Name *</label>
              <input
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-cyan-400"
                value={form.certificateName}
                onChange={(e) => update("certificateName", e.target.value)}
                placeholder="e.g., Advanced Solidity"
                required
              />
            </div>
            <div>
              <label className="text-sm text-white/70">Certificate Year *</label>
              <input
                type="number"
                min={1900}
                max={3000}
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-cyan-400"
                value={form.certificateYear}
                onChange={(e) => update("certificateYear", e.target.value)}
                placeholder="2025"
                required
              />
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Inspecting…" : "Inspect a Certificate"}
              </button>
            </div>
          </form>

          {/* Status */}
          {status && (
            <div className="mt-6 rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {status}
            </div>
          )}

          {/* Results */}
          {cloneAddress && (
            <div className="mt-6 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm">
              <div className="flex flex-col gap-1">
                <div>
                  <b>Certificate Clone:</b>{" "}
                  <a
                    className="underline text-cyan-300"
                    href={`${EXPLORER_ADDR}${cloneAddress}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {cloneAddress} ({short(cloneAddress)})
                  </a>
                </div>
              </div>
            </div>
          )}

          {data && (
            <div className="mt-6 rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
              <h2 className="mb-2 font-semibold text-emerald-200">Expanded Certificate Details</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-emerald-300/80 text-xs uppercase">Institution Address</div>
                  <div className="font-mono break-all">{String(data.InstitutionAddress)}</div>
                </div>
                <div>
                  <div className="text-emerald-300/80 text-xs uppercase">Issuer Address</div>
                  <div className="font-mono break-all">{issuer(data)}</div>
                </div>
                <div>
                  <div className="text-emerald-300/80 text-xs uppercase">Institution Name</div>
                  <div>{String(data.InstitutionName)}</div>
                </div>
                <div>
                  <div className="text-emerald-300/80 text-xs uppercase">Certificate Name</div>
                  <div>{String(data.CertificateName)}</div>
                </div>
                <div>
                  <div className="text-emerald-300/80 text-xs uppercase">Certificate ID</div>
                  <div className="font-mono">{String(data.CertificateId)}</div>
                </div>
                <div>
                  <div className="text-emerald-300/80 text-xs uppercase">Year</div>
                  <div>{String(data.CertificateYear)}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-emerald-300/80 text-xs uppercase">Metadata URI</div>
                  {String(data.Uri)?.startsWith("http") || String(data.Uri)?.startsWith("ipfs") ? (
                    <a
                      className="underline text-cyan-200 break-all"
                      href={String(data.Uri)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {String(data.Uri)}
                    </a>
                  ) : (
                    <div className="break-all">{String(data.Uri)}</div>
                  )}
                </div>
                <div>
                  <div className="text-emerald-300/80 text-xs uppercase">Merkle Root</div>
                  <div className="font-mono break-all">{String(data.MerkleRoot)}</div>
                </div>
                <div>
                  <div className="text-emerald-300/80 text-xs uppercase">Token Quantity</div>
                  <div>{String(data.CertificateTokenQuantity)}</div>
                </div>
              </div>
              <p className="mt-3 text-emerald-200/80 text-xs">
                This data is returned from the certificate clone via the factory’s{" "}
                <code className="text-emerald-100">expandCertificateDetails</code>.
              </p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-6">
          <Link
            href="/"
            className="rounded-lg bg-[#1f3aaa] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2a47a1]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
