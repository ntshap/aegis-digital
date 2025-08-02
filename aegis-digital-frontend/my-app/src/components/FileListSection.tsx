'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useSimulateContract, useWriteContract } from 'wagmi';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, DID_REGISTRY_ABI, ACCESS_CONTROL_ABI } from '../config/contracts';

interface File {
  cid: string;
  ownerDID: string;
  timestamp: string;
}

export function FileListSection() {
  const { address, isConnected } = useAccount();
  const [status, setStatus] = useState('');
  const [fileCIDToRevoke, setFileCIDToRevoke] = useState('');
  const [recipientDIDToRevoke, setRecipientDIDToRevoke] = useState('');

  const { data: userDIDData } = useReadContract({
    address: CONTRACT_ADDRESSES.DID_REGISTRY,
    abi: DID_REGISTRY_ABI,
    functionName: 'getDID',
    args: [address as `0x${string}`],
    query: {
      enabled: isConnected && !!address,
    },
  });

  const userDID = userDIDData ? ethers.decodeBytes32String(userDIDData as ethers.BytesLike) : 'N/A';

  const [checkAccessArgs, setCheckAccessArgs] = useState<[string, string]>([ethers.ZeroHash, ethers.ZeroHash]);
  const { data: checkAccessResult } = useReadContract({
    address: CONTRACT_ADDRESSES.ACCESS_CONTROL,
    abi: ACCESS_CONTROL_ABI,
    functionName: 'checkAccess',
    args: [
      checkAccessArgs[0] as `0x${string}`,
      checkAccessArgs[1] as `0x${string}`
    ],
    query: {
      enabled: isConnected && fileCIDToRevoke !== '' && recipientDIDToRevoke !== '',
    }
  });

  useEffect(() => {
    if (checkAccessResult !== undefined) {
      console.log('Access check result:', checkAccessResult);
    }
  }, [checkAccessResult]);

  const [revokeAccessArgs, setRevokeAccessArgs] = useState<[string, string]>([ethers.ZeroHash, ethers.ZeroHash]);
  const { data: revokeAccessSimulateData } = useSimulateContract({
    address: CONTRACT_ADDRESSES.ACCESS_CONTROL,
    abi: ACCESS_CONTROL_ABI,
    functionName: 'revokeAccess',
    args: [
      revokeAccessArgs[0] as `0x${string}`,
      revokeAccessArgs[1] as `0x${string}`
    ],
    query: {
      enabled: !!revokeAccessArgs[0] && !!revokeAccessArgs[1],
    },
  });
  const { writeContract: writeRevokeAccess, isPending: isWriteRevokeAccessPending } = useWriteContract();

  const handleRevokeAccess = async () => {
    if (!isConnected || !fileCIDToRevoke || !recipientDIDToRevoke) {
      setStatus('Please enter File CID and Recipient DID.');
      return;
    }
    setStatus('Revoking access...');
    try {
      const fileCIDBytes32 = ethers.encodeBytes32String(fileCIDToRevoke.slice(0, 31));
      const recipientDIDBytes32 = ethers.encodeBytes32String(recipientDIDToRevoke);

      setRevokeAccessArgs([fileCIDBytes32, recipientDIDBytes32]);

      if (revokeAccessSimulateData?.request) {
        writeRevokeAccess(revokeAccessSimulateData.request);
        setStatus('Access revocation transaction sent. Please confirm in MetaMask.');
      } else {
        setStatus('Preparing access revocation transaction. Try again if no MetaMask confirmation appears.');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setStatus(`Access revocation failed: ${errorMessage}`);
    }
  };

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Your Digital <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Asset Library</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage your uploaded files and control access permissions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mr-4">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Your Identity</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm font-medium text-gray-600 mb-2">Your DID:</p>
                  <p className="font-mono text-sm text-gray-900 break-all">{userDID}</p>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                    <span className="text-sm font-medium text-green-800">Identity Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* File List */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900">Your Files</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Files uploaded to blockchain
                </div>
              </div>
              
              {/* Placeholder for file list */}
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-center text-center">
                    <div>
                      <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="mx-auto mb-4 text-blue-500">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Your Files Will Appear Here</h4>
                      <p className="text-gray-600 mb-4">Once you upload files, they'll be displayed in this section with full management capabilities.</p>
                      <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="mr-2">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Complete implementation in progress
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Access Control Section */}
        <div className="mt-16 bg-white p-8 rounded-3xl shadow-lg border border-gray-200">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Access Control Management</h3>
            <p className="text-lg text-gray-600">Revoke access permissions for shared files</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">File CID to Revoke</label>
                <input
                  type="text"
                  placeholder="Enter file CID"
                  value={fileCIDToRevoke}
                  onChange={(e) => setFileCIDToRevoke(e.target.value)}
                  className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Recipient DID</label>
                <input
                  type="text"
                  placeholder="Enter recipient DID"
                  value={recipientDIDToRevoke}
                  onChange={(e) => setRecipientDIDToRevoke(e.target.value)}
                  className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500"
                />
              </div>
              
              <button
                onClick={handleRevokeAccess}
                disabled={!isConnected || !fileCIDToRevoke || !recipientDIDToRevoke || isWriteRevokeAccessPending}
                className="px-6 py-4 bg-red-600 text-white font-semibold rounded-xl shadow-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isWriteRevokeAccessPending ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                    </svg>
                    Revoke Access
                  </>
                )}
              </button>
            </div>
            
            {status && (
              <div className={`mt-6 p-4 rounded-xl border ${
                status.includes('failed') || status.includes('error') 
                  ? 'bg-red-50 border-red-200 text-red-700' 
                  : status.includes('sent') || status.includes('success')
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-blue-50 border-blue-200 text-blue-700'
              }`}>
                <p className="text-sm font-medium">{status}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
