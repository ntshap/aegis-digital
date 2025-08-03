'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { defineChain } from 'viem';
import { metaMask, injected } from 'wagmi/connectors';

// Definisi jaringan Lisk Sepolia
const liskSepolia = defineChain({
  id: 4202,
  name: 'Lisk Sepolia Testnet',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.sepolia-api.lisk.com'] },
  },
  blockExplorers: {
    default: { name: 'Lisk Sepolia Blockscout', url: 'https://sepolia-blockscout.lisk.com' },
  },
  testnet: true,
});

// Buat konfigurasi Wagmi dengan connectors
const config = createConfig({
  chains: [liskSepolia],
  connectors: [
    metaMask(),
    injected(),
  ],
  transports: {
    [liskSepolia.id]: http(),
  },
  ssr: false, // Disable SSR to avoid hydration issues
});

// Create a client for react-query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
