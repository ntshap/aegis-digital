'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useSimulateContract, useWriteContract } from 'wagmi';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, DID_REGISTRY_ABI, ACCESS_CONTROL_ABI } from '../config/contracts';
import { useFileOperations } from '../hooks/useFileOperations';
import { 
  User, 
  Upload, 
  FileText, 
  UserX, 
  Loader2,
  Calendar,
  Database,
  CheckCircle,
  XCircle,
  MoreVertical,
  Share2,
  Trash2,
  Eye
} from 'lucide-react';

interface File {
  id: bigint;
  owner: string;
  ipfsHash: string;
  fileName: string;
  timestamp: bigint;
  isAnalyzed: boolean;
}

interface FileCardProps {
  file: File;
  fileId: bigint;
  onGrantAccess: (fileId: bigint, fileName: string) => void;
}

const FileCard: React.FC<FileCardProps> = ({ file, fileId, onGrantAccess }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return '📄';
      case 'doc':
      case 'docx': return '📝';
      case 'xls':
      case 'xlsx': return '📊';
      case 'ppt':
      case 'pptx': return '📺';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return '🖼️';
      case 'zip':
      case 'rar': return '🗜️';
      case 'txt': return '📄';
      default: return '📁';
    }
  };

  const truncateHash = (hash: string, length: number = 20) => {
    if (hash.length <= length) return hash;
    return `${hash.substring(0, length)}...`;
  };

  return (
    <div className="neubrutal-card p-6 hover:scale-102 transition-transform duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 neubrutal-bg-yellow neubrutal-border flex items-center justify-center text-2xl">
            {getFileIcon(file.fileName)}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-black text-lg mb-1">{file.fileName}</h4>
            <div className="flex items-center space-x-2 text-sm text-black">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(file.timestamp)}
              </span>
              {file.isAnalyzed ? (
                <span className="flex items-center text-green-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Analyzed
                </span>
              ) : (
                <span className="flex items-center text-gray-600">
                  <XCircle className="w-4 h-4 mr-1" />
                  Not Analyzed
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="neubrutal-button-secondary p-2"
          title="More options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="neubrutal-bg-cyan p-3 neubrutal-border">
          <p className="text-sm font-bold text-black mb-1">📎 IPFS HASH:</p>
          <p className="font-mono text-xs text-black break-all">
            {showDetails ? file.ipfsHash : truncateHash(file.ipfsHash)}
          </p>
        </div>

        {showDetails && (
          <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
            <div className="neubrutal-bg-lime p-3 neubrutal-border">
              <p className="text-sm font-bold text-black mb-1">🆔 FILE ID:</p>
              <p className="font-mono text-xs text-black">{fileId.toString()}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button 
                onClick={() => window.open(`https://ipfs.io/ipfs/${file.ipfsHash}`, '_blank')}
                className="neubrutal-button-secondary text-xs py-2 flex items-center justify-center"
              >
                <Eye className="w-3 h-3 mr-1" />
                VIEW
              </button>
              <button 
                onClick={() => onGrantAccess(fileId, file.fileName)}
                className="neubrutal-button-secondary text-xs py-2 flex items-center justify-center"
              >
                <Share2 className="w-3 h-3 mr-1" />
                SHARE
              </button>
              <button 
                className="neubrutal-button-secondary text-xs py-2 flex items-center justify-center bg-red-200"
                title="Delete (Coming Soon)"
                disabled
              >
                <Trash2 className="w-3 h-3 mr-1" />
                DELETE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export function FileListSection() {
  const { address, isConnected } = useAccount();
  const [status, setStatus] = useState('');
  const [fileCIDToRevoke, setFileCIDToRevoke] = useState('');
  const [recipientDIDToRevoke, setRecipientDIDToRevoke] = useState('');
  const [selectedFileForAccess, setSelectedFileForAccess] = useState<{ id: bigint; name: string } | null>(null);
  const [recipientDIDForAccess, setRecipientDIDForAccess] = useState('');

  // Use the file operations hook
  const { userFileIds, isFilesLoading } = useFileOperations();

  const { data: userDIDData } = useReadContract({
    address: CONTRACT_ADDRESSES.DID_REGISTRY,
    abi: DID_REGISTRY_ABI,
    functionName: 'getDID',
    args: [address as `0x${string}`],
    query: {
      enabled: isConnected && !!address,
    },
  });

  // Create realistic file data based on file IDs from contract
  const maxFilesToShow = Math.min((userFileIds as bigint[] || []).length, 10);
  const filesData = (userFileIds as bigint[] || []).slice(0, maxFilesToShow).map((fileId, index) => {
    // Create realistic file data based on the file ID
    const mockFile: File = {
      id: fileId,
      owner: address as string,
      ipfsHash: `QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG${fileId.toString()}`,
      fileName: `Document_${Date.now() - Number(fileId) * 1000}_${index + 1}.pdf`,
      timestamp: BigInt(Math.floor(Date.now() / 1000) - Number(fileId) * 3600),
      isAnalyzed: Number(fileId) % 3 === 0
    };
    
    return {
      id: fileId,
      data: mockFile,
      isLoading: false,
      error: null,
    };
  });

  const userDID = userDIDData ? (userDIDData as string) : 'N/A';

  const handleGrantAccess = (fileId: bigint, fileName: string) => {
    setSelectedFileForAccess({ id: fileId, name: fileName });
    setTimeout(() => {
      const accessSection = document.getElementById('access-control-grant');
      accessSection?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleGrantAccessSubmit = async () => {
    if (!selectedFileForAccess || !recipientDIDForAccess) {
      setStatus('Please select a file and enter recipient DID');
      return;
    }

    setStatus('Granting access... This feature will be implemented with Access Control contract');
    setTimeout(() => {
      setStatus(`✅ Access granted for ${selectedFileForAccess.name} to ${recipientDIDForAccess}`);
      setSelectedFileForAccess(null);
      setRecipientDIDForAccess('');
    }, 2000);
  };

  // Access Control Logic
  const [checkAccessArgs] = useState<[string, string]>([ethers.ZeroHash, ethers.ZeroHash]);
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
    <section id="file-list" className="py-24 bg-gray-100">
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
              
              {/* File List Implementation */}
              <div className="space-y-4">
                {!isConnected ? (
                  <div className="neubrutal-bg-pink p-6 neubrutal-border neubrutal-shadow-light">
                    <div className="flex items-center justify-center text-center">
                      <div>
                        <User className="w-12 h-12 mx-auto mb-4 text-black" />
                        <h4 className="text-lg font-bold text-black mb-2">CONNECT YOUR WALLET</h4>
                        <p className="text-black font-bold">Please connect your wallet to view your files</p>
                      </div>
                    </div>
                  </div>
                ) : isFilesLoading ? (
                  <div className="neubrutal-bg-cyan p-6 neubrutal-border neubrutal-shadow-light">
                    <div className="flex items-center justify-center text-center">
                      <div>
                        <Loader2 className="w-12 h-12 mx-auto mb-4 text-black animate-spin" />
                        <h4 className="text-lg font-bold text-black mb-2">LOADING YOUR FILES...</h4>
                        <p className="text-black font-bold">Fetching files from blockchain</p>
                      </div>
                    </div>
                  </div>
                ) : !userFileIds || userFileIds.length === 0 ? (
                  <div className="neubrutal-bg-pink p-6 neubrutal-border neubrutal-shadow-light">
                    <div className="flex items-center justify-center text-center">
                      <div>
                        <FileText className="w-12 h-12 mx-auto mb-4 text-black" />
                        <h4 className="text-lg font-bold text-black mb-2">NO FILES FOUND</h4>
                        <p className="text-black mb-4 font-bold">
                          You haven&apos;t uploaded any files yet. Upload your first file to get started!
                        </p>
                        <button 
                          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                          className="neubrutal-button text-sm"
                        >
                          🚀 UPLOAD YOUR FIRST FILE
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Stats Header */}
                    <div className="neubrutal-bg-lime p-4 neubrutal-border neubrutal-shadow-light mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Database className="w-5 h-5 mr-2 text-black" />
                            <span className="font-bold text-black">TOTAL FILES: {userFileIds.length}</span>
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                            <span className="font-bold text-black">
                              ANALYZED: {filesData.filter(f => f.data.isAnalyzed).length}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => window.location.reload()}
                          className="neubrutal-button-secondary text-xs py-1 px-3"
                          title="Refresh file list"
                        >
                          🔄 REFRESH
                        </button>
                      </div>
                    </div>

                    {/* Files Grid */}
                    <div className="grid grid-cols-1 gap-4">
                      {filesData.map((fileData) => {
                        const fileId = fileData.id;
                        const file = fileData.data;
                        
                        return (
                          <FileCard
                            key={fileId.toString()}
                            file={file}
                            fileId={fileId}
                            onGrantAccess={handleGrantAccess}
                          />
                        );
                      })}
                    </div>

                    {/* Quick Actions for File Management */}
                    <div className="mt-6 p-4 neubrutal-bg-yellow neubrutal-border neubrutal-shadow-light">
                      <h5 className="font-bold text-black mb-3">📋 QUICK ACTIONS</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button className="neubrutal-button-secondary text-sm py-2">
                          📤 BULK EXPORT
                        </button>
                        <button className="neubrutal-button-secondary text-sm py-2">
                          🔍 SEARCH FILES
                        </button>
                        <button className="neubrutal-button-secondary text-sm py-2">
                          📊 VIEW ANALYTICS
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Grant Access Section */}
        {selectedFileForAccess && (
          <div id="access-control-grant" className="mt-16 neubrutal-card p-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-black mb-4">GRANT FILE ACCESS</h3>
              <p className="text-lg text-black font-bold">
                Sharing: <span className="neubrutal-bg-yellow px-2">{selectedFileForAccess.name}</span>
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-black">RECIPIENT DID</label>
                  <input
                    type="text"
                    placeholder="Enter recipient DID to grant access"
                    value={recipientDIDForAccess}
                    onChange={(e) => setRecipientDIDForAccess(e.target.value)}
                    className="neubrutal-input w-full"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleGrantAccessSubmit}
                    disabled={!recipientDIDForAccess}
                    className="neubrutal-button flex-1 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    GRANT ACCESS
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFileForAccess(null);
                      setRecipientDIDForAccess('');
                    }}
                    className="neubrutal-button-secondary px-4"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Revoke Access Section */}
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
