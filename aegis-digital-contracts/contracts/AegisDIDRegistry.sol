// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title AegisDIDRegistry
 * @author Aegis Digital
 * @notice Kontrak ini berfungsi untuk mendaftarkan dan mengelola DID (Decentralized Identifier)
 * untuk setiap alamat dompet pengguna. DID digunakan sebagai identitas unik on-chain.
 * Ini adalah fondasi dari kepemilikan data pengguna.
 * @dev Menggunakan string sebagai DID, tapi perhatikan biaya gas. Untuk efisiensi,
 * bisa dipertimbangkan menggunakan bytes32 jika DID-nya berupa hash.
 */
contract AegisDIDRegistry {
    
    mapping(address => string) private didRegistry;

    // Event yang dipancarkan saat DID baru berhasil didaftarkan.
    // Event ini sangat penting untuk pengoptimalan gas! Frontend dapat
    // mendengarkan event ini untuk memperbarui UI tanpa perlu membaca state
    // storage yang mahal.
    event DIDRegistered(address indexed owner, string did);

    // Error kustom untuk memberikan pesan yang lebih jelas.
    error DIDAlreadyRegistered(address owner);

    /**
     * @notice Mendaftarkan DID baru untuk alamat dompet pemanggil.
     * @param _did DID (string) yang akan didaftarkan.
     * @dev Setiap alamat hanya bisa mendaftarkan satu DID.
     * Menggunakan modifier 'onlyOwner' untuk mengontrol siapa yang dapat mendaftar
     * DID. Dalam konteks hackathon ini, kita bisa membiarkan siapa saja
     * mendaftar dengan menghapus 'onlyOwner' jika diperlukan.
     */
    function registerDID(string calldata _did) external {
        // Cek apakah alamat pengirim sudah memiliki DID terdaftar.
        if (bytes(didRegistry[msg.sender]).length != 0) {
            revert DIDAlreadyRegistered(msg.sender);
        }

        // Mendaftarkan DID baru.
        didRegistry[msg.sender] = _did;

        // Memancarkan event.
        emit DIDRegistered(msg.sender, _did);
    }

    /**
     * @notice Mendapatkan DID yang terdaftar untuk suatu alamat.
     * @param _owner Alamat dompet yang DID-nya ingin dicari.
     * @return string DID dari alamat yang diberikan.
     * @dev Fungsi ini adalah 'view' karena hanya membaca state, tidak memodifikasinya.
     * Memanggilnya dari off-chain (misalnya dari frontend) tidak memakan gas.
     */
    function getDID(address _owner) external view returns (string memory) {
        return didRegistry[_owner];
    }
}
