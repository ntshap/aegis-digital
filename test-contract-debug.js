// Test script to verify contract functionality
// Run this with: node test-contract.js

const { createPublicClient, http, createWalletClient, parseEther } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');

// Lisk Sepolia configuration
const liskSepolia = {
  id: 4202,
  name: 'Lisk Sepolia Testnet',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.sepolia-api.lisk.com'] },
  },
  testnet: true,
};

const CONTRACT_ADDRESS = '0x726bE4FAa748fd4815580F9F662477A45de1cCfE';

// Basic ABI for testing
const ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_ipfsHash", "type": "string" },
      { "internalType": "string", "name": "_fileName", "type": "string" }
    ],
    "name": "registerFile",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "_fileIdCounter",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

async function testContract() {
  try {
    console.log('🔗 Connecting to Lisk Sepolia...');
    
    // Create public client
    const publicClient = createPublicClient({
      chain: liskSepolia,
      transport: http(),
    });

    // Test basic connectivity
    const blockNumber = await publicClient.getBlockNumber();
    console.log('✅ Connected! Latest block:', blockNumber.toString());

    const chainId = await publicClient.getChainId();
    console.log('✅ Chain ID:', chainId);

    // Test contract read operation
    try {
      console.log('📖 Testing contract read operation...');
      const counter = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: '_fileIdCounter',
      });
      console.log('✅ Contract is accessible! Current file counter:', counter.toString());
    } catch (readError) {
      console.error('❌ Contract read failed:', readError.message);
      return;
    }

    // Test contract simulation (this will tell us if registerFile would work)
    try {
      console.log('🧪 Testing contract simulation...');
      
      // Use a dummy account for simulation
      const testAccount = privateKeyToAccount('0x1234567890123456789012345678901234567890123456789012345678901234');
      
      const result = await publicClient.simulateContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'registerFile',
        args: ['QmTestHash123', 'test-file.txt'],
        account: testAccount.address,
      });
      
      console.log('✅ Contract simulation successful!');
      console.log('   Expected result:', result.result.toString());
      
    } catch (simError) {
      console.error('❌ Contract simulation failed:', simError.message);
      if (simError.message.includes('execution reverted')) {
        console.log('   This could indicate a contract validation issue');
      }
    }

    console.log('\n🎉 Contract test completed!');
    console.log('If simulation was successful, the contract is working properly.');
    console.log('If you\'re still getting errors, the issue might be:');
    console.log('1. Wallet connection/network issues');
    console.log('2. Gas estimation problems');
    console.log('3. Transaction signing issues');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testContract();
}

module.exports = { testContract };
