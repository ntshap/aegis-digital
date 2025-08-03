import { PublicClient } from 'viem';

export interface NetworkInfo {
  chainId: number;
  blockNumber: bigint;
  isLiskSepolia: boolean;
  gasPrice: bigint;
}

/**
 * Utility function to check network connectivity and chain information
 */
export async function getNetworkInfo(publicClient: PublicClient): Promise<NetworkInfo> {
  try {
    // Add timeout and retry logic
    const timeout = 15000; // 15 seconds
    const retryCount = 3;
    
    for (let attempt = 1; attempt <= retryCount; attempt++) {
      try {
        const result = await Promise.race([
          Promise.all([
            publicClient.getChainId(),
            publicClient.getBlockNumber(),
            publicClient.getGasPrice(),
          ]),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Network request timeout')), timeout)
          )
        ]);

        const [chainId, blockNumber, gasPrice] = result;

        return {
          chainId: chainId as number,
          blockNumber: blockNumber as bigint,
          isLiskSepolia: (chainId as number) === 4202,
          gasPrice: gasPrice as bigint,
        };
      } catch (attemptError: any) {
        console.error(`Network info attempt ${attempt}/${retryCount} failed:`, attemptError);
        
        if (attempt === retryCount) {
          throw attemptError;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
      }
    }
    
    throw new Error('All network attempts failed');
  } catch (error: any) {
    console.error('Failed to get network info:', error);
    
    if (error.message?.includes('timeout')) {
      throw new Error('Network connection timeout. Please check your internet connection and try again.');
    }
    
    if (error.message?.includes('fetch')) {
      throw new Error('Unable to connect to Lisk Sepolia network. Please check your wallet network settings.');
    }
    
    throw new Error('Network connection failed. Please check your internet connection and wallet network settings.');
  }
}

/**
 * Validate if the user is connected to the correct network
 */
export function validateNetwork(chainId: number): void {
  if (chainId !== 4202) {
    throw new Error(`Wrong network. Please switch to Lisk Sepolia Testnet (Chain ID: 4202). Current chain ID: ${chainId}`);
  }
}

/**
 * Format error messages for better user experience
 */
export function formatContractError(error: any): string {
  const message = error.message || error.toString();
  
  // Check for common error patterns
  if (message.includes('Internal JSON-RPC error') || message.includes('Network connection error')) {
    return 'Network connection error. Please check your connection to Lisk Sepolia and try again.';
  }
  
  if (message.includes('timeout') || message.includes('Request timeout')) {
    return 'Network request timeout. Please check your internet connection and try again.';
  }
  
  if (message.includes('failed to fetch') || message.includes('fetch')) {
    return 'Unable to connect to the network. Please check your wallet connection and network settings.';
  }
  
  if (message.includes('execution reverted')) {
    if (message.includes('File name cannot be empty')) {
      return 'File name cannot be empty.';
    }
    if (message.includes('IPFS hash cannot be empty')) {
      return 'IPFS hash cannot be empty.';
    }
    if (message.includes('File already exists')) {
      return 'This file has already been registered.';
    }
    return 'Contract execution failed. Please check your input values.';
  }
  
  if (message.includes('insufficient funds')) {
    return 'Insufficient ETH balance for gas fees. Please add ETH to your wallet.';
  }
  
  if (message.includes('User rejected') || message.includes('User denied')) {
    return 'Transaction was rejected by user.';
  }
  
  if (message.includes('nonce')) {
    return 'Transaction nonce error. Please reset your wallet or try again.';
  }
  
  if (message.includes('gas')) {
    return 'Gas estimation failed. Please try again or contact support.';
  }
  
  if (message.includes('network validation failed') || message.includes('Wrong network')) {
    return 'Please switch to Lisk Sepolia Testnet in your wallet.';
  }
  
  if (message.includes('Contract is not accessible')) {
    return 'Unable to connect to the smart contract. Please check your network connection.';
  }
  
  return message.length > 100 ? 'An error occurred. Please try again or contact support.' : message;
}
