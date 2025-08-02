'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useSimulateContract, useWriteContract } from 'wagmi';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, DID_REGISTRY_ABI, FILE_REGISTRY_ABI, ACCESS_CONTROL_ABI } from '../config/contracts';
import { IPFSService } from '../services/ipfs';
import { 
  BadgeCheck, 
  Upload, 
  Zap, 
  Share2, 
  Loader2 
} from 'lucide-react';

export function FileUploadSection() {
  const { address, isConnected } = useAccount();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [aiAnalysisResult, setAiAnalysisResult] = useState<unknown>(null);
  const [fileCIDToShare, setFileCIDToShare] = useState('');
  const [recipientDID, setRecipientDID] = useState('');

  const { data: registerDIDSimulateData } = useSimulateContract({
    address: CONTRACT_ADDRESSES.DID_REGISTRY,
    abi: DID_REGISTRY_ABI,
    functionName: 'registerDID',
    args: [],
    query: {
      enabled: isConnected,
    },
  });
  const { writeContract: writeRegisterDID, isPending: isWriteRegisterDIDPending } = useWriteContract();

  const [uploadFileArgs, setUploadFileArgs] = useState<[string, string]>(['', '']);
  const { data: uploadFileSimulateData } = useSimulateContract({
    address: CONTRACT_ADDRESSES.FILE_REGISTRY,
    abi: FILE_REGISTRY_ABI,
    functionName: 'registerFile',
    args: [uploadFileArgs[0], uploadFileArgs[1]],
    query: {
      enabled: !!uploadFileArgs[0] && !!uploadFileArgs[1],
    },
  });
  const { writeContract: writeUploadFile, isPending: isWriteUploadFilePending } = useWriteContract();

  const [grantAccessArgs, setGrantAccessArgs] = useState<[string, string]>([ethers.ZeroHash, ethers.ZeroHash]);
  const { data: grantAccessSimulateData } = useSimulateContract({
    address: CONTRACT_ADDRESSES.ACCESS_CONTROL,
    abi: ACCESS_CONTROL_ABI,
    functionName: 'grantAccess',
    args: [grantAccessArgs[0] as `0x${string}`, grantAccessArgs[1] as `0x${string}`],
    query: {
      enabled: !!grantAccessArgs[0] && !!grantAccessArgs[1],
    },
  });
  const { writeContract: writeGrantAccess, isPending: isWriteGrantAccessPending } = useWriteContract();

  const { data: userDIDData } = useReadContract({
    address: CONTRACT_ADDRESSES.DID_REGISTRY,
    abi: DID_REGISTRY_ABI,
    functionName: 'getDID',
    args: [address as `0x${string}`],
    query: {
      enabled: isConnected && !!address,
    },
  });
  const userDID = userDIDData ? ethers.decodeBytes32String(userDIDData as string) : 'N/A';

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setUploadStatus('');
      setAiAnalysisResult(null);
    }
  };

  const handleRegisterDID = async () => {
    if (!isConnected) {
      setUploadStatus('Please connect your wallet first.');
      return;
    }
    setUploadStatus('Registering DID...');
    try {
      if (registerDIDSimulateData?.request) {
        writeRegisterDID(registerDIDSimulateData.request);
        setUploadStatus('DID registration transaction sent. Please confirm in MetaMask.');
      } else {
        setUploadStatus('Failed to prepare DID registration transaction. Make sure wallet is connected.');
      }
    } catch (error: unknown) {
      setUploadStatus(`DID registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !isConnected) {
      setUploadStatus('Please select a file and connect your wallet.');
      return;
    }
    if (userDIDData === ethers.ZeroHash) {
      setUploadStatus('User DID not found. Please register your DID first.');
      return;
    }

    setUploadStatus('Uploading to IPFS and analyzing with AI...');
    try {
      const result = await IPFSService.uploadFile(selectedFile);
      const fileCID = result;
      setUploadStatus(`File uploaded to IPFS: ${fileCID}. Now analyzing with AI...`);

      const formData = new FormData();
      formData.append('file', selectedFile);

      const aiResponse = await fetch('http://127.0.0.1:8000/analyze-file', {
        method: 'POST',
        body: formData,
      });

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        throw new Error(`AI Backend Error: ${aiResponse.status} - ${errorText}`);
      }

      const aiData = await aiResponse.json();
      setAiAnalysisResult(aiData.ai_analysis);
      setUploadStatus(`AI analysis complete. Now registering on Lisk...`);

      // Use string arguments for the new registerFile function
      setUploadFileArgs([fileCID, selectedFile.name]);

      setTimeout(() => {
        if (uploadFileSimulateData?.request) {
          writeUploadFile(uploadFileSimulateData.request);
          setUploadStatus('File registered on Lisk. Transaction sent. Please confirm in MetaMask.');
        } else {
          setUploadStatus('Preparing file registration transaction. Try again if no MetaMask confirmation appears.');
        }
      }, 100);

    } catch (error: unknown) {
      setUploadStatus(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleGrantAccess = async () => {
    if (!isConnected || !fileCIDToShare || !recipientDID) {
      setUploadStatus('Please enter File CID and Recipient DID.');
      return;
    }
    setUploadStatus('Granting access...');
    try {
      const fileCIDBytes32 = ethers.encodeBytes32String(fileCIDToShare.slice(0, 31));
      const recipientDIDBytes32 = ethers.encodeBytes32String(recipientDID);

      setGrantAccessArgs([fileCIDBytes32, recipientDIDBytes32]);

      setTimeout(() => {
        if (grantAccessSimulateData?.request) {
          writeGrantAccess(grantAccessSimulateData.request);
          setUploadStatus('Access granted successfully. Transaction sent. Please confirm in MetaMask.');
        } else {
          setUploadStatus('Preparing access grant transaction. Try again if no MetaMask confirmation appears.');
        }
      }, 100);

    } catch (error: unknown) {
      setUploadStatus(`Access grant failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <section id="scanner" className="py-16 lg:py-24 bg-gray-100">
      <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="neubrutal-text-title text-3xl sm:text-4xl lg:text-5xl mb-4 lg:mb-6">
            FILE MANAGEMENT & <span className="neubrutal-bg-pink px-2 lg:px-4 block sm:inline mt-1 sm:mt-0">AI ANALYSIS</span>
          </h2>
          <p className="text-lg lg:text-xl text-black max-w-3xl mx-auto font-bold">
            Upload files to IPFS, register ownership on blockchain, and leverage AI for content analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* DID Registration Section */}
            <div className="neubrutal-card p-6 lg:p-8">
              <div className="flex items-center mb-4 lg:mb-6">
                <div className="w-10 h-10 lg:w-12 lg:h-12 neubrutal-bg-lime neubrutal-border neubrutal-shadow flex items-center justify-center mr-3 lg:mr-4">
                  <BadgeCheck className="w-5 h-5 lg:w-6 lg:h-6 text-black" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-black">DIGITAL IDENTITY</h3>
              </div>            
              <div className="space-y-4 lg:space-y-6">
              <div className="neubrutal-card p-3 lg:p-4">
                <p className="text-xs lg:text-sm font-bold text-black mb-2">YOUR DID:</p>
                <p className="font-mono text-xs lg:text-sm text-black neubrutal-bg-yellow p-2 lg:p-3 neubrutal-border break-all">{userDID}</p>
              </div>
              
              <button 
                onClick={handleRegisterDID} 
                disabled={!isConnected || isWriteRegisterDIDPending || !registerDIDSimulateData?.request} 
                className="neubrutal-button w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isWriteRegisterDIDPending ? (
                  <>
                    <Loader2 className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3 animate-spin" />
                    PROCESSING...
                  </>
                ) : (
                  'REGISTER MY DID'
                )}
              </button>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="neubrutal-card p-6 lg:p-8">
            <div className="flex items-center mb-4 lg:mb-6">
              <div className="w-10 h-10 lg:w-12 lg:h-12 neubrutal-bg-cyan neubrutal-border neubrutal-shadow flex items-center justify-center mr-3 lg:mr-4">
                <Upload className="w-5 h-5 lg:w-6 lg:h-6 text-black" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-black">FILE UPLOAD</h3>
            </div>
            
            <div className="space-y-4 lg:space-y-6">
              <div className="neubrutal-card p-4 lg:p-6 space-y-3 lg:space-y-4">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="neubrutal-input block w-full text-xs sm:text-sm text-black file:mr-2 lg:file:mr-4 file:py-2 file:px-3 lg:file:py-3 lg:file:px-6 file:border-0 file:text-xs lg:file:text-sm file:font-bold file:neubrutal-button hover:file:scale-105 transition-transform cursor-pointer"
                />
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || !isConnected || userDIDData === ethers.ZeroHash || isWriteUploadFilePending}
                  className="neubrutal-button w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isWriteUploadFilePending ? (
                    <>
                      <Loader2 className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3 animate-spin" />
                      <span className="hidden sm:inline">PROCESSING...</span>
                      <span className="sm:hidden">...</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">UPLOAD & ANALYZE</span>
                      <span className="sm:hidden">UPLOAD</span>
                    </>
                  )}
                </button>
              </div>
              
              {uploadStatus && (
                <div className={`p-3 lg:p-4 neubrutal-border neubrutal-shadow-light font-bold ${
                  uploadStatus.includes('failed') || uploadStatus.includes('error') 
                    ? 'bg-red-300' 
                    : uploadStatus.includes('success') || uploadStatus.includes('complete')
                    ? 'neubrutal-bg-lime'
                    : 'neubrutal-bg-cyan'
                }`}>
                  <p className="text-xs lg:text-sm font-bold text-black">{uploadStatus}</p>
                </div>
              )}
              
              {aiAnalysisResult !== null && (
                <div className="neubrutal-card p-4 lg:p-6">
                  <h4 className="font-bold text-base lg:text-lg text-black mb-3 flex items-center">
                    <Zap className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-black" />
                    AI ANALYSIS RESULT
                  </h4>
                  <pre className="text-xs lg:text-sm whitespace-pre-wrap text-black neubrutal-bg-yellow p-3 lg:p-4 neubrutal-border overflow-auto max-h-48 lg:max-h-64 font-mono">
                    {typeof aiAnalysisResult === 'string' 
                      ? aiAnalysisResult 
                      : JSON.stringify(aiAnalysisResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Share File Section */}
        <div className="mt-12 lg:mt-16 neubrutal-card p-6 lg:p-8">
          <div className="text-center mb-6 lg:mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-black mb-3 lg:mb-4">SHARE FILE ACCESS</h3>
            <p className="text-base lg:text-lg text-black font-bold">Grant or revoke access to your files for other users</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 max-w-4xl mx-auto">
            <div className="space-y-3 lg:space-y-4">
              <input
                type="text"
                placeholder="File CID (from upload result)"
                value={fileCIDToShare}
                onChange={(e) => setFileCIDToShare(e.target.value)}
                className="neubrutal-input w-full"
              />
              <input
                type="text"
                placeholder="Recipient DID (e.g., 0x... or user's DID)"
                value={recipientDID}
                onChange={(e) => setRecipientDID(e.target.value)}
                className="neubrutal-input w-full"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={handleGrantAccess}
                disabled={!isConnected || !fileCIDToShare || !recipientDID || isWriteGrantAccessPending}
                className="neubrutal-button w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isWriteGrantAccessPending ? (
                  <>
                    <Loader2 className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3 animate-spin" />
                    <span className="hidden sm:inline">PROCESSING...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
                    <span className="hidden sm:inline">GRANT ACCESS</span>
                    <span className="sm:hidden">GRANT</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
