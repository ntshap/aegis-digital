// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AegisFileRegistry is Ownable {
    // Konstruktor Ownable membutuhkan initialOwner. Kita akan meneruskan msg.sender (deployer) sebagai pemilik awal.
    constructor() Ownable(msg.sender) {}

    struct FileInfo {
        bytes32 ownerDID;
        uint256 uploadTimestamp;
        bool exists;
    }

    mapping(bytes32 => FileInfo) public files;

    event FileUploaded(bytes32 indexed fileCID, bytes32 indexed ownerDID, uint256 timestamp);

    function uploadFile(bytes32 _fileCID, bytes32 _ownerDID) public {
        require(!files[_fileCID].exists, "AegisFileRegistry: File already registered");
        require(_ownerDID != bytes32(0), "AegisFileRegistry: Owner DID cannot be zero");

        files[_fileCID] = FileInfo({
            ownerDID: _ownerDID,
            uploadTimestamp: block.timestamp,
            exists: true
        });

        emit FileUploaded(_fileCID, _ownerDID, block.timestamp);
    }

    function getFileOwner(bytes32 _fileCID) public view returns (bytes32) {
        require(files[_fileCID].exists, "AegisFileRegistry: File does not exist");
        return files[_fileCID].ownerDID;
    }

    function doesFileExist(bytes32 _fileCID) public view returns (bool) {
        return files[_fileCID].exists;
    }
}

