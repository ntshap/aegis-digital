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

    function grantAccess(bytes32 _fileCID, bytes32 _recipientDID) public {
        require(fileRegistry.doesFileExist(_fileCID), "AegisAccessControl: File does not exist");
        bytes32 fileOwnerDID = fileRegistry.getFileOwner(_fileCID);
        bytes32 callerDID = didRegistry.getDID(msg.sender);
        require(fileOwnerDID == callerDID, "AegisAccessControl: Only file owner can grant access");
        require(_recipientDID != bytes32(0), "AegisAccessControl: Recipient DID cannot be zero");
        require(!hasAccess[_fileCID][_recipientDID], "AegisAccessControl: Access already granted");
        hasAccess[_fileCID][_recipientDID] = true;
        emit AccessGranted(_fileCID, _recipientDID, callerDID);
    }

    function revokeAccess(bytes32 _fileCID, bytes32 _recipientDID) public {
        require(fileRegistry.doesFileExist(_fileCID), "AegisAccessControl: File does not exist");
        bytes32 fileOwnerDID = fileRegistry.getFileOwner(_fileCID);
        bytes32 callerDID = didRegistry.getDID(msg.sender);
        require(fileOwnerDID == callerDID, "AegisAccessControl: Only file owner can revoke access");
        require(hasAccess[_fileCID][_recipientDID], "AegisAccessControl: Access not granted");
        hasAccess[_fileCID][_recipientDID] = false;
        emit AccessRevoked(_fileCID, _recipientDID, callerDID);
    }

    function checkAccess(bytes32 _fileCID, bytes32 _checkerDID) public view returns (bool) {
        return hasAccess[_fileCID][_checkerDID];
    }
}

