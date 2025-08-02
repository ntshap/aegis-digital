'use client';

import React, { useState, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useFileOperations } from '../../hooks/useFileOperations';
import { useDIDOperations } from '../../hooks/useDIDOperations';
import { IPFSService } from '../../services/ipfs';
import { AIService } from '../../services/ai';

function HeroSection() {
  const { address, isConnected } = useAccount();
  const [ipfsHash, setIpfsHash] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadFile, isUploading: isUploadingToContract } = useFileOperations();
  const { registerDID, isRegistering } = useDIDOperations();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus(`Selected: ${file.name}`);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first');
      return;
    }

    if (!isConnected) {
      setUploadStatus('Please connect your wallet first');
      return;
    }

    setIsUploading(true);
    setUploadStatus('Uploading to IPFS...');

    try {
      // Upload to IPFS
      const cid = await IPFSService.uploadFile(selectedFile);
      setIpfsHash(cid);
      setUploadStatus('File uploaded to IPFS successfully!');

      // Register DID if not already registered
      await registerDID();

      // Upload file to blockchain
      const userDID = `did:lisk:${address}`;
      await uploadFile(cid, userDID);
      
      setUploadStatus('File registered on blockchain!');
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus(`Upload failed: ${error}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleIpfsHashSubmit = async () => {
    if (!ipfsHash.trim()) {
      setUploadStatus('Please enter an IPFS hash');
      return;
    }

    if (!isConnected) {
      setUploadStatus('Please connect your wallet first');
      return;
    }

    try {
      setUploadStatus('Registering IPFS hash on blockchain...');
      
      // Register DID if not already registered
      await registerDID();

      // Upload file hash to blockchain
      const userDID = `did:lisk:${address}`;
      await uploadFile(ipfsHash, userDID);
      
      setUploadStatus('IPFS hash registered on blockchain!');
    } catch (error) {
      console.error('Registration error:', error);
      setUploadStatus(`Registration failed: ${error}`);
    }
  };

  const handleAIAnalysis = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first');
      return;
    }

    setUploadStatus('Analyzing file with AI...');

    try {
      const analysis = await AIService.analyzeFile(selectedFile);
      setAiAnalysisResult(analysis);
      setUploadStatus('AI analysis complete!');
    } catch (error) {
      console.error('AI analysis error:', error);
      setUploadStatus(`AI analysis failed: ${error}`);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 pt-16">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept="*/*"
      />
      
      {/* Refined background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/4 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/4 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[calc(100vh-120px)]">
          {/* Left Side - Content */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200/60 shadow-sm">
              <div className={`w-2 h-2 rounded-full mr-3 ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium text-gray-700">
                {isConnected ? 'Lisk Sepolia Network Connected' : 'Lisk Sepolia Network - Connect Wallet'}
              </span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                Data Sovereignty is 
                <span className="gradient-text block mt-2"> Yours</span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-2xl leading-relaxed font-medium">
                Upload and register your files to IPFS and the Lisk Blockchain. 
                Prove your data ownership transparently and immutably.
              </p>
            </div>

            <div className="space-y-6">
              <div className="relative max-w-2xl">
                <input 
                  type="text" 
                  placeholder="Upload your file or enter IPFS hash..."
                  value={ipfsHash}
                  onChange={(e) => setIpfsHash(e.target.value)}
                  className="w-full px-6 py-5 pr-32 rounded-2xl bg-white/95 border border-gray-200/60 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20 text-gray-900 placeholder-gray-500 shadow-lg backdrop-blur-sm transition-all duration-200 text-lg"
                />
                <button 
                  onClick={selectedFile ? handleUpload : handleIpfsHashSubmit}
                  disabled={isUploading || isUploadingToContract || isRegistering}
                  className="btn-primary absolute right-3 top-3 px-6 py-2.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading || isUploadingToContract || isRegistering ? (
                    <div className="flex items-center">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      {selectedFile ? 'Upload' : 'Register'}
                    </div>
                  )}
                </button>
              </div>

              {/* Status Message */}
              {uploadStatus && (
                <div className={`max-w-2xl p-3 rounded-lg ${uploadStatus.includes('failed') || uploadStatus.includes('error') 
                  ? 'bg-red-50 border border-red-200 text-red-700' 
                  : uploadStatus.includes('success') || uploadStatus.includes('complete')
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-blue-50 border border-blue-200 text-blue-700'
                }`}>
                  <p className="text-sm font-medium">{uploadStatus}</p>
                  {selectedFile && (
                    <p className="text-xs mt-1">File: {selectedFile.name}</p>
                  )}
                  {ipfsHash && (
                    <p className="text-xs mt-1 break-all">IPFS Hash: {ipfsHash}</p>
                  )}
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3 items-center max-w-2xl">
                <span className="text-sm font-semibold text-gray-700">Quick actions:</span>
                <button 
                  onClick={openFileDialog}
                  className="px-4 py-2.5 rounded-xl bg-white/90 backdrop-blur-sm border border-gray-200/60 text-sm font-medium text-gray-700 hover:bg-white hover:border-gray-300 hover:shadow-md transition-all duration-200"
                >
                  Upload File
                </button>
                <button 
                  onClick={handleAIAnalysis}
                  disabled={!selectedFile}
                  className="px-4 py-2.5 rounded-xl bg-white/90 backdrop-blur-sm border border-gray-200/60 text-sm font-medium text-gray-700 hover:bg-white hover:border-gray-300 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  AI Analysis
                </button>
                <button 
                  className="px-4 py-2.5 rounded-xl bg-white/90 backdrop-blur-sm border border-gray-200/60 text-sm font-medium text-gray-700 hover:bg-white hover:border-gray-300 hover:shadow-md transition-all duration-200"
                >
                  Access Control
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Stats Dashboard */}
          <div className="lg:col-span-5 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bento-card text-center group hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 mx-auto mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-blue-600">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">15.2K</div>
                <div className="text-sm text-gray-600 font-medium">Files Registered</div>
              </div>

              <div className="bento-card text-center group hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500/10 mx-auto mb-4 group-hover:bg-orange-500/20 transition-colors">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-orange-600">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">98.7%</div>
                <div className="text-sm text-gray-600 font-medium">Data Integrity</div>
              </div>

              <div className="bento-card text-center group hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 mx-auto mb-4 group-hover:bg-purple-500/20 transition-colors">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-purple-600">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">5.4M</div>
                <div className="text-sm text-gray-600 font-medium">AI Validations</div>
              </div>

              <div className="bento-card text-center group hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/10 mx-auto mb-4 group-hover:bg-green-500/20 transition-colors">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-green-600">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">$45.8M</div>
                <div className="text-sm text-gray-600 font-medium">Value Protected</div>
              </div>
            </div>

            {/* Feature highlights */}
            <div className="bento-card hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors px-3 py-1 rounded-lg hover:bg-indigo-50">Live Updates</button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80 border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Ownership Verified</div>
                      <div className="text-xs text-gray-600">document_2024.pdf</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-600 font-semibold text-xs">Verified</div>
                    <div className="text-xs text-gray-500">2 min ago</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80 border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">AI Analysis Complete</div>
                      <div className="text-xs text-gray-600">Content validation passed</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-blue-600 font-semibold text-xs">Analyzed</div>
                    <div className="text-xs text-gray-500">5 min ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
