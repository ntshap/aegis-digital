#!/usr/bin/env node

// Debug script to check files on blockchain for a specific address
const { createPublicClient, http } = require('viem');

// Contract configuration
const CONTRACT_ADDRESSES = {
  FILE_REGISTRY: "0xbBE261ba394CE8B890FBC1974F0402e681A5EE85"
};

// Minimal ABI for file operations
const FILE_REGISTRY_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
    "name": "getFilesByOwner",
    "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "fileId", "type": "uint256" }],
    "name": "getFile",
    "outputs": [
      { "internalType": "address", "name": "owner", "type": "address" },
      { "internalType": "string", "name": "ipfsHash", "type": "string" },
      { "internalType": "string", "name": "fileName", "type": "string" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
      { "internalType": "bool", "name": "isAnalyzed", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "fileCounter",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

// Lisk Sepolia configuration
const liskSepolia = {
  id: 4202,
  name: 'Lisk Sepolia Testnet',
  rpcUrls: {
    default: { http: ['https://rpc.sepolia-api.lisk.com'] }
  }
};

async function debugUserFiles(walletAddress) {
  console.log('🔍 Debugging User Files on Blockchain\n');
  
  if (!walletAddress) {
    console.error('❌ Please provide a wallet address as an argument');
    console.log('Usage: node debug-files.js <wallet_address>');
    process.exit(1);
  }

  try {
    const publicClient = createPublicClient({
      chain: liskSepolia,
      transport: http('https://rpc.sepolia-api.lisk.com', {
        timeout: 10000,
        retryCount: 3
      })
    });

    console.log(`👤 Checking files for address: ${walletAddress}\n`);

    // 1. Check total files in contract
    console.log('1. Checking contract file counter...');
    const totalFiles = await publicClient.readContract({
      address: CONTRACT_ADDRESSES.FILE_REGISTRY,
      abi: FILE_REGISTRY_ABI,
      functionName: 'fileCounter'
    });
    console.log(`📊 Total files in contract: ${totalFiles}\n`);

    // 2. Get user's file IDs
    console.log('2. Getting user file IDs...');
    const userFileIds = await publicClient.readContract({
      address: CONTRACT_ADDRESSES.FILE_REGISTRY,
      abi: FILE_REGISTRY_ABI,
      functionName: 'getFilesByOwner',
      args: [walletAddress]
    });
    
    console.log(`📁 User has ${userFileIds.length} file(s) registered`);
    console.log(`File IDs: ${userFileIds.join(', ')}\n`);

    if (userFileIds.length === 0) {
      console.log('❌ No files found for this address');
      console.log('Possible reasons:');
      console.log('- Files were not successfully registered');
      console.log('- Transaction failed or was not confirmed');
      console.log('- Wrong wallet address');
      console.log('- Network issues during registration');
      return;
    }

    // 3. Get details for each file
    console.log('3. Getting file details...\n');
    for (let i = 0; i < userFileIds.length; i++) {
      const fileId = userFileIds[i];
      try {
        const fileData = await publicClient.readContract({
          address: CONTRACT_ADDRESSES.FILE_REGISTRY,
          abi: FILE_REGISTRY_ABI,
          functionName: 'getFile',
          args: [fileId]
        });

        const [owner, ipfsHash, fileName, timestamp, isAnalyzed] = fileData;
        const date = new Date(Number(timestamp) * 1000);

        console.log(`📄 File ${i + 1} (ID: ${fileId}):`);
        console.log(`   Owner: ${owner}`);
        console.log(`   File Name: ${fileName}`);
        console.log(`   IPFS Hash: ${ipfsHash}`);
        console.log(`   Timestamp: ${date.toLocaleString()}`);
        console.log(`   Analyzed: ${isAnalyzed ? 'Yes' : 'No'}`);
        console.log('');
      } catch (error) {
        console.error(`❌ Error getting file ${fileId}: ${error.message}`);
      }
    }

    console.log('✅ File debugging completed successfully!');

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('- Check if the wallet address is valid');
    console.log('- Ensure you are connected to Lisk Sepolia');
    console.log('- Try again in a few minutes');
  }
}

// Get wallet address from command line argument
const walletAddress = process.argv[2];
debugUserFiles(walletAddress);
