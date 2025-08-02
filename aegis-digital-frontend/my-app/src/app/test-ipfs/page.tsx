'use client';

import { useState } from 'react';
import { IPFSService } from '../../services/ipfs';

export default function TestIPFS() {
  const [status, setStatus] = useState('Ready to test IPFS');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleTestUpload = async () => {
    if (!selectedFile) {
      setStatus('Please select a file first');
      return;
    }

    try {
      setStatus('Testing IPFS upload...');
      const cid = await IPFSService.uploadFile(selectedFile);
      setStatus(`Success! File uploaded to IPFS: ${cid}`);
    } catch (error) {
      setStatus(`Error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-bold">IPFS Test Page</h1>
        
        <div>
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <button
          onClick={handleTestUpload}
          disabled={!selectedFile}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Test IPFS Upload
        </button>

        <div className="mt-4 p-4 bg-gray-800 rounded">
          <p className="text-sm">{status}</p>
        </div>
      </div>
    </div>
  );
}
