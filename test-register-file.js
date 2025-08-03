// Simplified contract test
const { createPublicClient, http } = require('viem');

const liskSepolia = {
  id: 4202,
  rpcUrls: { default: { http: ['https://rpc.sepolia-api.lisk.com'] } }
};

const CONTRACT_ADDRESS = '0x726bE4FAa748fd4815580F9F662477A45de1cCfE';

// Just the registerFile function ABI
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
  }
];

async function testRegisterFile() {
  const client = createPublicClient({ 
    chain: liskSepolia, 
    transport: http() 
  });

  try {
    console.log('Testing registerFile simulation...');
    
    // Test with the same values that are failing
    const result = await client.simulateContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'registerFile',
      args: ['Qmtgn2q2nqwq97tvracko1e3', '01_penting.docx'],
      account: '0x15c4204BE876940b1ad12e2081A5464272E289fd' // The address from the error
    });
    
    console.log('✅ Simulation successful!');
    console.log('Expected file ID:', result.result.toString());
    
  } catch (error) {
    console.error('❌ Simulation failed:', error.message);
    console.error('Full error:', error);
  }
}

testRegisterFile();
