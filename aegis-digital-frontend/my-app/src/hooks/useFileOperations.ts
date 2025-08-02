import { useState } from 'react';
import { useAccount, useSimulateContract, useWriteContract } from 'wagmi';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, FILE_REGISTRY_ABI, ACCESS_CONTROL_ABI } from '../config/contracts';

export const useFileOperations = () => {
  const { isConnected } = useAccount();
  
  const [uploadFileArgs, setUploadFileArgs] = useState<[string, string]>([ethers.ZeroHash, ethers.ZeroHash]);
  const [grantAccessArgs, setGrantAccessArgs] = useState<[string, string]>([ethers.ZeroHash, ethers.ZeroHash]);
  const [revokeAccessArgs, setRevokeAccessArgs] = useState<[string, string]>([ethers.ZeroHash, ethers.ZeroHash]);

  const { data: uploadFileSimulateData } = useSimulateContract({
    address: CONTRACT_ADDRESSES.FILE_REGISTRY,
    abi: FILE_REGISTRY_ABI,
    functionName: 'uploadFile',
    args: [uploadFileArgs[0] as `0x${string}`, uploadFileArgs[1] as `0x${string}`],
    query: {
      enabled: !!uploadFileArgs[0] && !!uploadFileArgs[1],
    },
  });

  const { data: grantAccessSimulateData } = useSimulateContract({
    address: CONTRACT_ADDRESSES.ACCESS_CONTROL,
    abi: ACCESS_CONTROL_ABI,
    functionName: 'grantAccess',
    args: [grantAccessArgs[0] as `0x${string}`, grantAccessArgs[1] as `0x${string}`],
    query: {
      enabled: !!grantAccessArgs[0] && !!grantAccessArgs[1],
    },
  });

  const { data: revokeAccessSimulateData } = useSimulateContract({
    address: CONTRACT_ADDRESSES.ACCESS_CONTROL,
    abi: ACCESS_CONTROL_ABI,
    functionName: 'revokeAccess',
    args: [revokeAccessArgs[0] as `0x${string}`, revokeAccessArgs[1] as `0x${string}`],
    query: {
      enabled: !!revokeAccessArgs[0] && !!revokeAccessArgs[1],
    },
  });

  const { writeContract: writeUploadFile, isPending: isUploading } = useWriteContract();
  const { writeContract: writeGrantAccess, isPending: isGranting } = useWriteContract();
  const { writeContract: writeRevokeAccess, isPending: isRevoking } = useWriteContract();

  const uploadFile = async (fileCID: string, ownerDID: string) => {
    const fileCIDBytes32 = ethers.encodeBytes32String(fileCID.slice(0, 31));
    setUploadFileArgs([fileCIDBytes32, ownerDID]);
    
    if (uploadFileSimulateData?.request) {
      writeUploadFile(uploadFileSimulateData.request);
    }
  };

  const grantAccess = async (fileCID: string, recipientDID: string) => {
    const fileCIDBytes32 = ethers.encodeBytes32String(fileCID.slice(0, 31));
    const recipientDIDBytes32 = ethers.encodeBytes32String(recipientDID);
    setGrantAccessArgs([fileCIDBytes32, recipientDIDBytes32]);
    
    if (grantAccessSimulateData?.request) {
      writeGrantAccess(grantAccessSimulateData.request);
    }
  };

  const revokeAccess = async (fileCID: string, recipientDID: string) => {
    const fileCIDBytes32 = ethers.encodeBytes32String(fileCID.slice(0, 31));
    const recipientDIDBytes32 = ethers.encodeBytes32String(recipientDID);
    setRevokeAccessArgs([fileCIDBytes32, recipientDIDBytes32]);
    
    if (revokeAccessSimulateData?.request) {
      writeRevokeAccess(revokeAccessSimulateData.request);
    }
  };

  return {
    uploadFile,
    grantAccess,
    revokeAccess,
    isUploading,
    isGranting,
    isRevoking,
    canUpload: isConnected && uploadFileSimulateData?.request,
    canGrant: isConnected && grantAccessSimulateData?.request,
    canRevoke: isConnected && revokeAccessSimulateData?.request,
  };
};
