'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { ethers } from 'ethers';

// Contract addresses
const DID_REGISTRY_CONTRACT_ADDRESS = "0xfDF4F55ED02888d61E511Aa167cCd7F3Bfb071ea" as `0x${string}`;
const FILE_REGISTRY_CONTRACT_ADDRESS = "0x71078a67285B31d1AD54Fa7f907E555840aCa6E2" as `0x${string}`;
const ACCESS_CONTROL_CONTRACT_ADDRESS = "0x7E75F2E744f558621C39DE3a8F50b2da152C09Bf" as `0x${string}`;

// ABIs (same as in FileUploadSection)
const DID_REGISTRY_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "userAddress",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "did",
        "type": "bytes32"
      }
    ],
    "name": "DIDRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "didToAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_did",
        "type": "bytes32"
      }
    ],
    "name": "getAddressFromDID",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_userAddress",
        "type": "address"
      }
    ],
    "name": "getDID",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "registerDID",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "userDIDs",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const ACCESS_CONTROL_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_fileRegistryAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_didRegistryAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "fileCID",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "requesterDID",
        "type": "bytes32"
      }
    ],
    "name": "AccessGranted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "fileCID",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "requesterDID",
        "type": "bytes32"
      }
    ],
    "name": "AccessRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "accessControl",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "didRegistry",
    "outputs": [
      {
        "internalType": "contract AegisDIDRegistry",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "fileRegistry",
    "outputs": [
      {
        "internalType": "contract AegisFileRegistry",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_fileCID",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "_requesterDID",
        "type": "bytes32"
      }
    ],
    "name": "grantAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_fileCID",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "_requesterDID",
        "type": "bytes32"
      }
    ],
    "name": "hasAccess",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_fileCID",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "_requesterDID",
        "type": "bytes32"
      }
    ],
    "name": "revokeAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

interface File {
  cid: string;
  ownerDID: string;
  timestamp: string;
}

export function FileListSection() {
  const { address, isConnected } = useAccount();
  const [status, setStatus] = useState('');
  const [fileList, setFileList] = useState<File[]>([]);
  const [fileCIDToRevoke, setFileCIDToRevoke] = useState('');
  const [recipientDIDToRevoke, setRecipientDIDToRevoke] = useState('');

  // Wagmi v2 hooks
  const { writeContract: writeContractAccess } = useWriteContract();

  // Read user DID
  const { data: userDIDData } = useReadContract({
    address: DID_REGISTRY_CONTRACT_ADDRESS,
    abi: DID_REGISTRY_ABI,
    functionName: 'getDID',
    args: [address as `0x${string}`],
    query: {
      enabled: isConnected && !!address,
    },
  });

  // Convert bytes32 to string for display
  const userDID = userDIDData ? ethers.decodeBytes32String(userDIDData as ethers.BytesLike) : 'N/A';

  const handleRevokeAccess = async () => {
    if (!isConnected || !fileCIDToRevoke || !recipientDIDToRevoke) {
      setStatus('Harap masukkan File CID dan Recipient DID.');
      return;
    }
    setStatus('Mencabut akses...');
    try {
      const fileCIDBytes32 = ethers.encodeBytes32String(fileCIDToRevoke.slice(0, 31));
      const recipientDIDBytes32 = ethers.encodeBytes32String(recipientDIDToRevoke);

      await writeContractAccess({
        address: ACCESS_CONTROL_CONTRACT_ADDRESS,
        abi: ACCESS_CONTROL_ABI,
        functionName: 'revokeAccess',
        args: [fileCIDBytes32, recipientDIDBytes32],
      });

      setStatus('Akses berhasil dicabut. Transaksi terkirim. Harap konfirmasi di MetaMask.');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setStatus(`Pencabutan akses gagal: ${errorMessage}`);
      console.error("Pencabutan akses gagal:", error);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-lg text-gray-300">DID Anda: <span className="font-mono text-purple-200">{userDID}</span></p>

      <div className="bg-gray-700 p-6 rounded-lg shadow-inner space-y-4">
        <h3 className="text-xl font-semibold text-pink-300">Daftar File Anda</h3>
        <p className="text-gray-300">Fitur ini akan menampilkan file-file yang telah Anda unggah ke sistem.</p>
        <div className="bg-gray-600 p-4 rounded-lg">
          <p className="text-gray-200">Daftar file akan ditampilkan di sini setelah implementasi lengkap.</p>
        </div>
      </div>

      <div className="border-t border-gray-600 pt-6 mt-6 space-y-4">
        <h3 className="text-2xl font-semibold text-pink-300">Cabut Akses File</h3>
        <input
          type="text"
          placeholder="File CID (file yang ingin dicabut aksesnya)"
          value={fileCIDToRevoke}
          onChange={(e) => setFileCIDToRevoke(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="text"
          placeholder="Recipient DID (user yang akan dicabut aksesnya)"
          value={recipientDIDToRevoke}
          onChange={(e) => setRecipientDIDToRevoke(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleRevokeAccess}
          disabled={!isConnected || !fileCIDToRevoke || !recipientDIDToRevoke}
          className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cabut Akses
        </button>
        {status && <p className="text-sm mt-2 text-gray-200">{status}</p>}
      </div>
    </div>
  );
}
