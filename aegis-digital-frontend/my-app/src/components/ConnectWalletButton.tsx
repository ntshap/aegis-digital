'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { metaMask } from 'wagmi/connectors';
import { useEffect, useState } from 'react';
import { Wallet, LogOut } from 'lucide-react';

export function ConnectWalletButton() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Early return with placeholder during SSR
  if (!isMounted) {
    return (
      <button className="neubrutal-button text-sm opacity-50">
        CONNECT WALLET
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
      <div className="flex items-center space-x-2">
        {/* Wallet Address Display - Compact */}
        <div className="flex items-center space-x-2 px-2 py-1.5 neubrutal-card">
          <div className="w-6 h-6 neubrutal-bg-yellow neubrutal-border flex items-center justify-center">
            <Wallet className="w-3 h-3 text-black" />
          </div>
          <span className="wallet-address text-xs font-mono text-black font-bold whitespace-nowrap">
            {address?.slice(0, 4)}...{address?.slice(-4)}
          </span>
          <button 
            onClick={() => disconnect()} 
            className="neubrutal-button-secondary text-xs flex items-center px-1.5 py-1"
            title="Disconnect"
          >
            <LogOut className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button 
      onClick={handleConnect} 
      disabled={isPending}
      className="neubrutal-button text-xs disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5"
    >
      {isPending ? (
        <div className="flex items-center">
          <div className="animate-spin w-3 h-3 border-2 border-black border-t-transparent rounded-full mr-1"></div>
          CONNECTING...
        </div>
      ) : (
        'CONNECT WALLET'
      )}
    </button>
  );
}
