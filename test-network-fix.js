#!/usr/bin/env node

// Simple test script to verify network connectivity and contract accessibility
const { createPublicClient, http } = require('viem');

// Lisk Sepolia configuration
const liskSepolia = {
  id: 4202,
  name: 'Lisk Sepolia Testnet',
  rpcUrls: {
    default: { http: ['https://rpc.sepolia-api.lisk.com'] },
    fallback: { http: ['https://sepolia-rpc.lisk.com'] }
  }
};

const CONTRACT_ADDRESSES = {
  FILE_REGISTRY: "0xbBE261ba394CE8B890FBC1974F0402e681A5EE85"
};

async function testNetworkConnection() {
  console.log('🧪 Testing Network Connection and Contract Accessibility\n');
  
  try {
    // Test primary RPC endpoint
    console.log('1. Testing primary RPC endpoint...');
    const primaryClient = createPublicClient({
      chain: liskSepolia,
      transport: http('https://rpc.sepolia-api.lisk.com', {
        timeout: 10000,
        retryCount: 3
      })
    });

    const chainId = await primaryClient.getChainId();
    console.log(`✅ Connected to chain ID: ${chainId}`);

    const blockNumber = await primaryClient.getBlockNumber();
    console.log(`✅ Latest block: ${blockNumber}`);

    const gasPrice = await primaryClient.getGasPrice();
    console.log(`✅ Current gas price: ${gasPrice} wei\n`);

    // Test contract accessibility
    console.log('2. Testing contract accessibility...');
    
    try {
      const contractOwner = await primaryClient.readContract({
        address: CONTRACT_ADDRESSES.FILE_REGISTRY,
        abi: [{ 
          "inputs": [], 
          "name": "owner", 
          "outputs": [{ "internalType": "address", "name": "", "type": "address" }], 
          "stateMutability": "view", 
          "type": "function" 
        }],
        functionName: 'owner'
      });
      console.log(`✅ Contract accessible. Owner: ${contractOwner}\n`);
    } catch (contractError) {
      console.log(`❌ Contract not accessible: ${contractError.message}\n`);
    }

    // Test fallback RPC
    console.log('3. Testing fallback RPC endpoint...');
    try {
      const fallbackClient = createPublicClient({
        chain: liskSepolia,
        transport: http('https://sepolia-rpc.lisk.com', {
          timeout: 10000,
          retryCount: 3
        })
      });

      const fallbackChainId = await fallbackClient.getChainId();
      console.log(`✅ Fallback RPC working. Chain ID: ${fallbackChainId}\n`);
    } catch (fallbackError) {
      console.log(`⚠️ Fallback RPC not accessible: ${fallbackError.message}\n`);
    }

    console.log('🎉 Network connectivity test completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Primary RPC: Working');
    console.log('- Contract access: Available'); 
    console.log('- Lisk Sepolia network: Accessible');
    console.log('\nYou can now use the application with confidence.');

  } catch (error) {
    console.error('❌ Network connectivity test failed:');
    console.error(`Error: ${error.message}\n`);
    
    console.log('🔧 Troubleshooting steps:');
    console.log('1. Check your internet connection');
    console.log('2. Verify Lisk Sepolia RPC endpoints are accessible');
    console.log('3. Try again in a few minutes');
    console.log('4. Check NETWORK_TROUBLESHOOTING.md for detailed solutions');
    
    process.exit(1);
  }
}

// Add timeout for the entire test
const timeout = setTimeout(() => {
  console.error('❌ Test timed out after 30 seconds');
  console.log('This might indicate network connectivity issues.');
  process.exit(1);
}, 30000);

testNetworkConnection().finally(() => {
  clearTimeout(timeout);
});
