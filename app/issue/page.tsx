"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type Eip1193Provider, BrowserProvider, Contract, Interface, isAddress, getAddress } from "ethers"

type IssueForm = {
  institutionName: string
  certificateName: string
  certificateId: string
  year: string
  uri: string
  quantity: string
  recipients: string // comma-separated wallet addresses
}

const DEFAULTS: IssueForm = {
  institutionName: "",
  certificateName: "",
  certificateId: "",
  year: "",
  uri: "",
  quantity: "",
  recipients: "",
}

// OFFICIAL FACTORY ADDRESS (provided by you)
const FACTORY_ADDRESS = "0x777B46e1117Fb2a0ed27e39901BaA91726A1a2b7" as const

// Real ABI (subset used here)
const FACTORY_ABI = [
  {
    inputs: [
      { internalType: "address", name: "verifiedWalletAddress", type: "address" },
      { internalType: "string", name: "institutionName", type: "string" },
      { internalType: "string", name: "certificateName", type: "string" },
      { internalType: "string", name: "certificateId", type: "string" },
      { internalType: "uint256", name: "certificateYear", type: "uint256" },
      { internalType: "string", name: "uri", type: "string" },
      { internalType: "bytes32", name: "merkleRoot", type: "bytes32" },
      { internalType: "uint256", name: "certificateTokenQuantity", type: "uint256" },
    ],
    name: "createCertificate",
    outputs: [{ internalType: "address", name: "cloneAddress", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "certificateAddress", type: "address" },
      { indexed: true, internalType: "address", name: "institutionAddress", type: "address" },
      { indexed: false, internalType: "string", name: "institutionName", type: "string" },
      { indexed: false, internalType: "string", name: "certificateName", type: "string" },
      { indexed: false, internalType: "uint256", name: "year", type: "uint256" },
    ],
    name: "CertificateDeployed",
    type: "event",
  },
] as const

const FN_NAME = "createCertificate" as const
const iface = new Interface(FACTORY_ABI as any)

declare global {
  interface Window {
    ethereum?: Eip1193Provider
  }
}

