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
      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex items-center space-x-3 px-4 py-2 neubrutal-bg-lime neubrutal-border neubrutal-shadow-light">
          <div className="w-3 h-3 bg-black rounded-full"></div>
          <span className="text-black font-bold text-sm">✅ CONNECTED</span>
        </div>
        <div className="flex items-center space-x-3 px-4 py-2 neubrutal-card">
          <div className="w-8 h-8 neubrutal-bg-yellow neubrutal-border flex items-center justify-center">
            <Wallet className="w-4 h-4 text-black" />
          </div>
          <span className="text-lg font-mono text-black font-bold">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
          <button 
            onClick={() => disconnect()} 
            className="neubrutal-button-secondary text-xs flex items-center"
          >
            <LogOut className="w-3 h-3 mr-1" />
            DISCONNECT
          </button>
        </div>
      </div>
    );
  }

  return (
    <button 
      onClick={handleConnect} 
      disabled={isPending}
      className="neubrutal-button text-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? (
        <div className="flex items-center">
          <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full mr-2"></div>
          CONNECTING...
        </div>
      ) : (
        'CONNECT WALLET'
      )}
    </button>
  );
}
