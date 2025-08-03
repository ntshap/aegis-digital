export const CONTRACT_ADDRESSES = {
  DID_REGISTRY: "0xBb23087a2C1D0D1C430c119434De91be7516EA69" as `0x${string}`,
  FILE_REGISTRY: "0xbBE261ba394CE8B890FBC1974F0402e681A5EE85" as `0x${string}`,
  ACCESS_CONTROL: "0x144A3FD873A1E4e443f45eBAcFce7Afc60f557f9" as `0x${string}`,
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
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "fileId",
        "type": "uint256"
      }
    ],
    "name": "FileNotFound",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "caller",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "fileId",
        "type": "uint256"
      }
    ],
    "name": "NotFileOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "fileId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "analysisResult",
        "type": "string"
      }
    ],
    "name": "FileAnalyzed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "fileId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "name": "FileRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_fileCID",
        "type": "bytes32"
      }
    ],
    "name": "doesFileExist",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_fileId",
        "type": "uint256"
      }
    ],
    "name": "doesFileExist",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_fileId",
        "type": "uint256"
      }
    ],
    "name": "getFile",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "fileName",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isAnalyzed",
            "type": "bool"
          }
        ],
        "internalType": "struct AegisFileRegistry.FileData",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_fileCID",
        "type": "bytes32"
      }
    ],
    "name": "getFileOwner",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_fileId",
        "type": "uint256"
      }
    ],
    "name": "getFileOwner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "getFilesByOwner",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_ipfsHash",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_fileName",
        "type": "string"
      }
    ],
    "name": "registerFile",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_fileId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_analysisResult",
        "type": "string"
      }
    ],
    "name": "setFileAnalyzed",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
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
