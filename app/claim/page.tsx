"use client"

import type React from "react"

import { useState } from "react"
import { Poppins, Inter } from "next/font/google"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Upload, FileText, Wallet, CheckCircle, AlertCircle } from "lucide-react"
import BackgroundOrbs from "@/components/background-orbs"
import FloatingIcons from "@/components/floating-icons"
import HeaderBrand from "@/components/header-brand"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-poppins",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

interface ProofData {
  root: string
  proofs: Record<string, string[]>
  addresses: string[]
}

export default function ClaimCertificate() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [proofsFile, setProofsFile] = useState<ProofData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState("")

  const [form, setForm] = useState({
    recipientName: "",
    institutionName: "",
    certificateName: "",
    year: "",
    certificateId: "",
    recipientId: "",
  })

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        setIsLoading(true)
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        setWalletAddress(accounts[0])
        setIsConnected(true)
        setStatus("Wallet connected successfully")
      } catch (error) {
        setStatus("Failed to connect wallet")
      } finally {
        setIsLoading(false)
      }
    } else {
      setStatus("Please install MetaMask")
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          setProofsFile(data)
          setStatus("Proofs file loaded successfully")
        } catch (error) {
          setStatus("Invalid proofs file format")
        }
      }
      reader.readAsText(file)
    }
  }

  const handleClaim = async () => {
    if (!isConnected || !proofsFile || !walletAddress) {
      setStatus("Please connect wallet and upload proofs file")
      return
    }

    const userProof = proofsFile.proofs[walletAddress.toLowerCase()]
    if (!userProof) {
      setStatus("No proof found for your wallet address")
      return
    }

    try {
      setIsLoading(true)
      setStatus("Claiming certificate...")

      // Smart contract interaction would go here
      // For now, simulate the process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setStatus("Certificate claimed successfully!")
    } catch (error) {
      setStatus("Failed to claim certificate")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main
      className={[
        poppins.variable,
        inter.variable,
        "relative min-h-screen bg-gradient-to-br from-[#f8fbff] via-white to-[#eef3ff] text-slate-900 antialiased",
      ].join(" ")}
    >
      <div className="absolute inset-0 opacity-25">
        <BackgroundOrbs />
      </div>
      <div className="absolute inset-0">
        <FloatingIcons intensity={0.5} interactive />
      </div>

      <header className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <HeaderBrand className="scale-110" />
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Claim Your Certificate</h1>
          <p className="text-lg text-slate-600">Upload your proofs file and claim your blockchain certificate</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Wallet Connection */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <Wallet className="h-5 w-5 text-[#1f3aaa]" />
              <h2 className="text-xl font-semibold">Connect Wallet</h2>
            </div>

            {!isConnected ? (
              <Button onClick={connectWallet} disabled={isLoading} className="w-full bg-[#1f3aaa] hover:bg-[#2a47a1]">
                {isLoading ? "Connecting..." : "Connect Wallet"}
              </Button>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">
                  Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </div>
            )}
          </Card>

          {/* Proofs File Upload */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <Upload className="h-5 w-5 text-[#1f3aaa]" />
              <h2 className="text-xl font-semibold">Upload Proofs File</h2>
            </div>

            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="w-full p-2 border border-slate-300 rounded-md"
            />

            {proofsFile && (
              <div className="mt-2 flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Proofs file loaded ({proofsFile.addresses.length} addresses)</span>
              </div>
            )}
          </Card>
        </div>

        {/* Certificate Details Form */}
        <Card className="mt-8 p-6 bg-white/80 backdrop-blur-sm border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="h-5 w-5 text-[#1f3aaa]" />
            <h2 className="text-xl font-semibold">Certificate Details</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Recipient Name</label>
              <input
                type="text"
                value={form.recipientName}
                onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-md"
                placeholder="Enter recipient name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Institution Name</label>
              <input
                type="text"
                value={form.institutionName}
                onChange={(e) => setForm({ ...form, institutionName: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-md"
                placeholder="Enter institution name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Certificate Name</label>
              <input
                type="text"
                value={form.certificateName}
                onChange={(e) => setForm({ ...form, certificateName: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-md"
                placeholder="Enter certificate name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-md"
                placeholder="Enter year"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Certificate ID</label>
              <input
                type="text"
                value={form.certificateId}
                onChange={(e) => setForm({ ...form, certificateId: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-md"
                placeholder="Enter certificate ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Recipient ID</label>
              <input
                type="number"
                value={form.recipientId}
                onChange={(e) => setForm({ ...form, recipientId: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-md"
                placeholder="Enter recipient ID"
              />
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={handleClaim}
              disabled={!isConnected || !proofsFile || isLoading}
              className="w-full bg-[#1f3aaa] hover:bg-[#2a47a1] text-white py-3"
            >
              {isLoading ? "Claiming..." : "Claim Certificate"}
            </Button>
          </div>
        </Card>

        {/* Status Messages */}
        {status && (
          <Card className="mt-4 p-4 bg-white/80 backdrop-blur-sm border-slate-200">
            <div className="flex items-center gap-2">
              {status.includes("success") ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-600" />
              )}
              <span className="text-sm">{status}</span>
            </div>
          </Card>
        )}
      </div>
    </main>
  )
}
