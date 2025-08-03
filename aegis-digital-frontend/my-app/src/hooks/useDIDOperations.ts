import {
  useAccount,
  useReadContract,
  useWriteContract
} from 'wagmi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Import ABI dan alamat kontrak yang benar dari config
import { DID_REGISTRY_ABI, CONTRACT_ADDRESSES } from '../config/contracts';

/**
 * @notice Sebuah React hook kustom untuk mengabstraksi semua operasi DID on-chain.
 * @dev Menggunakan Wagmi dan react-query untuk state management yang efisien.
 */
export function useDIDOperations() {
  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  // 1. Membaca DID user saat ini.
  //    Hook ini akan secara otomatis memanggil fungsi `getDID` dari kontrak.
  const { 
    data: userDID, 
    isLoading: isDIDLoading,
    error: didReadError
  } = useReadContract({
    abi: DID_REGISTRY_ABI,
    address: CONTRACT_ADDRESSES.DID_REGISTRY,
    functionName: 'getDID',
    args: [address as `0x${string}`],
    query: {
      enabled: isConnected && !!address, // Hanya aktifkan query jika terhubung dan alamat ada
      // Perhatikan: Karena kontrak kita menyimpan DID sebagai string, 
      // tidak perlu ada logic khusus untuk bytes32.
      // Ethers.js akan menanganinya sebagai string biasa.
    },
  });

  // Log error untuk debugging
  if (didReadError) {
    console.error("Error reading DID:", didReadError);
  }

  // 2. Mutasi untuk mendaftarkan DID baru.
  const registerDIDMutation = useMutation({
    mutationFn: async () => {
      // Panggil `writeContractAsync` untuk mengirim transaksi.
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.DID_REGISTRY,
        abi: DID_REGISTRY_ABI,
        functionName: 'registerDID',
        args: [],
      });
      return hash;
    },
    onSuccess: () => {
      toast.success('Transaksi pendaftaran DID berhasil dikirim!');
      // Invalidasi cache untuk memperbarui DID secara otomatis.
      queryClient.invalidateQueries({ queryKey: ['userDID'] });
    },
    onError: (error) => {
      console.error('Error saat mendaftarkan DID:', error);
      toast.error(`Gagal mendaftarkan DID: ${error.message}`);
    },
  });

  return {
    userDID,
    isDIDLoading,
    registerDID: registerDIDMutation.mutateAsync,
    isRegisteringDID: registerDIDMutation.isPending,
    isRegistering: registerDIDMutation.isPending, // Alias untuk kompatibilitas
  };
}
