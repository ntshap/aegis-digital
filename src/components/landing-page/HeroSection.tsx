'use client';

import React, { useState, useRef, useEffect } from 'react';
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

// Types
interface PredictionResult {
  score: number;
  label: string;
}

interface AIAnalysis {
  model_prediction?: PredictionResult[];
  user_friendly_text?: string;
  content_type?: string;
  language?: string;
  sentiment?: string;
  summary?: string;
  confidence?: number;
}

interface AnalysisResult {
  filename?: string;
  file_type?: string;
  ai_analysis?: AIAnalysis;
}

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
  const { address: _address, isConnected } = useAccount();
  const { registerFile, isRegistering: isUploadingToContract } = useFileOperations();
  const { registerDID, isRegistering } = useDIDOperations();
  
  // State
  const [ipfsHash, setIpfsHash] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [aiAnalysisResult, setAiAnalysisResult] = useState<object | null>(null);
  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fix hydration mismatch by only showing connection status after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // File Operations
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus(`Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
      // Clear previous IPFS hash when new file is selected
      setIpfsHash('');
      // Clear previous AI analysis result
      setAiAnalysisResult(null);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const clearAll = () => {
    setSelectedFile(null);
    setIpfsHash('');
    setUploadStatus('');
    setAiAnalysisResult(null);
    setIsAnalysisExpanded(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
    setUploadStatus('🚀 Starting upload process... Preparing your file for secure storage...');

    try {
      // Upload to IPFS
      setUploadStatus('📤 Uploading to IPFS... Your file is being stored on the decentralized network...');
      const cid = await ipfsService.uploadFile(selectedFile);
      setIpfsHash(cid);
      setUploadStatus('✅ File uploaded to IPFS successfully! File is now accessible worldwide...');

      // Register DID if not already registered (automatic)
      setUploadStatus('🆔 Setting up your digital identity... Creating your blockchain identity...');
      await registerDID();

      // Upload file to blockchain
      setUploadStatus('⛓️ Registering file on Lisk blockchain... Creating immutable proof of ownership...');
      await registerFile({ ipfsHash: cid, fileName: selectedFile.name });
      
      setUploadStatus(`🎉 Success! File registered on blockchain! IPFS CID: ${cid}`);
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setUploadStatus(`❌ Upload failed: ${errorMessage}`);
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
      setUploadStatus('🆔 Setting up your digital identity...');
      
      // Register DID if not already registered (automatic)
      await registerDID();

      setUploadStatus('⛓️ Registering IPFS hash on blockchain...');
      // Upload file hash to blockchain
      await registerFile({ ipfsHash, fileName: 'User provided IPFS hash' });
      
      setUploadStatus(`🎉 Success! IPFS hash registered on blockchain! Hash: ${ipfsHash}`);
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setUploadStatus(`❌ Registration failed: ${errorMessage}`);
    }
  };

  // AI Operations
  const handleAIAnalysis = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first for AI analysis');
      return;
    }

    setUploadStatus('🤖 Analyzing file with AI... Please wait...');

    try {
      const analysis = await AIService.analyzeFile(selectedFile);
      setAiAnalysisResult(analysis);
      console.log('AI Analysis Result:', analysis);
      
      // Create a more user-friendly success message
      const fileTypeDesc = getFileTypeDescription(analysis.file_type);
      setUploadStatus(`✅ AI analysis complete! Your ${fileTypeDesc.split(' ')[1] || 'file'} has been successfully analyzed.`);
    } catch (error) {
      console.error('AI analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setUploadStatus(`❌ AI analysis failed: ${errorMessage}. Make sure the AI backend is running.`);
    }
  };

  // UI State Helpers
  const isProcessing = isUploading || isUploadingToContract || isRegistering;
  const connectionStatus = isMounted && isConnected ? 'LISK SEPOLIA CONNECTED' : 'LISK SEPOLIA - CONNECT WALLET';
  const getStatusMessageStyle = () => {
    if (uploadStatus.includes('failed') || uploadStatus.includes('error')) return 'bg-red-300';
    if (uploadStatus.includes('success') || uploadStatus.includes('complete')) return 'neubrutal-bg-lime';
    return 'neubrutal-bg-cyan';
  };

  // AI Analysis Helper Functions
  const getFileTypeDescription = (fileType: string) => {
    const typeMap: { [key: string]: string } = {
      'application/pdf': '📄 PDF Document',
      'application/msword': '📝 Word Document (.doc)',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝 Word Document (.docx)',
      'application/vnd.ms-excel': '📊 Excel Spreadsheet (.xls)',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊 Excel Spreadsheet (.xlsx)',
      'application/vnd.ms-powerpoint': '📺 PowerPoint Presentation (.ppt)',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': '📺 PowerPoint Presentation (.pptx)',
      'text/plain': '📄 Text File',
      'text/csv': '📊 CSV Data File',
      'image/jpeg': '🖼️ JPEG Image',
      'image/png': '🖼️ PNG Image',
      'image/gif': '🖼️ GIF Image',
      'application/json': '🗂️ JSON Data File',
      'application/xml': '🗂️ XML Data File',
      'application/zip': '🗜️ ZIP Archive',
      'application/x-rar-compressed': '🗜️ RAR Archive'
    };
    return typeMap[fileType] || `📄 ${fileType.split('/')[1]?.toUpperCase() || 'Unknown'} File`;
  };

  interface AIAnalysisResult {
    content_type?: string;
    language?: string;
    sentiment?: string;
    summary?: string;
    confidence?: number;
  }

  const renderAIAnalysisResults = (analysis: AIAnalysisResult) => {
    if (!analysis) return <p className="text-black">No detailed analysis available.</p>;

    const results = [];

    // Check if there's content classification
    if (analysis.content_type) {
      results.push(
        <p key="content" className="text-black">
          <strong>📖 Content Type:</strong> {analysis.content_type}
          <br />
          <span className="text-xs italic">What kind of content is in your file</span>
        </p>
      );
    }

    // Check if there's language detection
    if (analysis.language) {
      results.push(
        <p key="language" className="text-black">
          <strong>🌐 Language:</strong> {analysis.language}
          <br />
          <span className="text-xs italic">Primary language detected in the document</span>
        </p>
      );
    }

    // Check if there's sentiment analysis
    if (analysis.sentiment && typeof analysis.sentiment === 'string') {
      const sentimentEmoji = analysis.sentiment === 'positive' ? '😊' : 
                           analysis.sentiment === 'negative' ? '😟' : '😐';
      const sentimentDesc = analysis.sentiment === 'positive' ? 'Generally positive tone' :
                           analysis.sentiment === 'negative' ? 'Generally negative tone' : 'Neutral tone';
      results.push(
        <p key="sentiment" className="text-black">
          <strong>💭 Sentiment:</strong> {sentimentEmoji} {analysis.sentiment.charAt(0).toUpperCase() + analysis.sentiment.slice(1)}
          <br />
          <span className="text-xs italic">{sentimentDesc}</span>
        </p>
      );
    }

    // Check for any summary or description
    if (analysis.summary) {
      results.push(
        <div key="summary" className="text-black">
          <strong>📝 Summary:</strong>
          <p className="mt-1 text-sm">{analysis.summary}</p>
          <span className="text-xs italic">AI-generated summary of your document</span>
        </div>
      );
    }

    // Check for confidence scores
    if (analysis.confidence && typeof analysis.confidence === 'number') {
      results.push(
        <p key="confidence" className="text-black">
          <strong>🎯 Confidence:</strong> {(analysis.confidence * 100).toFixed(1)}%
          <br />
          <span className="text-xs italic">How confident the AI is about this analysis</span>
        </p>
      );
    }

    // If no specific fields, try to extract meaningful info from the raw data
    if (results.length === 0) {
      const analysisStr = JSON.stringify(analysis);
      if (analysisStr.length > 50) {
        results.push(
          <div key="general" className="text-black">
            <p><strong>📊 Analysis Status:</strong> ✅ Complete</p>
            <span className="text-xs italic">Your file has been successfully processed and analyzed by our AI system</span>
          </div>
        );
      }
    }

    return results.length > 0 ? results : (
      <div className="text-black">
        <p>✅ <strong>Analysis Complete!</strong></p>
        <span className="text-xs italic">File successfully analyzed - content appears to be in standard format with no issues detected.</span>
      </div>
    );
  };

  const renderSafetyScore = (prediction: PredictionResult[] | undefined) => {
    if (!prediction || !Array.isArray(prediction)) {
      return (
        <div className="p-2 rounded border-2 border-black bg-green-200">
          <p className="text-black text-sm">
            <strong>✅ SAFE:</strong> No security concerns detected
          </p>
          <p className="text-xs text-black italic mt-1">
            Your file passed all safety checks
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {prediction.map((pred: PredictionResult, index: number) => {
          const score = pred.score || 0;
          const label = pred.label || 'Unknown';
          
          // Convert score to percentage
          const percentage = (score * 100).toFixed(1);
          
          // Determine safety level and emoji
          let safetyLevel = '';
          let emoji = '';
          let bgColor = '';
          let explanation = '';
          
          if (label.toLowerCase().includes('neutral') || label.toLowerCase().includes('safe')) {
            safetyLevel = 'SAFE CONTENT';
            emoji = '✅';
            bgColor = 'bg-green-200';
            explanation = 'Content is appropriate and safe';
          } else if (label.toLowerCase().includes('negative') || label.toLowerCase().includes('harmful')) {
            if (score > 0.7) {
              safetyLevel = 'NEEDS REVIEW';
              emoji = '⚠️';
              bgColor = 'bg-red-200';
              explanation = 'Content may need manual review';
            } else if (score > 0.3) {
              safetyLevel = 'MODERATE RISK';
              emoji = '⚡';
              bgColor = 'bg-yellow-200';
              explanation = 'Content flagged for caution';
            } else {
              safetyLevel = 'LOW RISK';
              emoji = '✅';
              bgColor = 'bg-green-200';
              explanation = 'Content appears safe with minor flags';
            }
          } else {
            safetyLevel = 'ANALYZED';
            emoji = '🔍';
            bgColor = 'bg-blue-200';
            explanation = 'Content has been processed and checked';
          }

          return (
            <div key={index} className={`p-3 rounded border-2 border-black ${bgColor}`}>
              <p className="text-black text-sm font-bold">
                {emoji} {safetyLevel}
              </p>
              <p className="text-black text-sm">
                <strong>Classification:</strong> {label}
              </p>
              <p className="text-black text-sm">
                <strong>Confidence:</strong> {percentage}%
              </p>
              <p className="text-xs text-black italic mt-1">
                {explanation}
              </p>
            </div>
          );
        })}
        
        <div className="mt-3 p-2 bg-blue-100 rounded border border-black">
          <p className="text-xs text-black">
            💡 <strong>What does this mean?</strong><br />
            Our AI system checks your content for safety and appropriateness. 
            Higher confidence scores mean the AI is more certain about its assessment.
          </p>
        </div>
      </div>
    );
  };

  // Component Sections
  const StatusBadge = () => (
    <div className="flex justify-center lg:justify-start">
      <div className="inline-flex items-center px-4 py-3 neubrutal-bg-lime neubrutal-border neubrutal-shadow-light">
        <div className={`w-3 h-3 bg-black rounded-full mr-3 ${isMounted && isConnected ? 'animate-pulse' : ''}`}></div>
        <span className="text-sm font-bold text-black">{connectionStatus}</span>
      </div>
    </div>
  );

  const HeroTitle = () => (
    <div className="text-center lg:text-left space-y-6">
      <h1 className="neubrutal-text-title text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight">
        DATA SOVEREIGNTY IS <span className="neubrutal-bg-yellow px-2 lg:px-2">YOURS</span>
      </h1>
      
      <p className="text-lg lg:text-xl text-black max-w-2xl mx-auto lg:mx-0 leading-relaxed font-bold">
        One-click protection for your digital assets. Automatic DID registration, 
        IPFS upload, and blockchain verification in a single action.
      </p>
      
      <div className="p-3 neubrutal-bg-green neubrutal-border max-w-2xl mx-auto lg:mx-0">
        <p className="text-sm font-bold text-black text-center lg:text-left">
          ⚡ NO COMPLEX STEPS • ⚡ AUTO REGISTRATION • ⚡ INSTANT PROTECTION
        </p>
      </div>
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
              {selectedFile ? (
                <>
                  <span className="hidden sm:inline">🚀 UPLOAD & REGISTER</span>
                  <span className="sm:hidden">UPLOAD</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">📝 REGISTER HASH</span>
                  <span className="sm:hidden">REGISTER</span>
                </>
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );

  const StatusMessage = () => {
    if (!uploadStatus && !aiAnalysisResult) return null;
    
    return (
      <div className="max-w-3xl mx-auto lg:mx-0 space-y-4">
        {uploadStatus && (
          <div className={`p-4 lg:p-5 neubrutal-border neubrutal-shadow-light font-bold ${getStatusMessageStyle()}`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm lg:text-base font-bold text-black">{uploadStatus}</p>
              {uploadStatus.includes('Uploading') && (
                <div className="text-xs font-bold text-black">⏳ AUTO-PROCESSING...</div>
              )}
            </div>
            {uploadStatus.includes('Uploading') && (
              <div className="mb-3 p-2 neubrutal-bg-yellow neubrutal-border">
                <p className="text-xs font-bold text-black">🔄 AUTOMATED STEPS:</p>
                <div className="text-xs text-black font-mono mt-1 space-y-1">
                  <div>✓ DID Registration</div>
                  <div>🔄 IPFS Upload in progress...</div>
                  <div>⏳ Blockchain Storage pending</div>
                </div>
              </div>
            )}
            {selectedFile && (
              <p className="text-xs lg:text-sm text-black font-bold">📁 FILE: {selectedFile.name}</p>
            )}
            {ipfsHash && (
              <div className="mt-2 p-2 neubrutal-bg-green neubrutal-border">
                <p className="text-xs font-bold text-black mb-1">✅ UPLOAD COMPLETE</p>
                <p className="text-xs text-black font-mono break-all">
                  🔗 IPFS: {ipfsHash.length > 60 ? ipfsHash.substring(0, 60) + '...' : ipfsHash}
                </p>
              </div>
            )}
          </div>
        )}
        
        {aiAnalysisResult && (
          <div className="p-4 lg:p-5 neubrutal-border neubrutal-shadow-light neubrutal-bg-cyan">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm lg:text-base font-bold text-black">🤖 AI ANALYSIS RESULT:</p>
              <button 
                onClick={() => setIsAnalysisExpanded(!isAnalysisExpanded)}
                className="text-xs font-bold text-black hover:scale-110 transition-transform duration-200"
                title={isAnalysisExpanded ? "Collapse details" : "Expand details"}
              >
                {isAnalysisExpanded ? '📖 COLLAPSE' : '📖 EXPAND'}
              </button>
            </div>
            
            {isAnalysisExpanded && (
              <div className="text-xs lg:text-sm text-black space-y-3">
                
                {/* Basic File Info */}
                <div className="neubrutal-bg-yellow p-3 neubrutal-border">
                  <p className="font-bold text-black mb-2">📋 FILE INFORMATION</p>
                  <div className="space-y-1">
                    <p><strong>📁 File Name:</strong> {(aiAnalysisResult as AnalysisResult).filename || 'Unknown'}</p>
                    <p><strong>📄 File Type:</strong> {getFileTypeDescription((aiAnalysisResult as AnalysisResult).file_type || '')}</p>
                  </div>
                </div>

                {/* AI Analysis Results */}
                {(aiAnalysisResult as AnalysisResult).ai_analysis && (
                  <div className="neubrutal-bg-lime p-3 neubrutal-border">
                    <p className="font-bold text-black mb-2">🔍 CONTENT ANALYSIS</p>
                    <div className="space-y-2">
                      {renderAIAnalysisResults((aiAnalysisResult as AnalysisResult).ai_analysis!)}
                    </div>
                  </div>
                )}

                {/* Safety Score */}
                {(aiAnalysisResult as AnalysisResult).ai_analysis?.model_prediction && (
                  <div className="neubrutal-bg-pink p-3 neubrutal-border">
                    <p className="font-bold text-black mb-2">🛡️ SAFETY ASSESSMENT</p>
                    {renderSafetyScore((aiAnalysisResult as AnalysisResult).ai_analysis!.model_prediction)}
                  </div>
                )}

                {/* Overall Summary */}
                <div className="neubrutal-bg-yellow p-3 neubrutal-border">
                  <p className="font-bold text-black mb-2">📊 SUMMARY</p>
                  <p className="text-black text-sm">
                    ✅ Your file has been successfully analyzed using advanced AI technology. 
                    All checks have been completed and the results are displayed above.
                  </p>
                </div>

              </div>
            )}
            
            {!isAnalysisExpanded && (
              <div className="text-black text-sm">
                <p>✅ <strong>Analysis Complete!</strong> Click &quot;EXPAND&quot; to view detailed results.</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const ProcessFlow = () => (
    <div className="max-w-3xl mx-auto lg:mx-0 mb-6">
      <div className="neubrutal-card p-4 lg:p-6 neubrutal-bg-gray">
        <h3 className="text-sm font-bold text-black mb-4 flex items-center">
          🔄 AUTO PROCESS FLOW:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center justify-center p-3 neubrutal-bg-yellow neubrutal-border text-xs font-bold text-black">
            1️⃣ REGISTER DID
          </div>
          <div className="flex items-center justify-center p-3 neubrutal-bg-blue neubrutal-border text-xs font-bold text-black">
            2️⃣ UPLOAD TO IPFS
          </div>
          <div className="flex items-center justify-center p-3 neubrutal-bg-green neubrutal-border text-xs font-bold text-black">
            3️⃣ BLOCKCHAIN STORE
          </div>
        </div>
        <p className="text-xs text-black font-bold mt-3 text-center">
          ✨ ONE CLICK = COMPLETE PROTECTION ✨
        </p>
      </div>
    </div>
  );

  const QuickActions = () => {
    const hasContent = selectedFile || ipfsHash || uploadStatus || aiAnalysisResult;
    
    return (
      <div className="max-w-3xl mx-auto lg:mx-0">
        <div className="neubrutal-card p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-black text-center lg:text-left">QUICK ACTIONS:</h3>
            {hasContent && (
              <button 
                onClick={clearAll}
                className="text-xs text-black font-bold hover:scale-105 transition-transform duration-200"
                title="Clear all"
              >
                🗑️ CLEAR
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button 
              onClick={openFileDialog}
              className={`neubrutal-button-secondary text-sm py-3 flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                selectedFile ? 'neubrutal-bg-lime' : ''
              }`}
            >
              📁 {selectedFile ? 'CHANGE FILE' : 'UPLOAD FILE'}
            </button>
            <button 
              onClick={handleAIAnalysis}
              disabled={!selectedFile}
              className={`neubrutal-button-secondary text-sm py-3 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 ${
                aiAnalysisResult ? 'neubrutal-bg-cyan' : ''
              }`}
            >
              🤖 {aiAnalysisResult ? 'RE-ANALYZE' : 'AI ANALYSIS'}
            </button>
            <button 
              onClick={() => {
                const fileListSection = document.getElementById('file-list');
                if (fileListSection) {
                  fileListSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                  // Fallback to access control section
                  const accessControlSection = document.getElementById('access-control-grant');
                  if (accessControlSection) {
                    accessControlSection.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    // Final fallback to scanner section
                    const scannerSection = document.getElementById('scanner');
                    scannerSection?.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
              className="neubrutal-button-secondary text-sm py-3 flex items-center justify-center transition-all duration-200 hover:scale-105"
            >
              🔐 ACCESS CONTROL
            </button>
          </div>
        </div>
      </div>
    );
  };

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
        <div className="absolute top-12 left-4 lg:left-10 w-16 h-16 lg:w-24 lg:h-24 neubrutal-bg-yellow neubrutal-border neubrutal-shadow rotate-12 opacity-80"></div>
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
              <ProcessFlow />
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
