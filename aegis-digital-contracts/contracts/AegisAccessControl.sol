// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./AegisFileRegistry.sol";
import "./AegisDIDRegistry.sol";

contract AegisAccessControl is Ownable {
    mapping(bytes32 => mapping(bytes32 => bool)) public hasAccess;

    event AccessGranted(bytes32 indexed fileCID, bytes32 indexed recipientDID, bytes32 indexed granterDID);
    event AccessRevoked(bytes32 indexed fileCID, bytes32 indexed recipientDID, bytes32 indexed revokerDID);

    AegisFileRegistry public fileRegistry;
    AegisDIDRegistry public didRegistry;

    // Konstruktor Ownable membutuhkan initialOwner. Kita akan meneruskan msg.sender (deployer) sebagai pemilik awal.
    // Konstruktor ini juga menerima alamat kontrak lain yang dibutuhkan.
    constructor(address _fileRegistryAddress, address _didRegistryAddress) Ownable(msg.sender) {
        require(_fileRegistryAddress != address(0), "AegisAccessControl: Invalid file registry address");
        require(_didRegistryAddress != address(0), "AegisAccessControl: Invalid DID registry address");
        fileRegistry = AegisFileRegistry(_fileRegistryAddress);
        didRegistry = AegisDIDRegistry(_didRegistryAddress);
    }

    function grantAccess(uint256 _fileId, bytes32 _recipientDID) public {
        require(fileRegistry.doesFileExist(_fileId), "AegisAccessControl: File does not exist");
        address fileOwner = fileRegistry.getFileOwner(_fileId);
        require(fileOwner == msg.sender, "AegisAccessControl: Only file owner can grant access");
        
        string memory callerDIDString = didRegistry.getDID(msg.sender);
        bytes32 callerDID = keccak256(abi.encodePacked(callerDIDString));
        bytes32 fileCID = keccak256(abi.encodePacked(_fileId)); // Convert to bytes32 for mapping
        
        require(_recipientDID != bytes32(0), "AegisAccessControl: Recipient DID cannot be zero");
        require(!hasAccess[fileCID][_recipientDID], "AegisAccessControl: Access already granted");
        hasAccess[fileCID][_recipientDID] = true;
        emit AccessGranted(fileCID, _recipientDID, callerDID);
    }

    function revokeAccess(uint256 _fileId, bytes32 _recipientDID) public {
        require(fileRegistry.doesFileExist(_fileId), "AegisAccessControl: File does not exist");
        address fileOwner = fileRegistry.getFileOwner(_fileId);
        require(fileOwner == msg.sender, "AegisAccessControl: Only file owner can revoke access");
        
        string memory callerDIDString = didRegistry.getDID(msg.sender);
        bytes32 callerDID = keccak256(abi.encodePacked(callerDIDString));
        bytes32 fileCID = keccak256(abi.encodePacked(_fileId)); // Convert to bytes32 for mapping
        
        require(hasAccess[fileCID][_recipientDID], "AegisAccessControl: Access not granted");
        hasAccess[fileCID][_recipientDID] = false;
        emit AccessRevoked(fileCID, _recipientDID, callerDID);
    }

    function checkAccess(bytes32 _fileCID, bytes32 _checkerDID) public view returns (bool) {
        return hasAccess[_fileCID][_checkerDID];
    }
}

