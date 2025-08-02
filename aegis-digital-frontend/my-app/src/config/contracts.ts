export const CONTRACT_ADDRESSES = {
  DID_REGISTRY: "0xdA17282dD002C3Db754df298d85bb3D76c1c9CD0" as `0x${string}`,
  FILE_REGISTRY: "0x726bE4FAa748fd4815580F9F662477A45de1cCfE" as `0x${string}`,
  ACCESS_CONTROL: "0x3A9d196D7188830443d84011de48A4F57E94D42C" as `0x${string}`,
} as const;

export const DID_REGISTRY_ABI = [
  { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
  { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "OwnableInvalidOwner", "type": "error" },
  { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "OwnableUnauthorizedAccount", "type": "error" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "userAddress", "type": "address" }, { "indexed": true, "internalType": "bytes32", "name": "did", "type": "bytes32" }], "name": "DIDRegistered", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" },
  { "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "name": "didToAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "bytes32", "name": "_did", "type": "bytes32" }], "name": "getAddressFromDID", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "_userAddress", "type": "address" }], "name": "getDID", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "registerDID", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "userDIDs", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }
] as const;

export const FILE_REGISTRY_ABI = [
  { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
  { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "OwnableInvalidOwner", "type": "error" },
  { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "OwnableUnauthorizedAccount", "type": "error" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "fileCID", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "ownerDID", "type": "bytes32" }, { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "name": "FileUploaded", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" },
  { "inputs": [{ "internalType": "bytes32", "name": "_fileCID", "type": "bytes32" }], "name": "doesFileExist", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "name": "files", "outputs": [{ "internalType": "bytes32", "name": "ownerDID", "type": "bytes32" }, { "internalType": "uint256", "name": "uploadTimestamp", "type": "uint256" }, { "internalType": "bool", "name": "exists", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "bytes32", "name": "_fileCID", "type": "bytes32" }], "name": "getFileOwner", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "bytes32", "name": "_fileCID", "type": "bytes32" }, { "internalType": "bytes32", "name": "_ownerDID", "type": "bytes32" }], "name": "uploadFile", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
] as const;

export const ACCESS_CONTROL_ABI = [
  { "inputs": [{ "internalType": "address", "name": "_fileRegistryAddress", "type": "address" }, { "internalType": "address", "name": "_didRegistryAddress", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" },
  { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "OwnableInvalidOwner", "type": "error" },
  { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "OwnableUnauthorizedAccount", "type": "error" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "fileCID", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "recipientDID", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "granterDID", "type": "bytes32" }], "name": "AccessGranted", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "fileCID", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "recipientDID", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "revokerDID", "type": "bytes32" }], "name": "AccessRevoked", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" },
  { "inputs": [{ "internalType": "bytes32", "name": "_fileCID", "type": "bytes32" }, { "internalType": "bytes32", "name": "_checkerDID", "type": "bytes32" }], "name": "checkAccess", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "didRegistry", "outputs": [{ "internalType": "contract AegisDIDRegistry", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "fileRegistry", "outputs": [{ "internalType": "contract AegisFileRegistry", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "bytes32", "name": "_fileCID", "type": "bytes32" }, { "internalType": "bytes32", "name": "_recipientDID", "type": "bytes32" }], "name": "grantAccess", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }, { "internalType": "bytes32", "name": "", "type": "bytes32" }], "name": "hasAccess", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "bytes32", "name": "_fileCID", "type": "bytes32" }, { "internalType": "bytes32", "name": "_recipientDID", "type": "bytes32" }], "name": "revokeAccess", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
] as const;
