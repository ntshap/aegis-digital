import { useAccount, useReadContract, useSimulateContract, useWriteContract } from 'wagmi';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, DID_REGISTRY_ABI } from '../config/contracts';

export const useDIDOperations = () => {
  const { address, isConnected } = useAccount();

  const { data: userDIDData } = useReadContract({
    address: CONTRACT_ADDRESSES.DID_REGISTRY,
    abi: DID_REGISTRY_ABI,
    functionName: 'getDID',
    args: [address as `0x${string}`],
    query: {
      enabled: isConnected && !!address,
    },
  });

  const { data: registerDIDSimulateData } = useSimulateContract({
    address: CONTRACT_ADDRESSES.DID_REGISTRY,
    abi: DID_REGISTRY_ABI,
    functionName: 'registerDID',
    args: [],
    query: {
      enabled: isConnected,
    },
  });

  const { writeContract: writeRegisterDID, isPending: isRegistering } = useWriteContract();

  const userDID = userDIDData ? ethers.decodeBytes32String(userDIDData as string) : 'N/A';
  const hasDID = userDIDData !== ethers.ZeroHash && userDIDData !== undefined;

  const registerDID = async () => {
    if (registerDIDSimulateData?.request) {
      writeRegisterDID(registerDIDSimulateData.request);
    }
  };

  return {
    userDID,
    hasDID,
    registerDID,
    isRegistering,
    canRegister: isConnected && registerDIDSimulateData?.request,
  };
};
