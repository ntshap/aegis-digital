'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { metaMask } from 'wagmi/connectors';

export function ConnectWalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    connect({ connector: metaMask() });
  };

  if (isConnected) {
    return (
      <div className="flex items-center space-x-3">
        <div className="hidden sm:flex items-center space-x-2 text-xs px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-700 font-medium">Connected</span>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 rounded-lg">
          <span className="text-sm font-mono text-gray-700">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
          <button 
            onClick={() => disconnect()} 
            className="text-xs text-red-600 hover:text-red-700 font-medium"
          >
            Disconnect
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
