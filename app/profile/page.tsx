"use client"
import { useEffect, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type Eip1193Provider, BrowserProvider, Contract, Interface } from "ethers"
import Link from "next/link"

// Factory contract details
const FACTORY_ADDRESS = "0x777B46e1117Fb2a0ed27e39901BaA91726A1a2b7" as const

const FACTORY_ABI = [
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

// Certificate contract ABI for getClaimed function
const CERTIFICATE_ABI = [
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getClaimed",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "string", name: "certificateName", type: "string" },
          { internalType: "string", name: "institutionName", type: "string" },
          { internalType: "uint256", name: "year", type: "uint256" },
          { internalType: "string", name: "uri", type: "string" },
        ],
        internalType: "struct ClaimedCertificate[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const

type IssuedCertificate = {
  address: string
  institutionName: string
  certificateName: string
  year: number
  blockNumber: number
  transactionHash: string
}

type ClaimedCertificate = {
  tokenId: number
  certificateName: string
  institutionName: string
  year: number
  uri: string
  contractAddress: string
}

type ProfileData = {
  name: string
  institution: string
  bio: string
  email: string
  website: string
  verified: boolean
}

declare global {
  interface Window {
    ethereum?: Eip1193Provider
  }
}

export default function ProfilePage() {
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [loading, setLoading] = useState(false)

  // Certificate data
  const [issuedCertificates, setIssuedCertificates] = useState<IssuedCertificate[]>([])
  const [claimedCertificates, setClaimedCertificates] = useState<ClaimedCertificate[]>([])

  // Profile data (in real app, this would come from a database)
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    institution: "",
    bio: "",
    email: "",
    website: "",
    verified: false,
  })
  const [editingProfile, setEditingProfile] = useState(false)

  const hasProvider = typeof window !== "undefined" && !!window.ethereum

  const shortAddress = useMemo(() => {
    if (!account) return ""
    return account.slice(0, 6) + "..." + account.slice(-4)
  }, [account])

  // Wallet connection logic
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
        setIssuedCertificates([])
        setClaimedCertificates([])
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

  // Load certificates when account changes
  useEffect(() => {
    if (account) {
      loadCertificates()
    }
  }, [account])

  async function connectWallet() {
    if (!hasProvider) return
    setConnecting(true)
    try {
      const eth = window.ethereum!
      const accounts = (await eth.request?.({ method: "eth_requestAccounts" })) as string[]
      if (!accounts || accounts.length === 0) throw new Error("No account connected")
      setAccount(accounts[0])
      const cid = (await eth.request?.({ method: "eth_chainId" })) as string
      setChainId(cid)
    } catch (err: any) {
      console.error("Failed to connect wallet:", err)
    } finally {
      setConnecting(false)
    }
  }

  async function loadCertificates() {
    if (!account || !hasProvider) return
    setLoading(true)
    try {
      const provider = new BrowserProvider(window.ethereum!)

      // Load issued certificates from CertificateDeployed events
      await loadIssuedCertificates(provider)

      // Load claimed certificates (this would require knowing which certificate contracts to query)
      // For now, we'll leave this as a placeholder since we need the certificate addresses
      await loadClaimedCertificates(provider)
    } catch (err: any) {
      console.error("Failed to load certificates:", err)
    } finally {
      setLoading(false)
    }
  }

  async function loadIssuedCertificates(provider: BrowserProvider) {
    try {
      const contract = new Contract(FACTORY_ADDRESS, FACTORY_ABI as any, provider)
      const iface = new Interface(FACTORY_ABI as any)

      // Query CertificateDeployed events filtered by institutionAddress
      const filter = contract.filters.CertificateDeployed(null, account)
      const events = await contract.queryFilter(filter, 0, "latest")

      const issued: IssuedCertificate[] = events.map((event) => {
        const parsed = iface.parseLog(event)
        return {
          address: String(parsed?.args?.certificateAddress || ""),
          institutionName: String(parsed?.args?.institutionName || ""),
          certificateName: String(parsed?.args?.certificateName || ""),
          year: Number(parsed?.args?.year || 0),
          blockNumber: event.blockNumber,
          transactionHash: event.transactionHash,
        }
      })

      setIssuedCertificates(issued)
    } catch (err) {
      console.error("Failed to load issued certificates:", err)
    }
  }

  async function loadClaimedCertificates(provider: BrowserProvider) {
    try {
      // Get all certificate addresses from issued certificates
      // In a real app, you'd want to query all CertificateDeployed events, not just user's issued ones
      const allCertificateAddresses = issuedCertificates.map((cert) => cert.address)

      const claimed: ClaimedCertificate[] = []

      for (const certAddress of allCertificateAddresses) {
        try {
          const certContract = new Contract(certAddress, CERTIFICATE_ABI as any, provider)
          const claimedData = await certContract.getClaimed(account)

          // Convert the returned data to our ClaimedCertificate type
          for (const claim of claimedData) {
            claimed.push({
              tokenId: Number(claim.tokenId),
              certificateName: String(claim.certificateName),
              institutionName: String(claim.institutionName),
              year: Number(claim.year),
              uri: String(claim.uri),
              contractAddress: certAddress,
            })
          }
        } catch (err) {
          // Skip contracts that don't have getClaimed or fail
          console.warn(`Failed to query certificate ${certAddress}:`, err)
        }
      }

      setClaimedCertificates(claimed)
    } catch (err) {
      console.error("Failed to load claimed certificates:", err)
    }
  }

  function updateProfile<K extends keyof ProfileData>(key: K, value: ProfileData[K]) {
    setProfileData((prev) => ({ ...prev, [key]: value }))
  }

  function saveProfile() {
    // In a real app, this would save to a database
    setEditingProfile(false)
    // TODO: Implement database save
  }

  const explorerAddrBase =
    chainId && chainId.toLowerCase() === "0x89" ? "https://polygonscan.com/address/" : "https://etherscan.io/address/"

  if (!account) {
    return (
      <main className="relative min-h-[80vh] bg-gradient-to-br from-[#f8fbff] via-white to-[#eef3ff] text-slate-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-6">User Profile</h1>
            <p className="text-slate-600 mb-8">Connect your wallet to view your certificate profile</p>
            <Button
              onClick={connectWallet}
              disabled={connecting}
              className="bg-[#1f3aaa] hover:bg-[#2a47a1] text-white"
            >
              {connecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-[80vh] bg-gradient-to-br from-[#f8fbff] via-white to-[#eef3ff] text-slate-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-slate-600 mt-1">Connected: {shortAddress}</p>
          </div>
          <Button onClick={connectWallet} className="bg-[#1f3aaa] hover:bg-[#2a47a1] text-white">
            {shortAddress}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Profile Information</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => (editingProfile ? saveProfile() : setEditingProfile(true))}
              >
                {editingProfile ? "Save" : "Edit"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                {editingProfile ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => updateProfile("name", e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                ) : (
                  <p className="text-slate-900">{profileData.name || "Not set"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Institution</label>
                {editingProfile ? (
                  <input
                    type="text"
                    value={profileData.institution}
                    onChange={(e) => updateProfile("institution", e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                ) : (
                  <p className="text-slate-900">{profileData.institution || "Not set"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                {editingProfile ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => updateProfile("bio", e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm min-h-[80px]"
                  />
                ) : (
                  <p className="text-slate-900">{profileData.bio || "Not set"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                {editingProfile ? (
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => updateProfile("email", e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                ) : (
                  <p className="text-slate-900">{profileData.email || "Not set"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
                {editingProfile ? (
                  <input
                    type="url"
                    value={profileData.website}
                    onChange={(e) => updateProfile("website", e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                ) : (
                  <p className="text-slate-900">
                    {profileData.website ? (
                      <Link href={profileData.website} target="_blank" className="text-blue-600 hover:underline">
                        {profileData.website}
                      </Link>
                    ) : (
                      "Not set"
                    )}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${profileData.verified ? "bg-green-500" : "bg-gray-300"}`} />
                <span className="text-sm text-slate-600">
                  {profileData.verified ? "Verified Institution" : "Unverified"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Certificates */}
          <div className="lg:col-span-2 space-y-6">
            {/* Issued Certificates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Issued Certificates
                  <span className="text-sm font-normal text-slate-500">{issuedCertificates.length} total</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-slate-500">Loading certificates...</p>
                ) : issuedCertificates.length === 0 ? (
                  <p className="text-slate-500">No certificates issued yet.</p>
                ) : (
                  <div className="space-y-3">
                    {issuedCertificates.map((cert, index) => (
                      <div key={index} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-slate-900">{cert.certificateName}</h4>
                            <p className="text-sm text-slate-600">
                              {cert.institutionName} • {cert.year}
                            </p>
                            <Link
                              href={`${explorerAddrBase}${cert.address}`}
                              target="_blank"
                              className="text-xs text-blue-600 hover:underline font-mono"
                            >
                              {cert.address}
                            </Link>
                          </div>
                          <span className="text-xs text-slate-500">Block #{cert.blockNumber}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Claimed Certificates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Claimed Certificates
                  <span className="text-sm font-normal text-slate-500">{claimedCertificates.length} total</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-slate-500">Loading certificates...</p>
                ) : claimedCertificates.length === 0 ? (
                  <p className="text-slate-500">No certificates claimed yet.</p>
                ) : (
                  <div className="space-y-3">
                    {claimedCertificates.map((cert, index) => (
                      <div key={index} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-slate-900">{cert.certificateName}</h4>
                            <p className="text-sm text-slate-600">
                              {cert.institutionName} • {cert.year}
                            </p>
                            <p className="text-xs text-slate-500">Token ID: {cert.tokenId}</p>
                            {cert.uri && (
                              <Link href={cert.uri} target="_blank" className="text-xs text-blue-600 hover:underline">
                                View Metadata
                              </Link>
                            )}
                          </div>
                          <Link
                            href={`${explorerAddrBase}${cert.contractAddress}`}
                            target="_blank"
                            className="text-xs text-blue-600 hover:underline font-mono"
                          >
                            Contract
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
