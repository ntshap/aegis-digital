// Test with different parameter values to identify the issue
const { createPublicClient, http } = require('viem');

const liskSepolia = {
  id: 4202,
  rpcUrls: { default: { http: ['https://rpc.sepolia-api.lisk.com'] } }
};

const CONTRACT_ADDRESS = '0x726bE4FAa748fd4815580F9F662477A45de1cCfE';

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

async function testDifferentParameters() {
  const client = createPublicClient({ 
    chain: liskSepolia, 
    transport: http() 
  });

  const testCases = [
    { hash: 'QmTest123', name: 'test.txt', description: 'Simple test' },
    { hash: 'Qm' + 'a'.repeat(44), name: 'a', description: 'Short name' },
    { hash: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG', name: 'document.pdf', description: 'Valid IPFS hash' },
    { hash: 'Qmtgn2q2nqwq97tvracko1e3', name: '01_penting.docx', description: 'Original failing case' }
  ];

  for (const testCase of testCases) {
    console.log(`\nTesting: ${testCase.description}`);
    console.log(`Hash: ${testCase.hash}, Name: ${testCase.name}`);
    
    try {
      // Try with a higher gas limit
      const result = await client.simulateContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'registerFile',
        args: [testCase.hash, testCase.name],
        account: '0x15c4204BE876940b1ad12e2081A5464272E289fd',
        gas: 500000n  // Explicit gas limit
      });
      
      console.log('✅ Success! Expected file ID:', result.result.toString());
      
    } catch (error) {
      console.log('❌ Failed:', error.message);
      
      // Try to get more detailed error info
      if (error.details) {
        console.log('   Details:', error.details);
      }
    }
  }
}

testDifferentParameters();
