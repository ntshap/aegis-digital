'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { metaMask } from 'wagmi/connectors';
import { useEffect, useState } from 'react';

export function ConnectWalletButton() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Early return with placeholder during SSR
  if (!isMounted) {
    return (
      <button className="btn-secondary text-sm px-4 py-1.5 opacity-50">
        Connect Wallet
      </button>
    );
  }

  // Now safe to use wagmi hooks
  return <ConnectWalletButtonContent />;
}

function ConnectWalletButtonContent() {
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    connect({ connector: metaMask() });
  };

  if (isConnected) {
    return (
      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex items-center space-x-3 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-lg">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-300 font-bold text-sm">✅ Connected</span>
        </div>
        <div className="flex items-center space-x-3 px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">👛</span>
          </div>
          <span className="text-lg font-mono text-white font-semibold">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
          <button 
            onClick={() => disconnect()} 
            className="text-sm text-red-400 hover:text-red-300 font-bold px-3 py-1 rounded-lg hover:bg-red-500/20 transition-all duration-300"
          >
            ❌ Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <button 
      onClick={handleConnect} 
      disabled={isPending}
      className="btn-secondary text-sm px-4 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? (
        <div className="flex items-center">
          <div className="animate-spin w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full mr-2"></div>
          Connecting...
        </div>
      ) : (
        'Connect Wallet'
      )}
    </button>
  );
}
