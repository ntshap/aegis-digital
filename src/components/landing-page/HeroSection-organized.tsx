'use client';

import React, { useState, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useFileOperations } from '../../hooks/useFileOperations';
import { useDIDOperations } from '../../hooks/useDIDOperations';
import { ipfsService } from '../../services/ipfs';
import { AIService } from '../../services/ai';
import { 
  Upload, 
  FileText, 
  Shield, 
  Zap, 
  DollarSign, 
  CheckCircle, 
  Activity,
  Loader2
} from 'lucide-react';

// Constants
const PLATFORM_STATS = [
  { icon: FileText, value: '15.2K', label: 'FILES REGISTERED', bg: 'neubrutal-bg-yellow', iconColor: 'text-yellow-400' },
  { icon: Shield, value: '98.7%', label: 'DATA INTEGRITY', bg: 'neubrutal-bg-pink', iconColor: 'text-pink-400' },
  { icon: Zap, value: '5.4M', label: 'AI VALIDATIONS', bg: 'neubrutal-bg-cyan', iconColor: 'text-cyan-400' },
  { icon: DollarSign, value: '$45.8M', label: 'VALUE PROTECTED', bg: 'neubrutal-bg-lime', iconColor: 'text-lime-400' },
];

const RECENT_ACTIVITIES = [
  {
    id: 1,
    icon: CheckCircle,
    title: '✅ OWNERSHIP VERIFIED',
    description: 'document_2024.pdf',
    status: 'VERIFIED',
    time: '2 MIN AGO',
    bg: 'neubrutal-bg-lime',
    iconBg: 'neubrutal-bg-yellow'
  },
  {
    id: 2,
    icon: Activity,
    title: '🤖 AI ANALYSIS COMPLETE',
    description: 'Content validation passed',
    status: 'ANALYZED',
    time: '5 MIN AGO',
    bg: 'neubrutal-bg-pink',
    iconBg: 'neubrutal-bg-cyan'
  },
  {
    id: 3,
    icon: Upload,
    title: '📁 NEW FILE UPLOADED',
    description: 'contract_terms.docx',
    status: 'UPLOADED',
    time: '8 MIN AGO',
    bg: 'neubrutal-bg-cyan',
    iconBg: 'neubrutal-bg-lime'
  }
];

