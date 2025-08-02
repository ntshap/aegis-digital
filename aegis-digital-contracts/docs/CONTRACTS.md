# Smart Contracts Documentation

## Overview
Aegis Digital menggunakan tiga smart contract utama yang bekerja sama untuk memberikan kontrol penuh atas data digital kepada pengguna.

## AegisDIDRegistry

### Purpose
Mengelola identitas terdesentralisasi (DID) untuk setiap pengguna dalam sistem.

### Key Functions

#### `registerDID()`
- **Description**: Mendaftarkan DID baru untuk pengguna
- **Access**: Public
- **Gas**: ~50,000
- **Events**: `DIDRegistered(address indexed userAddress, bytes32 indexed did)`

#### `getDID(address _userAddress)`
- **Description**: Mengambil DID dari alamat wallet
- **Returns**: `bytes32` DID unik
- **Access**: Public view

#### `getAddressFromDID(bytes32 _did)`
- **Description**: Mengambil alamat wallet dari DID
- **Returns**: `address` alamat wallet
- **Access**: Public view

### State Variables
- `mapping(address => bytes32) public userDIDs`: Mapping alamat ke DID
- `mapping(bytes32 => address) public didToAddress`: Mapping DID ke alamat

### Security Features
- Satu DID per alamat wallet
- DID tidak dapat diubah setelah dibuat
- Ownable pattern untuk fungsi admin

---

## AegisFileRegistry

### Purpose
Registry untuk semua file yang diupload ke sistem dengan tracking ownership.

### Key Functions

#### `uploadFile(bytes32 _fileCID, bytes32 _ownerDID)`
- **Description**: Mendaftarkan file baru dengan CID dan owner
- **Parameters**: 
  - `_fileCID`: IPFS CID dalam format bytes32
  - `_ownerDID`: DID pemilik file
- **Events**: `FileUploaded(bytes32 indexed fileCID, bytes32 indexed ownerDID, uint256 timestamp)`

#### `getFileOwner(bytes32 _fileCID)`
- **Description**: Mengambil DID pemilik file
- **Returns**: `bytes32` DID pemilik
- **Access**: Public view

#### `doesFileExist(bytes32 _fileCID)`
- **Description**: Cek apakah file exists di registry
- **Returns**: `bool` status keberadaan
- **Access**: Public view

### Data Structures
```solidity
struct File {
    bytes32 ownerDID;
    uint256 uploadTimestamp;
    bool exists;
}
```

### State Variables
- `mapping(bytes32 => File) public files`: Mapping CID ke file data

---

## AegisAccessControl

### Purpose
Mengelola kontrol akses file berbasis DID dengan granular permissions.

### Constructor Parameters
- `_fileRegistryAddress`: Alamat AegisFileRegistry contract
- `_didRegistryAddress`: Alamat AegisDIDRegistry contract

### Key Functions

#### `grantAccess(bytes32 _fileCID, bytes32 _recipientDID)`
- **Description**: Memberikan akses file kepada user lain
- **Access**: Hanya pemilik file
- **Events**: `AccessGranted(bytes32 indexed fileCID, bytes32 indexed recipientDID, bytes32 indexed granterDID)`

#### `revokeAccess(bytes32 _fileCID, bytes32 _recipientDID)`
- **Description**: Mencabut akses file dari user
- **Access**: Hanya pemilik file
- **Events**: `AccessRevoked(bytes32 indexed fileCID, bytes32 indexed recipientDID, bytes32 indexed revokerDID)`

#### `checkAccess(bytes32 _fileCID, bytes32 _checkerDID)`
- **Description**: Cek apakah DID memiliki akses ke file
- **Returns**: `bool` status akses
- **Logic**: Pemilik file selalu memiliki akses

### State Variables
- `mapping(bytes32 => mapping(bytes32 => bool)) public hasAccess`: Nested mapping untuk akses
- `AegisFileRegistry public fileRegistry`: Reference ke file registry
- `AegisDIDRegistry public didRegistry`: Reference ke DID registry

---

## Deployment Information

### Lisk Sepolia Testnet
- **Network ID**: 4202
- **RPC URL**: https://rpc.sepolia-api.lisk.com
- **Explorer**: https://sepolia-blockscout.lisk.com

### Contract Addresses
```typescript
const CONTRACT_ADDRESSES = {
  DID_REGISTRY: "0xdA17282dD002C3Db754df298d85bb3D76c1c9CD0",
  FILE_REGISTRY: "0x726bE4FAa748fd4815580F9F662477A45de1cCfE", 
  ACCESS_CONTROL: "0x3A9d196D7188830443d84011de48A4F57E94D42C"
};
```

## Gas Optimization

### Efficient Patterns
1. **Batch Operations**: Group multiple operations when possible
2. **Storage Optimization**: Use packed structs untuk menghemat gas
3. **Event Indexing**: Index parameter yang sering di-query

### Estimated Gas Costs
- DID Registration: ~50,000 gas
- File Upload: ~70,000 gas
- Grant Access: ~45,000 gas
- Revoke Access: ~30,000 gas

## Security Considerations

### Access Control
- Hanya pemilik file yang dapat grant/revoke access
- DID validation untuk semua operations
- Reentrancy protection (inherited dari OpenZeppelin)

### Data Integrity
- File CID immutable setelah registration
- Timestamp auto-generated untuk audit trail
- Cross-contract validation untuk consistency

### Upgrade Strategy
- Contracts menggunakan proxy pattern untuk upgradability
- Multi-sig wallet untuk admin functions
- Timelock untuk critical changes

## Integration Examples

### Frontend Integration
```typescript
// Register DID
const { writeContract } = useWriteContract();
await writeContract({
  address: CONTRACT_ADDRESSES.DID_REGISTRY,
  abi: DID_REGISTRY_ABI,
  functionName: 'registerDID'
});

// Upload file
await writeContract({
  address: CONTRACT_ADDRESSES.FILE_REGISTRY,
  abi: FILE_REGISTRY_ABI,
  functionName: 'uploadFile',
  args: [fileCIDBytes32, ownerDIDBytes32]
});
```

### Event Listening
```typescript
// Listen for file uploads
const fileUploaded = await publicClient.watchContractEvent({
  address: CONTRACT_ADDRESSES.FILE_REGISTRY,
  abi: FILE_REGISTRY_ABI,
  eventName: 'FileUploaded',
  onLogs: (logs) => console.log('New file uploaded:', logs)
});
```
