'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useSimulateContract, useWriteContract } from 'wagmi';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, DID_REGISTRY_ABI, ACCESS_CONTROL_ABI } from '../config/contracts';
import { 
  User, 
  Upload, 
  FileText, 
  Info, 
  UserX, 
  Loader2 
} from 'lucide-react';

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
    <section className="py-24 bg-gray-100">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="neubrutal-text-title text-4xl md:text-5xl mb-6">
            YOUR DIGITAL <span className="neubrutal-bg-cyan px-4">ASSET LIBRARY</span>
          </h2>
          <p className="text-xl text-black max-w-3xl mx-auto font-bold">
            Manage your uploaded files and control access permissions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info Card */}
          <div className="lg:col-span-1">
            <div className="neubrutal-card p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 neubrutal-bg-yellow neubrutal-border neubrutal-shadow flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-black">YOUR IDENTITY</h3>
              </div>
              
              <div className="space-y-4">
                <div className="neubrutal-bg-lime p-4 neubrutal-border">
                  <p className="text-sm font-bold text-black mb-2">YOUR DID:</p>
                  <p className="font-mono text-sm text-black break-all">{userDID}</p>
                </div>
                
                <div className="neubrutal-bg-lime p-4 neubrutal-border neubrutal-shadow-light">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-black rounded-full mr-3"></div>
                    <span className="text-sm font-bold text-black">IDENTITY VERIFIED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* File List */}
          <div className="lg:col-span-2">
            <div className="neubrutal-card p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-black">YOUR FILES</h3>
                <div className="flex items-center text-sm text-black font-bold">
                  <Upload className="w-4 h-4 mr-2" />
                  FILES ON BLOCKCHAIN
                </div>
              </div>
              
              {/* Placeholder for file list */}
              <div className="space-y-4">
                <div className="neubrutal-bg-pink p-6 neubrutal-border neubrutal-shadow-light">
                  <div className="flex items-center justify-center text-center">
                    <div>
                      <FileText className="w-12 h-12 mx-auto mb-4 text-black" />
                      <h4 className="text-lg font-bold text-black mb-2">YOUR FILES WILL APPEAR HERE</h4>
                      <p className="text-black mb-4 font-bold">Once you upload files, they&apos;ll be displayed in this section with full management capabilities.</p>
                      <div className="inline-flex items-center px-4 py-2 neubrutal-bg-cyan neubrutal-border text-black text-sm font-bold">
                        <Info className="w-4 h-4 mr-2" />
                        COMPLETE IMPLEMENTATION IN PROGRESS
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Access Control Section */}
        <div className="mt-16 neubrutal-card p-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-black mb-4">ACCESS CONTROL MANAGEMENT</h3>
            <p className="text-lg text-black font-bold">Revoke access permissions for shared files</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-black">FILE CID TO REVOKE</label>
                <input
                  type="text"
                  placeholder="Enter file CID"
                  value={fileCIDToRevoke}
                  onChange={(e) => setFileCIDToRevoke(e.target.value)}
                  className="neubrutal-input w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-black">RECIPIENT DID</label>
                <input
                  type="text"
                  placeholder="Enter recipient DID"
                  value={recipientDIDToRevoke}
                  onChange={(e) => setRecipientDIDToRevoke(e.target.value)}
                  className="neubrutal-input w-full"
                />
              </div>
              
              <button
                onClick={handleRevokeAccess}
                disabled={!isConnected || !fileCIDToRevoke || !recipientDIDToRevoke || isWriteRevokeAccessPending}
                className="neubrutal-button-secondary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isWriteRevokeAccessPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    PROCESSING...
                  </>
                ) : (
                  <>
                    <UserX className="w-5 h-5 mr-2" />
                    REVOKE ACCESS
                  </>
                )}
              </button>
            </div>
            
            {status && (
              <div className={`mt-6 p-4 neubrutal-border neubrutal-shadow-light font-bold ${
                status.includes('failed') || status.includes('error') 
                  ? 'bg-red-300' 
                  : status.includes('sent') || status.includes('success')
                  ? 'neubrutal-bg-lime'
                  : 'neubrutal-bg-cyan'
              }`}>
                <p className="text-sm font-bold text-black">{status}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
