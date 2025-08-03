// Test script to verify contract deployment
import { createPublicClient, http } from 'viem';
import { defineChain } from 'viem';
import { CONTRACT_ADDRESSES, FILE_REGISTRY_ABI } from '../src/config/contracts';

const liskSepolia = defineChain({
  id: 4202,
  name: 'Lisk Sepolia Testnet',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.sepolia-api.lisk.com'] },
  },
  blockExplorers: {
    default: { name: 'Lisk Sepolia Blockscout', url: 'https://sepolia-blockscout.lisk.com' },
  },
  testnet: true,
});

const publicClient = createPublicClient({
  chain: liskSepolia,
  transport: http(),
});

async function testContractDeployment() {
  try {
    console.log('Testing contract deployment...');
    console.log('Contract address:', CONTRACT_ADDRESSES.FILE_REGISTRY);
    
    // Try to get contract code
    const code = await publicClient.getBytecode({
      address: CONTRACT_ADDRESSES.FILE_REGISTRY,
    });
    
    if (code) {
      console.log('✅ Contract is deployed! Code length:', code.length);
    } else {
      console.log('❌ Contract not found or not deployed');
      return;
    }
    
    // Try to call a view function
    const fileCount = await publicClient.readContract({
      address: CONTRACT_ADDRESSES.FILE_REGISTRY,
      abi: FILE_REGISTRY_ABI,
      functionName: 'getFilesByOwner',
      args: ['0x0000000000000000000000000000000000000000'],
    });
    
    console.log('✅ Contract is responsive! Test call result:', fileCount);
    
  } catch (error) {
    console.error('❌ Contract test failed:', error);
  }
}

testContractDeployment();
