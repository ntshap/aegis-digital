import React from 'react';
import { useAccount, useChainId, usePublicClient } from 'wagmi';
import { CONTRACT_ADDRESSES } from '../config/contracts';

interface NetworkStatusProps {
  className?: string;
}

export function NetworkStatus({ className = '' }: NetworkStatusProps) {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  
  const [contractStatus, setContractStatus] = React.useState<'checking' | 'success' | 'error'>('checking');
  
  React.useEffect(() => {
    if (!publicClient || !isConnected) {
      setContractStatus('checking');
      return;
    }
    
    // Test contract accessibility
    publicClient.readContract({
      address: CONTRACT_ADDRESSES.FILE_REGISTRY,
      abi: [{ "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }],
      functionName: 'owner'
    }).then(() => {
      setContractStatus('success');
    }).catch((error) => {
      console.error('Contract check failed:', error);
      setContractStatus('error');
    });
  }, [publicClient, isConnected]);
  
  const isCorrectNetwork = chainId === 4202;
  
  if (!isConnected) {
    return (
      <div className={`p-3 bg-yellow-50 border border-yellow-200 rounded-lg ${className}`}>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
          <span className="text-sm text-yellow-800">Wallet not connected</span>
        </div>
      </div>
    );
  }
  
  if (!isCorrectNetwork) {
    return (
      <div className={`p-3 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
          <span className="text-sm text-red-800">
            Wrong network. Please switch to Lisk Sepolia (Chain ID: 4202)
          </span>
        </div>
      </div>
    );
  }
  
  if (contractStatus === 'error') {
    return (
      <div className={`p-3 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
          <span className="text-sm text-red-800">
            Contract not accessible. Please check your connection.
          </span>
        </div>
      </div>
    );
  }
  
  if (contractStatus === 'checking') {
    return (
      <div className={`p-3 bg-blue-50 border border-blue-200 rounded-lg ${className}`}>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
          <span className="text-sm text-blue-800">Checking connection...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`p-3 bg-green-50 border border-green-200 rounded-lg ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm text-green-800">Connected to Lisk Sepolia</span>
        </div>
        <span className="text-xs text-green-600 font-mono">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
      </div>
    </div>
  );
}
