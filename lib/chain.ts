export const HYPERION_TESTNET = {
  id: 133717,
  name: "Metis Hyperion Testnet",
  nativeCurrency: { name: "Test Metis", symbol: "tMETIS", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://hyperion-testnet.metisdevops.link"] },
  },
  blockExplorers: {
    default: {
      name: "Hyperion Explorer",
      url: "https://hyperion-testnet-explorer.metisdevops.link",
    },
  },
  testnet: true,
} as const;

// 133717 -> hex
export const CHAIN_ID_HEX = "0x20a55";
