import {
  usePublicClient,
  useAccount,
  useReadContract,
  useWriteContract,
  useBalance,
} from 'wagmi';
import { useMutation, useQueryClient, useQueries } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  CONTRACT_ADDRESSES,
  FILE_REGISTRY_ABI
} from '../config/contracts';

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
  
  // Check user's ETH balance for gas fees
  const { data: balance } = useBalance({
    address: address,
    query: {
      enabled: isConnected && !!address,
    },
  });

  // 1. Membaca daftar file milik user saat ini.
  //    Hook ini akan secara otomatis memanggil fungsi `getFilesByOwner` dari kontrak.
  const { data: userFileIds, isLoading: isFilesLoading } = useReadContract({
    abi: FILE_REGISTRY_ABI,
    address: CONTRACT_ADDRESSES.FILE_REGISTRY,
    functionName: 'getFilesByOwner',
    args: [address as `0x${string}`],
    query: {
      enabled: isConnected && !!address, // Hanya aktifkan query jika terhubung dan alamat ada
    },
  });

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

  // 3. Mutasi untuk mendaftarkan file baru.
  const registerFileMutation = useMutation({
    mutationFn: async ({ ipfsHash, fileName }: { ipfsHash: string; fileName: string }) => {
      try {
        // Add validation
        if (!ipfsHash || !fileName) {
          throw new Error('IPFS hash and file name are required');
        }

        if (!isConnected) {
          throw new Error('Please connect your wallet first');
        }

        // Check if user has sufficient balance for gas
        if (balance && balance.value === 0n) {
          throw new Error('Insufficient ETH balance. Please add ETH to your wallet for gas fees.');
        }

        console.log('Registering file:', { ipfsHash, fileName, contractAddress: CONTRACT_ADDRESSES.FILE_REGISTRY });

        // Panggil `writeContractAsync` untuk mengirim transaksi - let the network estimate gas
        const hash = await writeContractAsync({
          address: CONTRACT_ADDRESSES.FILE_REGISTRY,
          abi: FILE_REGISTRY_ABI,
          functionName: 'registerFile',
          args: [ipfsHash, fileName],
          // Remove explicit gas limit to let the network estimate
        });
        
        console.log('Transaction hash:', hash);
        return hash;
      } catch (error: any) {
        console.error('Contract call error:', error);
        // Provide more specific error messages
        if (error.message?.includes('User rejected')) {
          throw new Error('Transaction was rejected by user');
        } else if (error.message?.includes('insufficient funds')) {
          throw new Error('Insufficient funds for gas fees. Please add ETH to your wallet.');
        } else if (error.message?.includes('JSON-RPC')) {
          throw new Error('Network error: Please check your connection to Lisk Sepolia and try again');
        } else if (error.message?.includes('execution reverted')) {
          throw new Error('Contract execution failed. Please check if the contract is deployed correctly.');
        }
        throw error;
      }
    },
    onSuccess: (txHash) => {
      toast.success('Transaksi pendaftaran file berhasil dikirim!');
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
        publicClient.waitForTransactionReceipt({ hash: txHash as `0x${string}` }).then(() => {
          toast.success('File berhasil didaftarkan di Lisk!');
        }).catch((error) => {
          console.error("Error waiting for transaction receipt:", error);
          toast.error('Gagal mengkonfirmasi transaksi.');
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
