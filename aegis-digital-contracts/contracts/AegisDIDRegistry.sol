// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AegisDIDRegistry is Ownable {
    // Konstruktor Ownable membutuhkan initialOwner. Kita akan meneruskan msg.sender (deployer) sebagai pemilik awal.
    constructor() Ownable(msg.sender) {}

    mapping(address => bytes32) public userDIDs;
    mapping(bytes32 => address) public didToAddress;

    event DIDRegistered(address indexed userAddress, bytes32 indexed did);

    function registerDID() public {
        require(userDIDs[msg.sender] == bytes32(0), "AegisDIDRegistry: DID already registered");
        bytes32 newDID = keccak256(abi.encodePacked(msg.sender, block.timestamp));
        userDIDs[msg.sender] = newDID;
        didToAddress[newDID] = msg.sender;
        emit DIDRegistered(msg.sender, newDID);
    }

    function getDID(address _userAddress) public view returns (bytes32) {
        return userDIDs[_userAddress];
    }

    function getAddressFromDID(bytes32 _did) public view returns (address) {
        return didToAddress[_did];
    }
}

