'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { defineChain } from 'viem';
import { metaMask, injected } from 'wagmi/connectors';

// Definisi jaringan Lisk Sepolia dengan multiple RPC endpoints untuk redundancy
const liskSepolia = defineChain({
  id: 4202,
  name: 'Lisk Sepolia Testnet',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { 
      http: [
        'https://rpc.sepolia-api.lisk.com',
        'https://sepolia-rpc.lisk.com'
      ] 
    },
    public: { 
      http: [
        'https://rpc.sepolia-api.lisk.com',
        'https://sepolia-rpc.lisk.com'
      ] 
    },
  },
  blockExplorers: {
    default: { name: 'Lisk Sepolia Blockscout', url: 'https://sepolia-blockscout.lisk.com' },
  },
  testnet: true,
});

// Buat konfigurasi Wagmi dengan connectors dan improved transport
const config = createConfig({
  chains: [liskSepolia],
  connectors: [
    metaMask({
      dappMetadata: {
        name: 'Aegis Digital',
        url: 'https://aegis-digital.com',
      },
    }),
    injected({ 
      target: 'metaMask',
    }),
  ],
  transports: {
    [liskSepolia.id]: http(undefined, {
      batch: true,
      retryCount: 3,
      retryDelay: 1000,
      timeout: 10000,
    }),
  },
  ssr: false, // Disable SSR to avoid hydration issues
});

// Create a client for react-query with improved defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
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
