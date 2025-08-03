// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title AegisFileRegistry
 * @author Aegis Digital
 * @notice Kontrak ini berfungsi untuk mendaftarkan metadata file yang diunggah,
 * termasuk IPFS CID, di blockchain Lisk. Ini menjadi bukti kepemilikan data on-chain.
 * @dev Kontrak ini tidak menyimpan file itu sendiri, hanya hash-nya.
 * Ini adalah konsep kunci dari penyimpanan terdesentralisasi (DeFi).
 */
contract AegisFileRegistry is Ownable {
    
    constructor() Ownable(msg.sender) {
        // Constructor passes the deployer address as the initial owner
    }
    
    // Struct untuk menyimpan metadata file.
    struct FileData {
        address owner;
        string ipfsHash;
        string fileName;
        uint256 timestamp;
        bool isAnalyzed; // Menambahkan flag untuk fitur AI
    }

    // Counter untuk memberikan ID unik pada setiap file.
    uint256 private _fileIdCounter;

    // Mapping untuk menyimpan data file berdasarkan ID unik.
    mapping(uint256 => FileData) private files;

    // Mapping untuk melacak file mana saja yang dimiliki oleh setiap alamat.
    mapping(address => uint256[]) private ownerFiles;

    // Event yang dipancarkan saat file baru berhasil didaftarkan.
    // Penting untuk optimasi gas.
    event FileRegistered(uint256 indexed fileId, address indexed owner, string ipfsHash);
    
    // Event yang dipancarkan setelah file dianalisis oleh AI.
    event FileAnalyzed(uint256 indexed fileId, string analysisResult);

    error FileNotFound(uint256 fileId);
    error NotFileOwner(address caller, uint256 fileId);

    /**
     * @notice Mendaftarkan metadata file baru.
     * @param _ipfsHash IPFS Content Identifier (CID) dari file.
     * @param _fileName Nama file yang diunggah.
     * @return uint256 ID file yang baru dibuat.
     */
    function registerFile(string calldata _ipfsHash, string calldata _fileName) external returns (uint256) {
        // Validasi keamanan dasar: pastikan nama file tidak kosong
        require(bytes(_fileName).length > 0, "File name cannot be empty");
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        
        _fileIdCounter++;
        files[_fileIdCounter] = FileData({
            owner: msg.sender,
            ipfsHash: _ipfsHash,
            fileName: _fileName,
            timestamp: block.timestamp,
            isAnalyzed: false
        });
        ownerFiles[msg.sender].push(_fileIdCounter);

        emit FileRegistered(_fileIdCounter, msg.sender, _ipfsHash);
        return _fileIdCounter;
    }

    /**
     * @notice Memperbarui status analisis AI dari sebuah file.
     * @param _fileId ID file yang akan diupdate.
     * @param _analysisResult Hasil analisis dari backend AI.
     * @dev Fungsi ini bisa dipanggil oleh pemilik file setelah backend AI selesai menganalisis.
     */
    function setFileAnalyzed(uint256 _fileId, string calldata _analysisResult) external {
        if (files[_fileId].owner != msg.sender) {
            revert NotFileOwner(msg.sender, _fileId);
        }

        files[_fileId].isAnalyzed = true;
        // Kita tidak menyimpan hasil analisis on-chain karena mahal.
        // Cukup event untuk notifikasi.
        emit FileAnalyzed(_fileId, _analysisResult);
    }


    /**
     * @notice Mendapatkan metadata file berdasarkan ID.
     * @param _fileId ID file yang ingin dicari.
     * @return FileData Struct yang berisi metadata file.
     */
    function getFile(uint256 _fileId) external view returns (FileData memory) {
        if (files[_fileId].owner == address(0)) {
            revert FileNotFound(_fileId);
        }
        return files[_fileId];
    }
    
    /**
     * @notice Mendapatkan daftar ID file yang dimiliki oleh suatu alamat.
     * @param _owner Alamat pemilik file.
     * @return uint256[] Array yang berisi ID-ID file.
     * @dev Peringatan: Fungsi ini tidak optimal untuk jumlah file yang sangat besar.
     * Namun, untuk MVP hackathon, ini dapat diterima. Untuk skala produksi,
     * lebih baik menggunakan event logs untuk memuat daftar file di frontend.
     */
    function getFilesByOwner(address _owner) external view returns (uint256[] memory) {
        return ownerFiles[_owner];
    }

    /**
     * @notice Mengecek apakah file dengan ID tertentu ada.
     * @param _fileId ID file yang ingin dicek.
     * @return bool True jika file ada, false jika tidak.
     */
    function doesFileExist(uint256 _fileId) external view returns (bool) {
        return files[_fileId].owner != address(0);
    }

    /**
     * @notice Mengecek apakah file dengan CID tertentu ada (untuk kompatibilitas dengan AccessControl).
     * @param _fileCID Hash CID dari file.
     * @return bool True jika file ada, false jika tidak.
     */
    function doesFileExist(bytes32 _fileCID) external view returns (bool) {
        // Implementasi sederhana: cek dari counter sampai sekarang
        for (uint256 i = 1; i <= _fileIdCounter; i++) {
            if (keccak256(abi.encodePacked(files[i].ipfsHash)) == _fileCID) {
                return true;
            }
        }
        return false;
    }

    /**
     * @notice Mendapatkan pemilik file berdasarkan ID.
     * @param _fileId ID file.
     * @return address Alamat pemilik file.
     */
    function getFileOwner(uint256 _fileId) external view returns (address) {
        if (files[_fileId].owner == address(0)) {
            revert FileNotFound(_fileId);
        }
        return files[_fileId].owner;
    }

    /**
     * @notice Mendapatkan pemilik file berdasarkan CID (untuk kompatibilitas dengan AccessControl).
     * @param _fileCID Hash CID dari file.
     * @return bytes32 DID pemilik file.
     */
    function getFileOwner(bytes32 _fileCID) external view returns (bytes32) {
        // Implementasi sederhana: cek dari counter sampai sekarang
        for (uint256 i = 1; i <= _fileIdCounter; i++) {
            if (keccak256(abi.encodePacked(files[i].ipfsHash)) == _fileCID) {
                // Return DID instead of address for AccessControl compatibility
                // Note: This is a simplified implementation
                return keccak256(abi.encodePacked(files[i].owner));
            }
        }
        revert FileNotFound(0); // File not found
    }
}
