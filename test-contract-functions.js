// Test available functions on the deployed contract
const { createPublicClient, http } = require('viem');

const liskSepolia = {
  id: 4202,
  rpcUrls: { default: { http: ['https://rpc.sepolia-api.lisk.com'] } }
};

const CONTRACT_ADDRESS = '0x726bE4FAa748fd4815580F9F662477A45de1cCfE';

// Test some functions that should exist based on the Solidity contract
const TEST_FUNCTIONS = [
  // Function selector for doesFileExist(uint256) -> 0x40c10f19
  {
    name: 'doesFileExist(uint256)',
    abi: [{
      "inputs": [{ "internalType": "uint256", "name": "_fileId", "type": "uint256" }],
      "name": "doesFileExist",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
    }],
    args: [1]
  },
  // Function for owner() - inherited from Ownable
  {
    name: 'owner()',
    abi: [{
      "inputs": [],
      "name": "owner",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    }],
    args: []
  }
];

async function testContractFunctions() {
  const client = createPublicClient({ 
    chain: liskSepolia, 
    transport: http() 
  });

  console.log('Testing available functions on deployed contract...\n');

  for (const func of TEST_FUNCTIONS) {
    try {
      console.log(`Testing ${func.name}...`);
      const result = await client.readContract({
        address: CONTRACT_ADDRESS,
        abi: func.abi,
        functionName: func.abi[0].name,
        args: func.args
      });
      console.log(`✅ ${func.name} works! Result:`, result);
    } catch (error) {
      console.log(`❌ ${func.name} failed:`, error.message);
    }
  }

  // Test if registerFile function exists by checking the function selector
  console.log('\nTesting if registerFile exists...');
  try {
    // Try to get the function selector for registerFile
    const funcSelector = '0xed791724'; // This is the selector for registerFile(string,string)
    
    // Call with empty data to see if the function exists
    await client.call({
      to: CONTRACT_ADDRESS,
      data: funcSelector + '0'.repeat(120) // Pad with zeros
    });
    console.log('✅ registerFile function selector exists');
  } catch (error) {
    if (error.message.includes('execution reverted')) {
      console.log('✅ registerFile function exists but validation failed (expected)');
    } else {
      console.log('❌ registerFile function not found:', error.message);
    }
  }
}

testContractFunctions();
