'use client';

import { useAccount } from 'wagmi';
import { useFileOperations } from '../hooks/useFileOperations';
import { useEffect, useState } from 'react';

export default function FileDebugInfo() {
  const { address, isConnected } = useAccount();
  const { userFileIds, userFiles, isFilesLoading } = useFileOperations();
  const [isClient, setIsClient] = useState(false);

  // Fix hydration mismatch by only rendering after client mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything during SSR to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className="bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded mb-4">
        <strong className="font-bold">Debug Info: </strong>
        <span>Loading...</span>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
        <strong className="font-bold">Debug Info: </strong>
        <span>Wallet not connected</span>
      </div>
    );
  }

  return (
    <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
      <strong className="font-bold">Debug Information:</strong>
      <div className="mt-2 text-sm">
        <p><strong>Wallet Address:</strong> {address}</p>
        <p><strong>Connected:</strong> {isConnected ? 'Yes' : 'No'}</p>
        <p><strong>Loading Files:</strong> {isFilesLoading ? 'Yes' : 'No'}</p>
        <p><strong>File IDs from Contract:</strong> {userFileIds ? userFileIds.map(id => id.toString()).join(', ') : 'None'}</p>
        <p><strong>Files Count:</strong> {userFiles ? userFiles.length : 0}</p>
        <p><strong>Valid Files:</strong> {userFiles ? userFiles.filter(f => f.data && !f.isLoading && !f.error).length : 0}</p>
        
        {userFiles && userFiles.length > 0 && (
          <div className="mt-2">
            <p><strong>File Details:</strong></p>
            {userFiles.map((file, index) => (
              <div key={index} className="ml-4 mt-1">
                <p>File {index + 1}: ID={file.id.toString()}, HasData={!!file.data}, Loading={file.isLoading}, Error={file.error?.message || 'None'}</p>
                {file.data && (
                  <p className="ml-4">Name: {(file.data as any).fileName}, IPFS: {(file.data as any).ipfsHash}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