function HeroSection() {
  // Hooks
  const { address, isConnected } = useAccount();
  const { registerFile, isRegistering: isUploadingToContract } = useFileOperations();
  const { registerDID, isRegistering } = useDIDOperations();
  
  // State
  const [ipfsHash, setIpfsHash] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [_aiAnalysisResult, setAiAnalysisResult] = useState<object | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Operations
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus(`Selected: ${file.name}`);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Upload Operations
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
      const cid = await ipfsService.uploadFile(selectedFile);
      setIpfsHash(cid);
      setUploadStatus('File uploaded to IPFS successfully!');

      // Register DID if not already registered
      await registerDID();

      // Upload file to blockchain
      const _userDID = `did:lisk:${address}`;
      await registerFile({ ipfsHash: cid, fileName: selectedFile.name });
      
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
      const _userDID = `did:lisk:${address}`;
      await registerFile({ ipfsHash, fileName: 'User provided IPFS hash' });
      
      setUploadStatus('IPFS hash registered on blockchain!');
    } catch (error) {
      console.error('Registration error:', error);
      setUploadStatus(`Registration failed: ${error}`);
    }
  };

  // AI Operations
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

  // UI State Helpers
  const isProcessing = isUploading || isUploadingToContract || isRegistering;
  const connectionStatus = isConnected ? 'LISK SEPOLIA CONNECTED' : 'LISK SEPOLIA - CONNECT WALLET';
  const getStatusMessageStyle = () => {
    if (uploadStatus.includes('failed') || uploadStatus.includes('error')) return 'bg-red-300';
    if (uploadStatus.includes('success') || uploadStatus.includes('complete')) return 'neubrutal-bg-lime';
    return 'neubrutal-bg-cyan';
  };

  // Component Sections
  const StatusBadge = () => (
    <div className="flex justify-center lg:justify-start">
      <div className="inline-flex items-center px-4 py-3 neubrutal-bg-lime neubrutal-border neubrutal-shadow-light">
        <div className={`w-3 h-3 bg-black rounded-full mr-3 ${isConnected ? 'animate-pulse' : ''}`}></div>
        <span className="text-sm font-bold text-black">{connectionStatus}</span>
      </div>
    </div>
  );

  const HeroTitle = () => (
    <div className="text-center lg:text-left space-y-6">
      <h1 className="neubrutal-text-title text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight">
        DATA SOVEREIGNTY IS 
        <span className="neubrutal-bg-yellow px-3 lg:px-4 block mt-2 lg:mt-3"> YOURS</span>
      </h1>
      
      <p className="text-lg lg:text-xl text-black max-w-2xl mx-auto lg:mx-0 leading-relaxed font-bold">
        Upload and register your files to IPFS and the Lisk Blockchain. 
        Prove your data ownership transparently and immutably.
      </p>
    </div>
  );

  const MainActionInput = () => (
    <div className="max-w-3xl mx-auto lg:mx-0">
      <div className="relative">
        <input 
          type="text" 
          placeholder="Upload your file or enter IPFS hash..."
          value={ipfsHash}
          onChange={(e) => setIpfsHash(e.target.value)}
          className="neubrutal-input w-full pr-36 sm:pr-44 text-base lg:text-lg py-4 lg:py-5"
        />
        <button 
          onClick={selectedFile ? handleUpload : handleIpfsHashSubmit}
          disabled={isProcessing}
          className="neubrutal-button absolute right-2 top-2 bottom-2 px-4 lg:px-6 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              <span className="hidden sm:inline">PROCESSING</span>
              <span className="sm:hidden">...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              {selectedFile ? 'UPLOAD' : 'REGISTER'}
            </>
          )}
        </button>
      </div>
    </div>
  );

  const StatusMessage = () => {
    if (!uploadStatus) return null;
    
    return (
      <div className="max-w-3xl mx-auto lg:mx-0">
        <div className={`p-4 lg:p-5 neubrutal-border neubrutal-shadow-light font-bold ${getStatusMessageStyle()}`}>
          <p className="text-sm lg:text-base font-bold text-black mb-2">{uploadStatus}</p>
          {selectedFile && (
            <p className="text-xs lg:text-sm text-black font-bold">📁 FILE: {selectedFile.name}</p>
          )}
          {ipfsHash && (
            <p className="text-xs lg:text-sm break-all text-black font-mono mt-1">
              🔗 IPFS: {ipfsHash.length > 60 ? ipfsHash.substring(0, 60) + '...' : ipfsHash}
            </p>
          )}
        </div>
      </div>
    );
  };

  const QuickActions = () => (
    <div className="max-w-3xl mx-auto lg:mx-0">
      <div className="neubrutal-card p-4 lg:p-6">
        <h3 className="text-sm font-bold text-black mb-4 text-center lg:text-left">QUICK ACTIONS:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button 
            onClick={openFileDialog}
            className="neubrutal-button-secondary text-sm py-3 flex items-center justify-center"
          >
            📁 UPLOAD FILE
          </button>
          <button 
            onClick={handleAIAnalysis}
            disabled={!selectedFile}
            className="neubrutal-button-secondary text-sm py-3 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🤖 AI ANALYSIS
          </button>
          <button 
            onClick={() => {
              const accessControlSection = document.getElementById('access-control');
              if (accessControlSection) {
                accessControlSection.scrollIntoView({ behavior: 'smooth' });
              } else {
                // Fallback to scanner section
                const scannerSection = document.getElementById('scanner');
                scannerSection?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="neubrutal-button-secondary text-sm py-3 flex items-center justify-center"
          >
            🔐 ACCESS CONTROL
          </button>
        </div>
      </div>
    </div>
  );

  const StatsGrid = () => (
    <div className="neubrutal-card p-6 lg:p-8">
      <h2 className="text-xl lg:text-2xl font-bold text-black mb-6 text-center">📊 PLATFORM STATS</h2>
      <div className="grid grid-cols-2 gap-4 lg:gap-6">
        {PLATFORM_STATS.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className={`text-center p-4 ${stat.bg} neubrutal-border neubrutal-shadow-light hover:scale-105 transition-transform duration-200`}>
              <div className="flex items-center justify-center w-12 h-12 neubrutal-border mx-auto mb-3 bg-black">
                <IconComponent className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-black mb-1">{stat.value}</div>
              <div className="text-xs lg:text-sm text-black font-bold">{stat.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const ActivityFeed = () => (
    <div className="neubrutal-card p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg lg:text-xl font-bold text-black flex items-center">
          ⚡ RECENT ACTIVITY
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-black">LIVE</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {RECENT_ACTIVITIES.map((activity) => {
          const IconComponent = activity.icon;
          return (
            <div key={activity.id} className={`p-4 ${activity.bg} neubrutal-border hover:scale-102 transition-transform duration-200`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 ${activity.iconBg} neubrutal-border flex items-center justify-center`}>
                    <IconComponent className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-black">{activity.title}</div>
                    <div className="text-xs text-black font-mono">{activity.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-black font-bold text-xs">{activity.status}</div>
                  <div className="text-xs text-black font-mono">{activity.time}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Main Render
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gray-100 pt-16 lg:pt-20">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept="*/*"
      />
      
      {/* Neubrutalism background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-4 lg:left-10 w-16 h-16 lg:w-24 lg:h-24 neubrutal-bg-yellow neubrutal-border neubrutal-shadow rotate-12 opacity-80"></div>
        <div className="absolute top-32 lg:top-40 right-8 lg:right-20 w-12 h-12 lg:w-16 lg:h-16 neubrutal-bg-pink neubrutal-border neubrutal-shadow -rotate-12 opacity-80"></div>
        <div className="absolute bottom-32 lg:bottom-40 left-8 lg:left-20 w-20 h-20 lg:w-28 lg:h-28 neubrutal-bg-cyan neubrutal-border neubrutal-shadow rotate-45 opacity-80"></div>
        <div className="absolute bottom-20 right-16 lg:right-40 w-10 h-10 lg:w-14 lg:h-14 neubrutal-bg-lime neubrutal-border neubrutal-shadow -rotate-45 opacity-80"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Side - Main Content */}
          <div className="xl:col-span-7 space-y-8 lg:space-y-10">
            <StatusBadge />
            <HeroTitle />
            
            <div className="space-y-6 lg:space-y-8">
              <MainActionInput />
              <StatusMessage />
              <QuickActions />
            </div>
          </div>

          {/* Right Side - Stats Dashboard */}
          <div className="xl:col-span-5 space-y-6 lg:space-y-8">
            <StatsGrid />
            <ActivityFeed />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
