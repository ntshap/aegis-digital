// Test the newly deployed contract
const { createPublicClient, http } = require('viem');

const liskSepolia = {
  id: 4202,
  rpcUrls: { default: { http: ['https://rpc.sepolia-api.lisk.com'] } }
};

const CONTRACT_ADDRESS = '0xbBE261ba394CE8B890FBC1974F0402e681A5EE85'; // New contract address

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
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  }
];

async function testNewContract() {
  const client = createPublicClient({ 
    chain: liskSepolia, 
    transport: http() 
  });

  console.log('Testing newly deployed contract...\n');

  // Test owner function
  try {
    const owner = await client.readContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'owner'
    });
    console.log('✅ Owner function works! Owner:', owner);
  } catch (error) {
    console.log('❌ Owner function failed:', error.message);
    return;
  }

  // Test registerFile simulation
  try {
    console.log('\nTesting registerFile simulation...');
    const result = await client.simulateContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'registerFile',
      args: ['Qmtgn2q2nqwq97tvracko1e3', '01_penting.docx'],
      account: '0x15c4204BE876940b1ad12e2081A5464272E289fd'
    });
    
    console.log('✅ registerFile simulation successful!');
    console.log('Expected file ID:', result.result.toString());
    
  } catch (error) {
    console.log('❌ registerFile simulation failed:', error.message);
  }
}

testNewContract();
