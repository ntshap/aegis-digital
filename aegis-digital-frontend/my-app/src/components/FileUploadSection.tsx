'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useSimulateContract, useWriteContract } from 'wagmi';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, DID_REGISTRY_ABI, FILE_REGISTRY_ABI, ACCESS_CONTROL_ABI } from '../config/contracts';
import { IPFSService } from '../services/ipfs';

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

  const [uploadFileArgs, setUploadFileArgs] = useState<[string, string]>([ethers.ZeroHash, ethers.ZeroHash]);
  const { data: uploadFileSimulateData } = useSimulateContract({
    address: CONTRACT_ADDRESSES.FILE_REGISTRY,
    abi: FILE_REGISTRY_ABI,
    functionName: 'uploadFile',
    args: [uploadFileArgs[0] as `0x${string}`, uploadFileArgs[1] as `0x${string}`],
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

      const fileCIDBytes32 = ethers.encodeBytes32String(fileCID.slice(0, 31));
      const ownerDIDBytes32 = userDIDData as string;

      setUploadFileArgs([fileCIDBytes32, ownerDIDBytes32]);

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
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            File Management & <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">AI Analysis</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload files to IPFS, register ownership on blockchain, and leverage AI for content analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* DID Registration Section */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-3xl border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mr-4">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Digital Identity</h3>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <p className="text-sm font-medium text-gray-600 mb-2">Your DID:</p>
                <p className="font-mono text-sm text-gray-900 bg-gray-50 p-3 rounded-lg break-all">{userDID}</p>
              </div>
              
              <button 
                onClick={handleRegisterDID} 
                disabled={!isConnected || isWriteRegisterDIDPending || !registerDIDSimulateData?.request} 
                className="w-full px-6 py-4 bg-green-600 text-white font-semibold rounded-xl shadow-lg hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isWriteRegisterDIDPending ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                    Processing...
                  </>
                ) : (
                  'Register My DID'
                )}
              </button>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-3xl border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-4">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">File Upload</h3>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600 transition-colors cursor-pointer"
                />
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || !isConnected || userDIDData === ethers.ZeroHash || isWriteUploadFilePending}
                  className="w-full px-6 py-4 bg-purple-600 text-white font-semibold rounded-xl shadow-lg hover:bg-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isWriteUploadFilePending ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                      Processing...
                    </>
                  ) : (
                    'Upload & Analyze'
                  )}
                </button>
              </div>
              
              {uploadStatus && (
                <div className={`p-4 rounded-xl border ${
                  uploadStatus.includes('failed') || uploadStatus.includes('error') 
                    ? 'bg-red-50 border-red-200 text-red-700' 
                    : uploadStatus.includes('success') || uploadStatus.includes('complete')
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-blue-50 border-blue-200 text-blue-700'
                }`}>
                  <p className="text-sm font-medium">{uploadStatus}</p>
                </div>
              )}
              
              {aiAnalysisResult !== null && (
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h4 className="font-semibold text-lg text-gray-900 mb-3 flex items-center">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="mr-2 text-purple-600">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    AI Analysis Result
                  </h4>
                  <pre className="text-sm whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-lg overflow-auto max-h-64">
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
        <div className="mt-16 bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-3xl border border-indigo-200">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Share File Access</h3>
            <p className="text-lg text-gray-600">Grant or revoke access to your files for other users</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="File CID (from upload result)"
                value={fileCIDToShare}
                onChange={(e) => setFileCIDToShare(e.target.value)}
                className="w-full p-4 rounded-xl bg-white border border-indigo-200 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-500"
              />
              <input
                type="text"
                placeholder="Recipient DID (e.g., 0x... or user's DID)"
                value={recipientDID}
                onChange={(e) => setRecipientDID(e.target.value)}
                className="w-full p-4 rounded-xl bg-white border border-indigo-200 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-500"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={handleGrantAccess}
                disabled={!isConnected || !fileCIDToShare || !recipientDID || isWriteGrantAccessPending}
                className="w-full px-6 py-4 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isWriteGrantAccessPending ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                    Processing...
                  </>
                ) : (
                  'Grant Access'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
