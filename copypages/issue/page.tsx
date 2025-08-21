"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  type Eip1193Provider,
  BrowserProvider,
  Contract,
  Interface,
  isAddress,
  getAddress,
} from "ethers";

/* ----------------------------- Types & Defaults ---------------------------- */

type IssueForm = {
  institutionName: string;
  certificateName: string;
  certificateId: string;
  year: string;
  uri: string;
  quantity: string;
  recipients: string; // comma/space/newline separated
};

const DEFAULTS: IssueForm = {
  institutionName: "",
  certificateName: "",
  certificateId: "",
  year: "",
  uri: "",
  quantity: "",
  recipients: "",
};

type ProofsPayload = {
  root: string;
  count: number;
  addresses: string[];
  leaves: string[];
  proofs: Record<string, string[]>;
  params: { hash: string; sortedPairs: boolean };
} | null;

declare global {
  interface Window {
    ethereum?: Eip1193Provider & { on?: any; removeListener?: any };
  }
}

/* ------------------------------- Chain Config ------------------------------ */

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

/* --------------------------------- Contract -------------------------------- */

const FACTORY_ADDRESS = "0x7D2b480A5FB8287Ef9D13139f34E9D8Dfb26b146" as const;

// ABI (param order: verified wallet LAST)
const FACTORY_ABI = [
  {
    type: "function",
    stateMutability: "nonpayable",
    name: "createCertificate",
    inputs: [
      { name: "institutionName", type: "string" },
      { name: "certificateName", type: "string" },
      { name: "certificateId", type: "string" },
      { name: "uri", type: "string" },
      { name: "merkleRoot", type: "bytes32" },
      { name: "certificateYear", type: "uint256" },
      { name: "certificateTokenQuantity", type: "uint256" },
      { name: "verifiedWalletAddress", type: "address" },
    ],
    outputs: [{ name: "cloneAddress", type: "address" }],
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

const FN_NAME = "createCertificate" as const;
const iface = new Interface(FACTORY_ABI as any);

const EXPLORER_TX = "https://hyperion-testnet-explorer.metisdevops.link/tx/";
const EXPLORER_ADDR = "https://hyperion-testnet-explorer.metisdevops.link/address/";

/* ---------------------------------- Page ----------------------------------- */

export default function IssuePage() {
  const [form, setForm] = useState<IssueForm>(DEFAULTS);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [status, setStatus] = useState<
    | null
    | {
        type: "idle" | "error" | "pending" | "success" | "info";
        message: string;
        tx?: string;
        deployedAddress?: string;
      }
  >(null);

  // Merkle state
  const [generatedRoot, setGeneratedRoot] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [proofsCount, setProofsCount] = useState<number | null>(null);
  const [proofsData, setProofsData] = useState<ProofsPayload>(null);

  const hasProvider = typeof window !== "undefined" && !!window.ethereum;

  const shortAccount = useMemo(
    () => (account ? `${account.slice(0, 6)}…${account.slice(-4)}` : ""),
    [account]
  );

  const isCorrectNetwork =
    (chainId || "").toLowerCase() === REQUIRED_CHAIN_ID_HEX.toLowerCase();

  /* ---------------------------- Wallet & Network --------------------------- */

  useEffect(() => {
    if (!hasProvider) return;
    const eth = window.ethereum!;

    eth
      .request?.({ method: "eth_chainId" })
      .then((cid: any) => setChainId(String(cid)))
      .catch(() => {});

    const onAccountsChanged = (accounts: string[]) => setAccount(accounts?.[0] ?? null);
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
      setStatus({
        type: "error",
        message: "No wallet detected. Please install MetaMask or a compatible wallet.",
      });
      return;
    }
    setConnecting(true);
    try {
      const eth = window.ethereum!;
      const accounts = (await eth.request?.({
        method: "eth_requestAccounts",
      })) as string[];
      if (!accounts?.length) throw new Error("No account returned by wallet.");
      setAccount(accounts[0]);

      const cid = (await eth.request?.({ method: "eth_chainId" })) as string;
      setChainId(String(cid));
      setStatus({ type: "idle", message: "Wallet connected." });
    } catch (err: any) {
      setStatus({ type: "error", message: err?.message || "Failed to connect wallet." });
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
        } catch (addErr: any) {
          setStatus({
            type: "error",
            message:
              "Failed to add Hyperion Testnet. Please add Chain ID 133717 (tMETIS) to MetaMask.",
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

  /* ---------------------------- Helpers & Merkle --------------------------- */

  function update<K extends keyof IssueForm>(key: K, value: IssueForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (key === "recipients") {
      setGeneratedRoot(null);
      setProofsCount(null);
      setProofsData(null);
    }
  }

  function parseRecipients(input: string): string[] {
    const parts = input
      .split(/[,\n\r\s]+/g)
      .map((s) => s.trim())
      .filter(Boolean);

    if (!parts.length) throw new Error("Please enter at least one recipient address.");

    const checksummed: string[] = [];
    for (const p of parts) {
      if (!isAddress(p)) throw new Error(`Invalid address: ${p}`);
      checksummed.push(getAddress(p));
    }

    // Deduplicate preserving order
    const seen = new Set<string>();
    const unique: string[] = [];
    for (const a of checksummed) {
      if (!seen.has(a)) {
        seen.add(a);
        unique.push(a);
      }
    }
    return unique;
  }

  function triggerDownload(json: object) {
    const fname = `merkle-proofs-${Date.now()}.json`;
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fname;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function generateMerkle() {
    try {
      setGenerating(true);
      setStatus({ type: "info", message: "Generating Merkle root…" });

      const addresses = parseRecipients(form.recipients);

      const res = await fetch("/api/merkle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addresses }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Failed to generate Merkle data.");
      }
      const data: NonNullable<ProofsPayload> = await res.json();

      setGeneratedRoot(data.root);
      setProofsCount(data.count);
      setProofsData(data);

      // Try programmatic download; some browsers/extensions may block it.
      try {
        triggerDownload(data);
        setStatus({ type: "idle", message: "Merkle root generated. Proofs file downloaded." });
      } catch {
        setStatus({
          type: "info",
          message:
            "Merkle root generated. Click ‘Download proofs.json’ to save the file if it didn’t auto‑download.",
        });
      }
    } catch (err: any) {
      setGeneratedRoot(null);
      setProofsCount(null);
      setProofsData(null);
      setStatus({ type: "error", message: err?.message || "Merkle generation failed." });
    } finally {
      setGenerating(false);
    }
  }

  function validate(): string | null {
    if (!form.institutionName.trim()) return "Institution Name is required.";
    if (!form.certificateName.trim()) return "Certificate Name is required.";
    if (!form.certificateId.trim()) return "Certificate ID is required.";
    if (!form.uri.trim()) return "Certificate URI is required.";
    if (!account) return "Please connect your wallet first.";

    const y = Number(form.year.trim());
    if (!Number.isInteger(y)) return "Certificate Year must be a whole number.";
    if (y < 1900 || y > 3000) return "Certificate Year must be between 1900 and 3000.";

    const qtyStr = form.quantity.trim();
    if (!/^\d+$/.test(qtyStr)) return "Token Quantity must be a whole number.";
    if (BigInt(qtyStr) < 1n) return "Token Quantity must be at least 1.";

    try {
      parseRecipients(form.recipients);
    } catch (e: any) {
      return e?.message || "Invalid recipients.";
    }
    if (!generatedRoot) return "Please generate the Merkle root before submitting.";
    return null;
  }

  /* --------------------------------- Submit -------------------------------- */

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isCorrectNetwork) {
      setStatus({
        type: "error",
        message: `Please switch to ${NETWORK_LABELS[REQUIRED_CHAIN_ID_HEX]} before issuing.`,
      });
      return;
    }

    const v = validate();
    if (v) {
      setStatus({ type: "error", message: v });
      return;
    }

    try {
      setSubmitting(true);
      setStatus({ type: "pending", message: "Submitting transaction…" });

      const provider = new BrowserProvider(window.ethereum!);
      const signer = await provider.getSigner();
      const factory = new Contract(FACTORY_ADDRESS, FACTORY_ABI as any, signer);

      // Correct param order (verified wallet LAST)
      const tx = await factory[FN_NAME](
        form.institutionName.trim(),
        form.certificateName.trim(),
        form.certificateId.trim(),
        form.uri.trim(),
        generatedRoot as `0x${string}`,
        BigInt(form.year.trim()),
        BigInt(form.quantity.trim()),
        account as string
      );
      const receipt = await tx.wait();

      // Extract deployed address (if emitted)
      let deployedAddress: string | undefined;
      try {
        for (const log of receipt?.logs ?? []) {
          const parsed = iface.parseLog(log);
          if (parsed?.name === "CertificateDeployed") {
            deployedAddress = String(parsed.args?.certificateAddress);
            break;
          }
        }
      } catch {}

      setStatus({
        type: "success",
        message: deployedAddress
          ? "Certificate contract deployed successfully."
          : "Certificate creation confirmed.",
        tx: String(receipt?.hash || tx?.hash || ""),
        deployedAddress,
      });

      // Reset form/merkle
      setForm(DEFAULTS);
      setGeneratedRoot(null);
      setProofsCount(null);
      setProofsData(null);
    } catch (err: any) {
      const msg = err?.shortMessage || err?.reason || err?.message || "Transaction failed.";
      setStatus({ type: "error", message: msg });
    } finally {
      setSubmitting(false);
    }
  }

  /* ---------------------------------- UI ----------------------------------- */

  const manualDownloadVisible = !!proofsData;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0b0f1a] to-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            CERTHUB
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={connectWallet}
              disabled={connecting}
              className="rounded-lg bg-[#1f3aaa] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2a47a1] disabled:opacity-60"
              aria-live="polite"
            >
              {account ? `Connected: ${shortAccount}` : connecting ? "Connecting…" : "Connect Wallet"}
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
            {!isCorrectNetwork && (
              <p className="mt-2 text-xs text-orange-200">
                Please switch to {NETWORK_LABELS[REQUIRED_CHAIN_ID_HEX]} (symbol: tMETIS).
              </p>
            )}
          </div>
        )}

        {/* Status */}
        {status?.message && (
          <div
            className={[
              "mb-6 rounded-lg border px-4 py-3 text-sm",
              status.type === "error" && "border-red-400/40 bg-red-500/10 text-red-200",
              status.type === "success" && "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
              status.type === "pending" && "border-blue-400/40 bg-blue-500/10 text-blue-200",
              status.type === "idle" && "border-white/15 bg-white/5 text-white/90",
              status.type === "info" && "border-blue-400/40 bg-blue-500/10 text-blue-200",
            ]
              .filter(Boolean)
              .join(" ")}
            role="status"
          >
            <div className="flex flex-col gap-2">
              <span>{status.message}</span>
              <div className="flex flex-wrap items-center gap-3">
                {status.tx && (
                  <Link href={`${EXPLORER_TX}${status.tx}`} target="_blank" className="underline">
                    View Transaction
                  </Link>
                )}
                {status.deployedAddress && (
                  <Link
                    href={`${EXPLORER_ADDR}${status.deployedAddress}`}
                    target="_blank"
                    className="underline"
                  >
                    Deployed Contract
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-sm">
          <h1 className="mb-6 text-center text-2xl font-bold">Issue a Certificate</h1>

          <form className="grid grid-cols-1 gap-5 md:grid-cols-2" onSubmit={onSubmit}>
            <div className="md:col-span-2">
              <label className="text-sm text-white/70">Institution Name *</label>
              <input
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-cyan-400"
                value={form.institutionName}
                onChange={(e) => update("institutionName", e.target.value)}
                placeholder="e.g., University of Blockchain"
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
                value={form.year}
                onChange={(e) => update("year", e.target.value)}
                placeholder="2025"
                required
              />
            </div>

            <div>
              <label className="text-sm text-white/70">Token Quantity *</label>
              <input
                type="number"
                min={1}
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-cyan-400"
                value={form.quantity}
                onChange={(e) => update("quantity", e.target.value)}
                placeholder="100"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-white/70">Certificate URI *</label>
              <input
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-cyan-400"
                value={form.uri}
                onChange={(e) => update("uri", e.target.value)}
                placeholder="ipfs://... or https://example.com/metadata.json"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-white/70">
                Recipients (comma, spaces, or new lines)
              </label>
              <textarea
                className="mt-1 min-h-[110px] w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-cyan-400"
                value={form.recipients}
                onChange={(e) => update("recipients", e.target.value)}
                placeholder="0xabc..., 0xdef..., 0x123..."
                required
              />

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={generateMerkle}
                  disabled={generating || !form.recipients.trim()}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-60"
                >
                  {generating ? "Generating…" : "Generate Merkle Root & Download Proofs"}
                </button>

                {generatedRoot && (
                  <div className="flex flex-col gap-2">
                    <div className="break-all rounded-md border border-blue-400 bg-white/10 px-3 py-2 text-xs text-blue-100">
                      Root: <span className="font-mono">{generatedRoot}</span>
                      {typeof proofsCount === "number" ? ` • ${proofsCount} recipients` : ""}
                    </div>
                    {manualDownloadVisible && (
                      <button
                        type="button"
                        onClick={() => proofsData && triggerDownload(proofsData)}
                        className="self-start rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/15"
                      >
                        Download proofs.json
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setForm(DEFAULTS);
                  setGeneratedRoot(null);
                  setProofsCount(null);
                  setProofsData(null);
                }}
                disabled={submitting || generating}
                className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 disabled:opacity-60"
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={submitting || !account || !generatedRoot || !isCorrectNetwork}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Create Certificate"}
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
          <Link
            href="#contact"
            className="rounded-lg border border-white/20 bg-transparent px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10"
          >
            Contact
          </Link>
        </div>
      </div>
    </main>
  );
}
