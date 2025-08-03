import {
  usePublicClient,
  useAccount,
  useReadContract,
  useWriteContract,
  useBalance,
  useChainId,
} from 'wagmi';
import { useMutation, useQueryClient, useQueries } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  CONTRACT_ADDRESSES,
  FILE_REGISTRY_ABI
} from '../config/contracts';
import { getNetworkInfo, validateNetwork, formatContractError } from '../utils/networkUtils';

interface FileData {
  owner: string;
  ipfsHash: string;
  fileName: string;
  timestamp: bigint;
  isAnalyzed: boolean;
}

/**
 * @notice Sebuah React hook kustom untuk mengabstraksi semua operasi file on-chain.
 * Ini adalah implementasi terbaik untuk WAGMI.
 */
export function useFileOperations() {
  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  const chainId = useChainId();
  
  // Check user's ETH balance for gas fees
  const { data: balance } = useBalance({
    address: address,
    query: {
      enabled: isConnected && !!address,
    },
  });

  // 1. Membaca daftar file milik user saat ini.
  //    Hook ini akan secara otomatis memanggil fungsi `getFilesByOwner` dari kontrak.
  const { data: userFileIds, isLoading: isFilesLoading, error: fileIdsError } = useReadContract({
    abi: FILE_REGISTRY_ABI,
    address: CONTRACT_ADDRESSES.FILE_REGISTRY,
    functionName: 'getFilesByOwner',
    args: [address as `0x${string}`],
    query: {
      enabled: isConnected && !!address, // Hanya aktifkan query jika terhubung dan alamat ada
    },
  });

  // Debug logging only in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Debug - File operations state:', {
      isConnected,
      address,
      userFileIds,
      isFilesLoading,
      fileIdsError,
      contractAddress: CONTRACT_ADDRESSES.FILE_REGISTRY
    });
  }

  // 2. Memuat detail setiap file secara paralel.
  //    Ini adalah cara efisien untuk mengambil data on-chain.
  const fileQueries = useQueries({
    queries: (userFileIds as bigint[] || []).map((fileId: bigint) => ({
      queryKey: ['fileData', fileId.toString()],
      queryFn: async () => {
        if (!publicClient) throw new Error('Public client not available');
        const fileData = await publicClient.readContract({
          abi: FILE_REGISTRY_ABI,
          address: CONTRACT_ADDRESSES.FILE_REGISTRY,
          functionName: 'getFile',
          args: [fileId],
        });
        return { id: fileId, ...fileData } as FileData & { id: bigint };
      },
      enabled: isConnected && !!address,
    })),
  });

  // Transform file data for easier consumption
  const userFiles = fileQueries.map((query, index) => ({
    id: (userFileIds as bigint[])?.[index] || BigInt(0),
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  }));

  // Debug logging only in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Debug - File queries state:', {
      fileQueriesLength: fileQueries.length,
      userFiles: userFiles.map(file => ({
        id: file.id.toString(),
        hasData: !!file.data,
        isLoading: file.isLoading,
        error: file.error?.message
      }))
    });
  }

  // 3. Mutasi untuk mendaftarkan file baru.
  const registerFileMutation = useMutation({
    mutationFn: async ({ ipfsHash, fileName }: { ipfsHash: string; fileName: string }) => {
      try {
        // Basic validation
        if (!ipfsHash || !fileName) {
          throw new Error('IPFS hash and file name are required');
        }

        if (!isConnected || !address) {
          throw new Error('Please connect your wallet first');
        }

        if (!publicClient) {
          throw new Error('Network client not available. Please check your connection.');
        }

        // Validate network with retry logic
        let networkValidated = false;
        let retryCount = 0;
        const maxRetries = 3;
        
        while (!networkValidated && retryCount < maxRetries) {
          try {
            validateNetwork(chainId);
            networkValidated = true;
          } catch (networkError: any) {
            retryCount++;
            if (retryCount >= maxRetries) {
              throw new Error(`Network validation failed after ${maxRetries} attempts. ${networkError.message}`);
            }
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          }
        }

        // Get network info with retry logic
        let networkInfo;
        retryCount = 0;
        
        while (!networkInfo && retryCount < maxRetries) {
          try {
            networkInfo = await getNetworkInfo(publicClient);
            console.log('Network info:', networkInfo);
            
            if (!networkInfo.isLiskSepolia) {
              throw new Error('Please switch to Lisk Sepolia Testnet');
            }
            break;
          } catch (networkError: any) {
            retryCount++;
            console.error(`Network info attempt ${retryCount}:`, networkError);
            
            if (retryCount >= maxRetries) {
              throw new Error('Failed to verify network connection after multiple attempts. Please check your wallet connection and network settings.');
            }
            
            // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount - 1)));
          }
        }

        // Validate IPFS hash format
        if (!ipfsHash.startsWith('Qm') && !ipfsHash.startsWith('bafy')) {
          throw new Error('Invalid IPFS hash format. Hash should start with "Qm" or "bafy"');
        }

        // Validate file name
        if (fileName.trim().length === 0) {
          throw new Error('File name cannot be empty');
        }

        if (fileName.length > 255) {
          throw new Error('File name is too long (maximum 255 characters)');
        }

        // Check if user has sufficient balance for gas (minimum 0.002 ETH for safety)
        const minGasBalance = BigInt('2000000000000000'); // 0.002 ETH in wei
        if (balance && balance.value < minGasBalance) {
          throw new Error('Insufficient ETH balance. Please add at least 0.002 ETH to your wallet for gas fees.');
        }

        console.log('Registering file:', { 
          ipfsHash, 
          fileName, 
          contractAddress: CONTRACT_ADDRESSES.FILE_REGISTRY,
          userAddress: address,
          chainId 
        });

        // Verify contract accessibility with retry
        retryCount = 0;
        let contractVerified = false;
        
        while (!contractVerified && retryCount < maxRetries) {
          try {
            const contractOwner = await publicClient.readContract({
              address: CONTRACT_ADDRESSES.FILE_REGISTRY,
              abi: [{ "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }],
              functionName: 'owner'
            });
            console.log('Contract owner verified:', contractOwner);
            contractVerified = true;
          } catch (contractError: any) {
            retryCount++;
            console.error(`Contract verification attempt ${retryCount}:`, contractError);
            
            if (retryCount >= maxRetries) {
              throw new Error('Contract is not accessible after multiple attempts. Please check if you are connected to Lisk Sepolia network.');
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          }
        }

        // Simulate the transaction to catch any contract-level issues
        let simulationResult;
        retryCount = 0;
        
        while (!simulationResult && retryCount < maxRetries) {
          try {
            simulationResult = await publicClient.simulateContract({
              address: CONTRACT_ADDRESSES.FILE_REGISTRY,
              abi: FILE_REGISTRY_ABI,
              functionName: 'registerFile',
              args: [ipfsHash, fileName],
              account: address,
            });
            console.log('Contract simulation successful:', simulationResult);
            break;
          } catch (simulationError: any) {
            retryCount++;
            console.error(`Simulation attempt ${retryCount}:`, simulationError);
            
            if (retryCount >= maxRetries) {
              throw new Error(formatContractError(simulationError));
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          }
        }

        // If simulation passed, proceed with the actual transaction
        const hash = await writeContractAsync({
          address: CONTRACT_ADDRESSES.FILE_REGISTRY,
          abi: FILE_REGISTRY_ABI,
          functionName: 'registerFile',
          args: [ipfsHash, fileName],
          account: address,
        });
        
        console.log('Transaction hash:', hash);
        return hash;
      } catch (error: any) {
        console.error('Contract call error:', error);
        
        // Use the utility function to format the error
        const formattedError = formatContractError(error);
        throw new Error(formattedError);
      }
    },
    onSuccess: (txHash) => {
      toast.success('Transaction submitted successfully! Waiting for confirmation...');
      console.log('Transaction submitted:', txHash);
      
      // Invalidasi cache untuk memperbarui daftar file secara otomatis.
      queryClient.invalidateQueries({ queryKey: ['fileData'] });
      if (address) {
        queryClient.invalidateQueries({ 
          queryKey: [
            'contract',
            'read',
            CONTRACT_ADDRESSES.FILE_REGISTRY,
            'getFilesByOwner',
            [address]
          ]
        });
      }
      
      // Gunakan useWaitForTransactionReceipt untuk menunggu konfirmasi.
      if (publicClient) {
        publicClient.waitForTransactionReceipt({ 
          hash: txHash as `0x${string}`,
          timeout: 60000 // 60 second timeout
        }).then((receipt) => {
          if (receipt.status === 'success') {
            toast.success('File successfully registered on Lisk blockchain!');
            // Invalidate queries again after confirmation to refresh the file list
            queryClient.invalidateQueries({ queryKey: ['fileData'] });
            if (address) {
              queryClient.invalidateQueries({ 
                queryKey: [
                  'contract',
                  'read',
                  CONTRACT_ADDRESSES.FILE_REGISTRY,
                  'getFilesByOwner',
                  [address]
                ]
              });
            }
          } else {
            toast.error('Transaction failed during execution');
          }
        }).catch((error) => {
          console.error("Error waiting for transaction receipt:", error);
          if (error.message?.includes('timeout')) {
            toast.warning('Transaction is taking longer than expected. It may still complete successfully.');
          } else {
            toast.error('Failed to confirm transaction. Please check the transaction status manually.');
          }
        });
      }
    },
    onError: (error) => {
      console.error('Error saat mendaftarkan file:', error);
      toast.error(`Gagal mendaftarkan file: ${error.message}`);
    },
  });

  return {
    userFileIds,
    userFiles,
    isFilesLoading,
    registerFile: registerFileMutation.mutateAsync,
    isRegistering: registerFileMutation.isPending,
  };
}
