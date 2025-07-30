'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { metaMask } from 'wagmi/connectors';

export function ConnectWalletButton() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    connect({ connector: metaMask() });
  };

  if (isConnected) {
    return (
      <div className="text-white">
        Terhubung ke {address?.slice(0, 6)}...{address?.slice(-4)}
        <button onClick={() => disconnect()} className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors">
          Putuskan Koneksi
        </button>
      </div>
    );
  }

  return (
    <button onClick={handleConnect} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
      Hubungkan Dompet
    </button>
  );
}    