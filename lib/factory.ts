import { ethers } from "ethers";
import { FACTORY_ABI } from "./factoryAbi";

const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_ADDRESS || "0xC04b063F5Fd9F03B67359DE79d3b18a55f73cB0c";
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://hyperion-testnet.metisdevops.link";
const FACTORY_AGENTS = [
  process.env.ULTIMATE_FACTORY_AGENT || "0x85E12F2100554D46b498D887a83ABBf9C42fF951",
  process.env.FACTORY_AGENT_0 || "0x0842Ea79a34E7c5e74FfD173815923Dd8DF22C3d",
  process.env.FACTORY_AGENT_1 || "0xC9b68aaDaE81588a0DB2Ad24b6B0d06F2A086D96"
].map(addr => addr.toLowerCase());

export async function ensureHyperionNetwork() {
  if (typeof window.ethereum === "undefined") {
    throw new Error("Please install MetaMask");
  }
  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  if (chainId !== "0x20a55") {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x20a55" }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x20a55",
              chainName: "Hyperion Testnet",
              rpcUrls: [RPC_URL],
              nativeCurrency: { name: "Metis", symbol: "METIS", decimals: 18 },
              blockExplorerUrls: ["https://hyperion-explorer.metisdevops.link"],
            },
          ],
        });
      } else {
        throw switchError;
      }
    }
  }
}

export async function getConnectedAccount(): Promise<string | null> {
  if (typeof window.ethereum === "undefined") {
    return null;
  }
  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    return accounts[0] || null;
  } catch (e) {
    console.error("Failed to get connected account:", e);
    return null;
  }
}

export async function getReadFactory() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  return new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
}

export async function getWriteFactory() {
  if (typeof window.ethereum === "undefined") {
    throw new Error("Please install MetaMask");
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);
}

export async function isFactoryAgent(account: string): Promise<boolean> {
  if (!account || !ethers.isAddress(account)) {
    return false;
  }
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
    const isAgent = await contract.factory_agent(account);
    if (isAgent) {
      return true;
    }
    // Fallback to hardcoded agent addresses
    return FACTORY_AGENTS.includes(account.toLowerCase());
  } catch (e) {
    console.error("Failed to check factory agent status:", e);
    // Fallback to hardcoded agent addresses on error
    return FACTORY_AGENTS.includes(account.toLowerCase());
  }
}

export async function getRegisteredInstitutions(): Promise<{
  walletAddress: string;
  name: string;
  institutionType: string;
  industryOrSector: string;
  legalOrOperatingAddress: string;
  emailAddress: string;
  websiteUrlOrDomainName: string;
}[]> {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
    const filter = contract.filters.InstitutionRegistered();
    const events = await contract.queryFilter(filter, 0, "latest");
    return events.map((event: any) => ({
      name: event.args.institutionName,
      walletAddress: event.args.walletAddress1,
      institutionType: event.args.institutionType,
      industryOrSector: event.args.industryOrSector,
      legalOrOperatingAddress: event.args.legalOrOperatingAddress,
      emailAddress: event.args.emailAddress,
      websiteUrlOrDomainName: event.args.websiteUrlOrDomainName
    }));
  } catch (e) {
    console.error("Failed to fetch registered institutions:", e);
    return [];
  }
}