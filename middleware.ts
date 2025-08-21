import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { FACTORY_ABI } from "@/lib/factoryAbi";

const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_ADDRESS || "0xC04b063F5Fd9F03B67359DE79d3b18a55f73cB0c";
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://hyperion-testnet.metisdevops.link";
const FACTORY_AGENTS = [
  process.env.ULTIMATE_FACTORY_AGENT || "0x85E12F2100554D46b498D887a83ABBf9C42fF951",
  process.env.FACTORY_AGENT_0 || "0x0842Ea79a34E7c5e74FfD173815923Dd8DF22C3d",
  process.env.FACTORY_AGENT_1 || "0xC9b68aaDaE81588a0DB2Ad24b6B0d06F2A086D96"
].map(addr => addr.toLowerCase());

async function isFactoryAgent(account: string): Promise<boolean> {
  if (!account || !ethers.isAddress(account)) {
    console.log("Invalid address:", account);
    return false;
  }
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
    const isAgent = await contract.factory_agent(account);
    console.log(`Contract check for ${account}: ${isAgent}`);
    if (isAgent) {
      return true;
    }
    const isHardcodedAgent = FACTORY_AGENTS.includes(account.toLowerCase());
    console.log(`Hardcoded check for ${account}: ${isHardcodedAgent}`);
    return isHardcodedAgent;
  } catch (e) {
    console.error("Failed to check factory agent status:", e);
    const isHardcodedAgent = FACTORY_AGENTS.includes(account.toLowerCase());
    console.log(`Fallback hardcoded check for ${account}: ${isHardcodedAgent}`);
    return isHardcodedAgent;
  }
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;
  if (url.startsWith("/agent")) {
    const account = request.cookies.get("walletAddress")?.value || request.headers.get("x-wallet-address");
    if (!account) {
      console.log("No wallet address provided, redirecting to /");
      return NextResponse.redirect(new URL("/", request.url));
    }
    const isAgent = await isFactoryAgent(account);
    if (!isAgent) {
      console.log(`Unauthorized access attempt by ${account} to ${url}, redirecting to /`);
      return NextResponse.redirect(new URL("/", request.url));
    }
    console.log(`Authorized access by ${account} to ${url}`);
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/agent/:path*"],
};