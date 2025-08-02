import {
  usePublicClient,
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  CONTRACT_ADDRESSES,
  FILE_REGISTRY_ABI,
  ACCESS_CONTROL_ABI
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
  const fileQueries = (userFileIds as bigint[] || []).map((fileId: bigint) => {
    return {
      queryKey: ['fileData', fileId.toString()],
      queryFn: async () => {
        if (!publicClient) throw new Error('Public client not available');
        const fileData = await publicClient.readContract({
          abi: FILE_REGISTRY_ABI,
          address: CONTRACT_ADDRESSES.FILE_REGISTRY,
          functionName: 'getFile',
          args: [fileId],
        });
        return fileData as FileData;
      },
      enabled: isConnected && !!address,
    };
  });

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
    isFilesLoading,
    fileQueries,
    registerFile: registerFileMutation.mutateAsync,
    isRegistering: registerFileMutation.isPending,
  };
}