export default function IssuePage() {
  const [form, setForm] = useState<IssueForm>(DEFAULTS)
  const [status, setStatus] = useState<null | {
    type: "idle" | "error" | "pending" | "success" | "info"
    message: string
    tx?: string
    deployedAddress?: string
  }>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Merkle-related state
  const [generatedRoot, setGeneratedRoot] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [proofsCount, setProofsCount] = useState<number | null>(null)

  const hasProvider = typeof window !== "undefined" && !!window.ethereum

  const shortAddress = useMemo(() => {
    if (!account) return ""
    return account.slice(0, 6) + "..." + account.slice(-4)
  }, [account])

  useEffect(() => {
    if (!hasProvider) return
    const eth = window.ethereum!

    eth
      .request?.({ method: "eth_chainId" })
      .then((cid: any) => setChainId(cid as string))
      .catch(() => {})

    const onAccountsChanged = (accounts: any) => {
      if (Array.isArray(accounts) && accounts.length > 0) {
        setAccount(accounts[0])
      } else {
        setAccount(null)
      }
    }
    const onChainChanged = (cid: any) => {
      setChainId(String(cid))
    }
    eth.on?.("accountsChanged", onAccountsChanged as any)
    eth.on?.("chainChanged", onChainChanged as any)
    return () => {
      eth.removeListener?.("accountsChanged", onAccountsChanged as any)
      eth.removeListener?.("chainChanged", onChainChanged as any)
    }
  }, [hasProvider])

  async function connectWallet() {
    if (!hasProvider) {
      setStatus({ type: "error", message: "No wallet found. Please install MetaMask or a compatible wallet." })
      return
    }
    setConnecting(true)
    try {
      const eth = window.ethereum!
      const accounts = (await eth.request?.({ method: "eth_requestAccounts" })) as string[]
      if (!accounts || accounts.length === 0) throw new Error("No account connected")
      setAccount(accounts[0])
      const cid = (await eth.request?.({ method: "eth_chainId" })) as string
      setChainId(cid)
      setStatus({ type: "idle", message: "Wallet connected." })
    } catch (err: any) {
      setStatus({ type: "error", message: err?.message || "Failed to connect wallet." })
    } finally {
      setConnecting(false)
    }
  }

  function update<K extends keyof IssueForm>(key: K, value: IssueForm[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    // invalidate generated root if recipients or other inputs change materially
    if (key === "recipients") {
      setGeneratedRoot(null)
      setProofsCount(null)
    }
  }

  // Parse recipients string into array of checksum addresses; throw on invalid
  function parseRecipients(input: string): string[] {
    const parts = input
      .split(/[,\n\r\s]+/g)
      .map((x) => x.trim())
      .filter(Boolean)

    if (parts.length === 0) {
      throw new Error("Please enter at least one recipient address.")
    }

    const norm: string[] = []
    for (const p of parts) {
      if (!isAddress(p)) throw new Error(`Invalid address: ${p}`)
      norm.push(getAddress(p))
    }
    // Dedupe but preserve order
    const seen = new Set<string>()
    const unique: string[] = []
    for (const a of norm) {
      if (!seen.has(a)) {
        seen.add(a)
        unique.push(a)
      }
    }
    return unique
  }

  async function generateMerkle() {
    try {
      setGenerating(true)
      setStatus({
        type: "info",
        message: "Merkle root is being generated, proofs file will be downloaded.",
      })
      const addresses = parseRecipients(form.recipients)

      const res = await fetch("/api/merkle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addresses }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || "Failed to generate Merkle data.")
      }
      const data: {
        root: string
        count: number
        addresses: string[]
        leaves: string[]
        proofs: Record<string, string[]>
        params: { hash: string; sortedPairs: boolean }
      } = await res.json()

      setGeneratedRoot(data.root)
      setProofsCount(data.count)
      setStatus({ type: "idle", message: "Merkle root generated and proofs downloaded." })

      // Trigger download of proofs JSON
      const filename = `merkle-proofs-${Date.now()}.json`
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err: any) {
      setStatus({ type: "error", message: err?.message || "Failed to generate Merkle root." })
      setGeneratedRoot(null)
      setProofsCount(null)
    } finally {
      setGenerating(false)
    }
  }

  function validate(): string | null {
    if (!form.institutionName.trim()) return "Institution Name is required."
    if (!form.certificateName.trim()) return "Certificate Name is required."
    if (!form.certificateId.trim()) return "Certificate ID is required."
    if (!form.uri.trim()) return "Certificate URI is required."
    if (!account) return "Please connect your wallet first."

    const yearStr = form.year.trim()
    const qtyStr = form.quantity.trim()

    if (!/^\d+$/.test(yearStr)) return "Certificate Year must be a whole number."
    const y = Number(yearStr)
    if (y < 1900 || y > 3000) return "Certificate Year must be between 1900 and 3000."

    if (!/^\d+$/.test(qtyStr)) return "Token Quantity must be a whole number."
    if (BigInt(qtyStr) < 1n) return "Token Quantity must be at least 1."

    // Recipients validation (parsed) and root presence
    try {
      parseRecipients(form.recipients)
    } catch (e: any) {
      return e?.message || "Invalid recipients."
    }
    if (!generatedRoot) return "Please generate the Merkle root before creating the certificate."

    return null
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const v = validate()
    if (v) {
      setStatus({ type: "error", message: v })
      return
    }
    try {
      setSubmitting(true)
      setStatus({ type: "pending", message: "Submitting transaction..." })

      const provider = new BrowserProvider(window.ethereum!)
      const signer = await provider.getSigner()
      const contract = new Contract(FACTORY_ADDRESS, FACTORY_ABI as any, signer)

      const args = [
        account as string, // verifiedWalletAddress
        form.institutionName.trim(),
        form.certificateName.trim(),
        form.certificateId.trim(),
        BigInt(form.year.trim()), // uint256
        form.uri.trim(),
        generatedRoot as `0x${string}`, // bytes32 (from server)
        BigInt(form.quantity.trim()), // uint256
      ] as const

      const tx = await contract[FN_NAME](...(args as unknown as any[]))
      const receipt = await tx.wait()

      // Parse event for deployed address
      let deployedAddress: string | undefined
      try {
        for (const log of receipt?.logs || []) {
          const parsed = iface.parseLog(log)
          if (parsed?.name === "CertificateDeployed") {
            deployedAddress = String(parsed.args?.certificateAddress)
            break
          }
        }
      } catch {}

      setStatus({
        type: "success",
        message: deployedAddress
          ? "Certificate created and deployed successfully."
          : "Certificate creation transaction confirmed.",
        tx: String(receipt?.hash || tx?.hash || ""),
        deployedAddress,
      })
      setForm(DEFAULTS)
      setGeneratedRoot(null)
      setProofsCount(null)
    } catch (err: any) {
      const message = err?.shortMessage || err?.reason || err?.message || "Transaction failed."
      setStatus({ type: "error", message })
    } finally {
      setSubmitting(false)
    }
  }

  // Explorer bases
  const explorerTxBase =
    chainId && chainId.toLowerCase() === "0x89" ? "https://polygonscan.com/tx/" : "https://etherscan.io/tx/"
  const explorerAddrBase =
    chainId && chainId.toLowerCase() === "0x89" ? "https://polygonscan.com/address/" : "https://etherscan.io/address/"

  return (
    <main className="relative min-h-[80vh] bg-gradient-to-br from-[#f8fbff] via-white to-[#eef3ff] text-slate-900">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold">Issue a Certificate</h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={connectWallet}
              disabled={connecting}
              className="bg-[#1f3aaa] hover:bg-[#2a47a1] text-white"
              aria-live="polite"
            >
              {account ? `Connected: ${shortAddress}` : connecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          </div>
        </div>

        {status?.message && (
          <div
            className={[
              "mt-4 rounded-lg border px-4 py-3 text-sm",
              status.type === "error" && "border-red-200 bg-red-50 text-red-700",
              status.type === "success" && "border-emerald-200 bg-emerald-50 text-emerald-700",
              status.type === "pending" && "border-blue-200 bg-blue-50 text-blue-700",
              status.type === "idle" && "border-slate-200 bg-white text-slate-700",
              status.type === "info" && "border-blue-200 bg-blue-50 text-blue-700",
            ]
              .filter(Boolean)
              .join(" ")}
            role="status"
          >
            <div className="flex flex-col gap-2">
              <span>{status.message}</span>
              <div className="flex flex-wrap items-center gap-3">
                {status.tx && (
                  <Link href={`${explorerTxBase}${status.tx}`} target="_blank" className="underline text-blue-700">
                    View Transaction
                  </Link>
                )}
                {status.deployedAddress && (
                  <Link
                    href={`${explorerAddrBase}${status.deployedAddress}`}
                    target="_blank"
                    className="underline text-blue-700"
                  >
                    Deployed Contract
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        <Card className="mt-6 border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Certificate Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-5" onSubmit={onSubmit}>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Institution Name</label>
                <input
                  type="text"
                  value={form.institutionName}
                  onChange={(e) => update("institutionName", e.target.value)}
                  placeholder="e.g., University of Blockchain"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2a47a1]/30"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Certificate Name</label>
                <input
                  type="text"
                  value={form.certificateName}
                  onChange={(e) => update("certificateName", e.target.value)}
                  placeholder="e.g., Advanced Solidity"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2a47a1]/30"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Certificate ID</label>
                <input
                  type="text"
                  value={form.certificateId}
                  onChange={(e) => update("certificateId", e.target.value)}
                  placeholder="e.g., CERT-2025-0001"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2a47a1]/30"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Certificate Year</label>
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) => update("year", e.target.value)}
                  placeholder="e.g., 2025"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2a47a1]/30"
                  required
                  min={1900}
                  max={3000}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Certificate URI</label>
                <input
                  type="text"
                  value={form.uri}
                  onChange={(e) => update("uri", e.target.value)}
                  placeholder="e.g., ipfs://Qm... or https://example.com/metadata.json"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2a47a1]/30"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Token Quantity</label>
                <input
                  type="number"
                  value={form.quantity}
                  onChange={(e) => update("quantity", e.target.value)}
                  placeholder="e.g., 100"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2a47a1]/30"
                  required
                  min={1}
                />
              </div>

              {/* New Recipients input */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">
                  Recipients (comma-separated addresses)
                </label>
                <textarea
                  value={form.recipients}
                  onChange={(e) => update("recipients", e.target.value)}
                  placeholder="0xabc..., 0xdef..., 0x123... (you can also separate by spaces or new lines)"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2a47a1]/30 min-h-[110px]"
                  required
                />
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    onClick={generateMerkle}
                    disabled={generating || !form.recipients.trim()}
                    className="bg-[#1f3aaa] hover:bg-[#2a47a1] text-white"
                  >
                    {generating ? "Generating..." : "Generate Merkle Root & Download Proofs"}
                  </Button>

                  {generatedRoot && (
                    <div className="text-xs sm:text-sm text-slate-600 break-all">
                      Generated root: <span className="font-mono">{generatedRoot}</span>{" "}
                      {typeof proofsCount === "number" ? `• ${proofsCount} recipients` : null}
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-slate-300 text-slate-800 hover:bg-slate-100 bg-transparent"
                  onClick={() => {
                    setForm(DEFAULTS)
                    setGeneratedRoot(null)
                    setProofsCount(null)
                  }}
                  disabled={submitting || generating}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  className="bg-[#1f3aaa] hover:bg-[#2a47a1] text-white"
                  disabled={submitting || !account || !generatedRoot}
                >
                  {submitting ? "Submitting..." : "Create Certificate"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 flex gap-3">
          <Button asChild className="bg-[#1f3aaa] hover:bg-[#2a47a1] text-white">
            <Link href="/">Back to Home</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-slate-300 text-slate-800 hover:bg-slate-100 bg-transparent"
          >
            <Link href="#contact">Contact</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
