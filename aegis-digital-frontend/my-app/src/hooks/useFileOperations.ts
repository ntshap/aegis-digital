import {
  usePublicClient,
  useAccount,
  useReadContract,
  useWriteContract,
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
      // Panggil `writeContractAsync` untuk mengirim transaksi.
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.FILE_REGISTRY,
        abi: FILE_REGISTRY_ABI,
        functionName: 'registerFile',
        args: [ipfsHash, fileName],
      });
      return hash;
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
