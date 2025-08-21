"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  type Eip1193Provider,
  BrowserProvider,
  Contract,
  isAddress,
  getAddress,
  Interface,
} from "ethers";

/* ----------------------------- Chain / Factory ----------------------------- */

const REQUIRED_CHAIN_ID_HEX = "0x20a55"; // 133717
const NETWORK_LABELS: Record<string, string> = {
  "0x20a55": "Hyperion Testnet (133717)",
};
const CUSTOM_NETWORK_CONFIG = {
  chainId: REQUIRED_CHAIN_ID_HEX,
  chainName: "Hyperion Testnet",
  nativeCurrency: { name: "tMETIS", symbol: "tMETIS", decimals: 18 },
  rpcUrls: ["https://hyperion-testnet.metisdevops.link"],
  blockExplorerUrls: ["https://hyperion-testnet-explorer.metisdevops.link"],
};

const FACTORY_ADDRESS = "0xC04b063F5Fd9F03B67359DE79d3b18a55f73cB0c" as const;

// minimal ABI for claim + optional verify
const FACTORY_ABI = [
  {
    type: "function",
    name: "claimCertificate",
    stateMutability: "nonpayable",
    inputs: [
      { name: "studentName", type: "string" },
      { name: "institutionName", type: "string" },
      { name: "certificateName", type: "string" },
      { name: "certificateId", type: "string" },
      { name: "proof", type: "bytes32[]" },
      { name: "recipientWalletAddress", type: "address" },
      { name: "studentId", type: "uint256" },
      { name: "certificateYear", type: "uint256" },
      { name: "institutionWalletAddress", type: "address" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "verifyCertificate",
    stateMutability: "view",
    inputs: [
      { name: "recipientAddress", type: "address" },
      { name: "certificateName", type: "string" },
      { name: "certificateYear", type: "uint256" },
      { name: "institutionWalletAddress", type: "address" },
    ],
    outputs: [
      {
        components: [
          { name: "RecipientName", type: "string" },
          { name: "CertificateName", type: "string" },
          { name: "CertificateYear", type: "uint256" },
          { name: "CertificateId", type: "string" },
          { name: "RecipientId", type: "uint256" },
          { name: "InstitutionName", type: "string" },
          { name: "Claimed", type: "bool" },
        ],
        type: "tuple",
      },
    ],
  },
  {
    type: "event",
    name: "CertificateDeployed",
    inputs: [
      { indexed: true, name: "certificateAddress", type: "address" },
      { indexed: true, name: "institutionAddress", type: "address" },
      { indexed: false, name: "institutionName", type: "string" },
      { indexed: false, name: "certificateName", type: "string" },
      { indexed: false, name: "year", type: "uint256" },
    ],
    anonymous: false,
  },
] as const;

const iface = new Interface(FACTORY_ABI as any);
const EXPLORER_TX = "https://hyperion-testnet-explorer.metisdevops.link/tx/";

/* --------------------------------- Types ---------------------------------- */

type ClaimForm = {
  studentName: string;
  studentId: string;
  recipientAddress: string;

  institutionName: string;
  institutionWalletAddress: string;

  certificateName: string;
  certificateId: string;
  certificateYear: string;

  // Proof handling
  proofText: string; // optional manual paste ("0x...,0x...,0x...")
};

type ProofsJSON = {
  root: string;
  count: number;
  addresses: string[];
  leaves: string[];
  proofs: Record<string, string[]>;
  params: { hash: string; sortedPairs: boolean };
};

const DEFAULTS: ClaimForm = {
  studentName: "",
  studentId: "",
  recipientAddress: "",
  institutionName: "",
  institutionWalletAddress: "",
  certificateName: "",
  certificateId: "",
  certificateYear: "",
  proofText: "",
};

declare global {
  interface Window {
    ethereum?: Eip1193Provider & { on?: any; removeListener?: any };
  }
}

/* ---------------------------------- Page ----------------------------------- */

export default function ClaimPage() {
  const [form, setForm] = useState<ClaimForm>(DEFAULTS);

  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [status, setStatus] = useState<
    | null
    | { type: "idle" | "error" | "pending" | "success"; message: string; tx?: string }
  >(null);

  const [proofsFile, setProofsFile] = useState<ProofsJSON | null>(null);
  const [derivedProof, setDerivedProof] = useState<string[] | null>(null); // from file + recipient
  const [fileError, setFileError] = useState<string | null>(null);

  const hasProvider = typeof window !== "undefined" && !!window.ethereum;
  const isCorrectNetwork = (chainId || "").toLowerCase() === REQUIRED_CHAIN_ID_HEX.toLowerCase();
  const shortAcc = useMemo(
    () => (account ? account.slice(0, 6) + "…" + account.slice(-4) : ""),
    [account]
  );

  /* ------------------------------ Wallet/Chain ----------------------------- */

  useEffect(() => {
    if (!hasProvider) return;
    const eth = window.ethereum!;
    eth.request?.({ method: "eth_chainId" })
      .then((cid: any) => setChainId(String(cid)))
      .catch(() => {});

    const onAccountsChanged = (accs: string[]) => setAccount(accs?.[0] ?? null);
    const onChainChanged = (cid: string) => setChainId(String(cid));
    eth.on?.("accountsChanged", onAccountsChanged);
    eth.on?.("chainChanged", onChainChanged);
    return () => {
      eth.removeListener?.("accountsChanged", onAccountsChanged);
      eth.removeListener?.("chainChanged", onChainChanged);
    };
  }, [hasProvider]);

  async function connectWallet() {
    if (!hasProvider) {
      setStatus({ type: "error", message: "No wallet detected. Install MetaMask or a compatible wallet." });
      return;
    }
    setConnecting(true);
    try {
      const eth = window.ethereum!;
      const accs = (await eth.request?.({ method: "eth_requestAccounts" })) as string[];
      if (!accs?.length) throw new Error("No account selected in wallet.");
      setAccount(accs[0]);
      const cid = (await eth.request?.({ method: "eth_chainId" })) as string;
      setChainId(String(cid));
      setStatus({ type: "idle", message: "Wallet connected." });
    } catch (e: any) {
      setStatus({ type: "error", message: e?.message || "Failed to connect wallet." });
    } finally {
      setConnecting(false);
    }
  }

  async function switchNetwork() {
    try {
      await window.ethereum?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: REQUIRED_CHAIN_ID_HEX }],
      });
    } catch (error: any) {
      if (error?.code === 4902 || /Unrecognized chain ID/i.test(error?.message || "")) {
        try {
          await window.ethereum?.request({
            method: "wallet_addEthereumChain",
            params: [CUSTOM_NETWORK_CONFIG],
          });
          await window.ethereum?.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: REQUIRED_CHAIN_ID_HEX }],
          });
        } catch {
          setStatus({
            type: "error",
            message: "Failed to add Hyperion Testnet. Please add Chain ID 133717 (tMETIS) to MetaMask.",
          });
        }
      } else {
        setStatus({
          type: "error",
          message: `Failed to switch network: ${error?.message || "Unknown error"}`,
        });
      }
    }
  }

  /* --------------------------------- Helpers -------------------------------- */

  function update<K extends keyof ClaimForm>(key: K, value: ClaimForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (key === "recipientAddress") {
      setDerivedProof(null);
    }
  }

  function normalizeAddr(input: string): string {
    if (!isAddress(input)) throw new Error(`Invalid address: ${input}`);
    return getAddress(input);
  }

  function parseManualProof(input: string): string[] {
    // Accept JSON array or comma-separated string
    try {
      const maybeJson = JSON.parse(input);
      if (Array.isArray(maybeJson)) {
        return maybeJson.map((x) => String(x));
      }
    } catch {
      /* not JSON -> fall through */
    }
    return input
      .split(/[,\s]+/g)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function getProofFromFile(addr: string): string[] | null {
    if (!proofsFile) return null;
    const checksum = normalizeAddr(addr);
    const p = proofsFile.proofs[checksum];
    return Array.isArray(p) ? p : null;
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError(null);
    setDerivedProof(null);
    setProofsFile(null);

    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const txt = await file.text();
      const json = JSON.parse(txt) as ProofsJSON;

      // basic sanity check
      if (!json?.root || !json?.proofs || typeof json.proofs !== "object") {
        throw new Error("Invalid proofs JSON format.");
      }
      setProofsFile(json);

      // if recipient already present, pre‑derive
      if (form.recipientAddress.trim()) {
        try {
          const proof = getProofFromFile(form.recipientAddress.trim());
          if (proof) setDerivedProof(proof);
        } catch (err: any) {
          setFileError(err?.message || "Failed to derive proof for the recipient.");
        }
      }
    } catch (err: any) {
      setFileError(err?.message || "Failed to read proofs file.");
    }
  }

  function formValidate(): string | null {
    try {
      if (!form.studentName.trim()) return "Student Name is required.";
      if (!/^\d+$/.test(form.studentId.trim())) return "Student ID must be a whole number.";
      if (!form.certificateName.trim()) return "Certificate Name is required.";
      if (!form.certificateId.trim()) return "Certificate ID is required.";
      if (!/^\d+$/.test(form.certificateYear.trim())) return "Year must be a whole number.";
      if (!form.institutionName.trim()) return "Institution Name is required.";

      normalizeAddr(form.recipientAddress.trim());
      normalizeAddr(form.institutionWalletAddress.trim());

      // proof exists: from file or manual
      let proof: string[] | null = null;
      if (derivedProof && derivedProof.length) {
        proof = derivedProof;
      } else if (form.proofText.trim()) {
        const arr = parseManualProof(form.proofText.trim());
        if (!arr.length) return "Proof array is empty.";
        proof = arr;
      } else {
        return "Please upload a proofs.json and/or paste a proof array.";
      }

      // all good
      return null;
    } catch (e: any) {
      return e?.message || "Invalid input.";
    }
  }

  function deriveProofNow() {
    try {
      setFileError(null);
      const p = getProofFromFile(form.recipientAddress.trim());
      if (!p || !p.length) {
        setDerivedProof(null);
        setFileError("No proof found in file for that recipient address.");
        return;
      }
      setDerivedProof(p);
    } catch (e: any) {
      setDerivedProof(null);
      setFileError(e?.message || "Failed to derive proof.");
    }
  }

  /* --------------------------------- Submit -------------------------------- */

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isCorrectNetwork) {
      setStatus({
        type: "error",
        message: `Please switch to ${NETWORK_LABELS[REQUIRED_CHAIN_ID_HEX]} before claiming.`,
      });
      return;
    }

    const err = formValidate();
    if (err) {
      setStatus({ type: "error", message: err });
      return;
    }

    try {
      setSubmitting(true);
      setStatus({ type: "pending", message: "Submitting claim transaction…" });

      const provider = new BrowserProvider(window.ethereum!);
      const signer = await provider.getSigner();
      const factory = new Contract(FACTORY_ADDRESS, FACTORY_ABI as any, signer);

      const proofArray =
        (derivedProof && derivedProof.length ? derivedProof : parseManualProof(form.proofText)).map(
          (x) => String(x)
        );

      const tx = await factory.claimCertificate(
        form.studentName.trim(),
        form.institutionName.trim(),
        form.certificateName.trim(),
        form.certificateId.trim(),
        proofArray as `0x${string}`[], // bytes32[]
        normalizeAddr(form.recipientAddress.trim()),
        BigInt(form.studentId.trim()),
        BigInt(form.certificateYear.trim()),
        normalizeAddr(form.institutionWalletAddress.trim())
      );

      const rcpt = await tx.wait();
      setStatus({
        type: "success",
        message: "Certificate claimed successfully.",
        tx: String(rcpt?.hash || tx?.hash || ""),
      });

      // clear only proof/paste, keep the rest
      setDerivedProof(null);
      setProofsFile(null);
      setFileError(null);
      setForm((f) => ({ ...f, proofText: "" }));
    } catch (e: any) {
      setStatus({ type: "error", message: e?.shortMessage || e?.reason || e?.message || "Failed to claim." });
    } finally {
      setSubmitting(false);
    }
  }

  /* ---------------------------------- UI ----------------------------------- */

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0b0f1a] to-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight">CERTHUB</Link>
          <div className="flex items-center gap-2">
            <button
              onClick={connectWallet}
              disabled={connecting}
              className="rounded-lg bg-[#1f3aaa] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2a47a1] disabled:opacity-60"
            >
              {account ? `Connected: ${shortAcc}` : connecting ? "Connecting…" : "Connect Wallet"}
            </button>
          </div>
        </header>

        {/* Network pill */}
        {account && (
          <div className="mb-6 rounded-lg border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span
                  className={`mr-2 inline-block h-2.5 w-2.5 rounded-full ${
                    isCorrectNetwork ? "bg-emerald-400" : "bg-red-400"
                  }`}
                />
                <span className="text-sm">
                  Network: {NETWORK_LABELS[chainId ?? ""] || `Unknown (${chainId})`}
                </span>
              </div>
              {!isCorrectNetwork && (
                <button
                  onClick={switchNetwork}
                  className="rounded-md bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-700"
                >
                  Switch to {NETWORK_LABELS[REQUIRED_CHAIN_ID_HEX]}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Status banner */}
        {status?.message && (
          <div
            className={[
              "mb-6 rounded-lg border px-4 py-3 text-sm",
              status.type === "error" && "border-red-400/40 bg-red-500/10 text-red-200",
              status.type === "success" && "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
              status.type === "pending" && "border-blue-400/40 bg-blue-500/10 text-blue-200",
              status.type === "idle" && "border-white/15 bg-white/5 text-white/90",
            ]
              .filter(Boolean)
              .join(" ")}
            role="status"
          >
            <div className="flex flex-col gap-2">
              <span>{status.message}</span>
              {status.tx && (
                <Link href={`${EXPLORER_TX}${status.tx}`} target="_blank" className="underline">
                  View Transaction
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-sm">
          <h1 className="mb-6 text-center text-2xl font-bold">Claim a Certificate</h1>

          <form className="grid grid-cols-1 gap-5" onSubmit={onSubmit}>
            {/* Recipient section */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm text-white/70">Recipient Wallet *</label>
                <input
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-cyan-400"
                  value={form.recipientAddress}
                  onChange={(e) => update("recipientAddress", e.target.value)}
                  placeholder="0x…"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-white/70">Student ID *</label>
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-cyan-400"
                  value={form.studentId}
                  onChange={(e) => update("studentId", e.target.value)}
                  placeholder="e.g., 123456"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-white/70">Student Name *</label>
                <input
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-cyan-400"
                  value={form.studentName}
                  onChange={(e) => update("studentName", e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            {/* Certificate / Institution */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm text-white/70">Institution Name *</label>
                <input
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-cyan-400"
                  value={form.institutionName}
                  onChange={(e) => update("institutionName", e.target.value)}
                  placeholder="e.g., Alpha University"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-white/70">Institution Wallet *</label>
                <input
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-cyan-400"
                  value={form.institutionWalletAddress}
                  onChange={(e) => update("institutionWalletAddress", e.target.value)}
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
                <label className="text-sm text-white/70">Certificate ID *</label>
                <input
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-cyan-400"
                  value={form.certificateId}
                  onChange={(e) => update("certificateId", e.target.value)}
                  placeholder="e.g., CERT-2025-0001"
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
            </div>

            {/* Proof upload / manual */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="mb-3 text-sm text-white/80">
                Upload the <code>merkle-proofs-*.json</code> you received or paste your proof array.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15">
                  <input type="file" accept="application/json" onChange={onFileChange} className="hidden" />
                  <span>Upload proofs.json</span>
                </label>

                <button
                  type="button"
                  onClick={deriveProofNow}
                  disabled={!proofsFile || !form.recipientAddress.trim()}
                  className="rounded-md border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15 disabled:opacity-60"
                >
                  Derive proof for recipient
                </button>

                {proofsFile && (
                  <span className="text-xs text-white/70">
                    Loaded {proofsFile.count} addresses • root {proofsFile.root.slice(0, 10)}…
                  </span>
                )}
              </div>

              {fileError && (
                <div className="mt-2 rounded-md border border-red-400/40 bg-red-500/10 p-2 text-xs text-red-200">
                  {fileError}
                </div>
              )}

              <div className="mt-3">
                <label className="text-xs text-white/70">
                  Or paste proof (comma‑separated or JSON array of 0x hashes)
                </label>
                <textarea
                  className="mt-1 min-h-[80px] w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-cyan-400"
                  value={form.proofText}
                  onChange={(e) => update("proofText", e.target.value)}
                  placeholder='["0xabc…","0xdef…"] or 0xabc…, 0xdef…'
                />
              </div>

              {derivedProof && (
                <div className="mt-3 rounded-md border border-emerald-400/40 bg-emerald-500/10 p-2 text-xs text-emerald-200 break-all">
                  Derived proof for {form.recipientAddress}: [{derivedProof.join(", ")}]
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setForm(DEFAULTS);
                  setProofsFile(null);
                  setDerivedProof(null);
                  setFileError(null);
                }}
                disabled={submitting}
                className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 disabled:opacity-60"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={submitting || !account || !isCorrectNetwork}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Claim Certificate"}
              </button>
            </div>
          </form>
        </div>

        {/* Footer actions */}
        <div className="mt-6 flex gap-3">
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
