'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { metaMask, injected } from 'wagmi/connectors';
import { defineChain } from 'viem';

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

// Buat konfigurasi Wagmi
const config = createConfig({
  chains: [liskSepolia],
  connectors: [
    metaMask(),
    injected(),
  ],
  transports: {
    [liskSepolia.id]: http(),
  },
});

// Create a client for react-query
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
