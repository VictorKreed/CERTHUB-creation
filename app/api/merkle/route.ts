import { NextResponse } from "next/server"
import { isAddress, getAddress } from "ethers"
import { keccak_256 } from "@noble/hashes/sha3"

// Helpers
function toBytes(hex: string): Uint8Array {
  const h = hex.startsWith("0x") ? hex.slice(2) : hex
  if (h.length % 2 !== 0) throw new Error("Invalid hex length")
  const bytes = new Uint8Array(h.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number.parseInt(h.slice(i * 2, i * 2 + 2), 16)
  }
  return bytes
}
function toHex(bytes: Uint8Array): string {
  return (
    "0x" +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  )
}
function concatBytes(a: Uint8Array, b: Uint8Array): Uint8Array {
  const out = new Uint8Array(a.length + b.length)
  out.set(a, 0)
  out.set(b, a.length)
  return out
}
// keccak256 helper that returns 0x-hex
function keccak(bytes: Uint8Array): string {
  return toHex(keccak_256(bytes))
}

// Build Merkle tree with sorted pairs (OpenZeppelin-compatible)
function buildMerkleTree(leaves: string[]): { layers: string[][]; root: string } {
  if (leaves.length === 0) {
    // keccak256(empty) for empty tree policy; adjust if you prefer 0x00..00 root
    const empty = keccak(new Uint8Array())
    return { layers: [[empty]], root: empty }
  }
  const layers: string[][] = []
  layers.push(leaves)

  while (layers[layers.length - 1].length > 1) {
    const prev = layers[layers.length - 1]
    const next: string[] = []
    for (let i = 0; i < prev.length; i += 2) {
      const a = prev[i]
      const b = i + 1 < prev.length ? prev[i + 1] : prev[i] // duplicate last if odd
      const [left, right] = a.toLowerCase() < b.toLowerCase() ? [a, b] : [b, a]
      const parent = keccak(concatBytes(toBytes(left), toBytes(right)))
      next.push(parent)
    }
    layers.push(next)
  }

  return { layers, root: layers[layers.length - 1][0] }
}

// Compute proof for a given leaf index from layers (sorted-pairs tree)
function getProofForIndex(layers: string[][], index: number): string[] {
  const proof: string[] = []
  for (let level = 0; level < layers.length - 1; level++) {
    const layer = layers[level]
    const isLast = index === layer.length - 1
    const hasPair = index % 2 === 0 ? index + 1 < layer.length : true
    const siblingIndex = index % 2 === 0 ? (hasPair ? index + 1 : index) : index - 1
    proof.push(layer[siblingIndex])
    index = Math.floor(index / 2)
  }
  return proof
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const input: unknown[] = Array.isArray(body?.addresses) ? body.addresses : []
    const sortPairs = body?.sortPairs !== false // default true

    if (input.length === 0) {
      return NextResponse.json({ error: "No addresses provided." }, { status: 400 })
    }

    // Normalize, validate, and dedupe (checksum-cased)
    const normalized: string[] = []
    for (const raw of input) {
      if (typeof raw !== "string") continue
      const trimmed = raw.trim()
      if (!trimmed) continue
      if (!isAddress(trimmed)) {
        return NextResponse.json({ error: `Invalid address: ${trimmed}` }, { status: 400 })
      }
      normalized.push(getAddress(trimmed))
    }
    const unique = Array.from(new Set(normalized))
    if (unique.length === 0) {
      return NextResponse.json({ error: "No valid addresses after normalization." }, { status: 400 })
    }

    // Leaves are keccak256(abi.encodePacked(address)), i.e., keccak(address bytes)
    const leaves = unique.map((addr) => {
      const addrBytes = toBytes(addr) // address 20 bytes
      return keccak(addrBytes)
    })

    const { layers, root } = buildMerkleTree(leaves)
    const proofs: Record<string, string[]> = {}

    // Map checksum address to its leaf index and proof
    // Important: leaf index must correspond to the leaf at the same position (after dedupe)
    const leafIndexByAddress = new Map<string, number>()
    unique.forEach((addr, i) => {
      leafIndexByAddress.set(addr, i)
    })

    unique.forEach((addr, i) => {
      const proof = getProofForIndex(layers, i)
      proofs[addr] = proof
    })

    return NextResponse.json(
      {
        root,
        count: unique.length,
        addresses: unique,
        leaves,
        proofs,
        params: {
          hash: "keccak256(address)",
          sortedPairs: !!sortPairs,
        },
      },
      { status: 200 },
    )
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to generate Merkle root." }, { status: 500 })
  }
}
