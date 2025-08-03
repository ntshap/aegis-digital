import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv"; // Import dotenv

dotenv.config(); // Muat variabel lingkungan dari file .env

const config: HardhatUserConfig = {
  solidity: "0.8.24", // Pastikan versi ini sesuai dengan kontrak Anda
  networks: {
    liskSepolia: {
      url: "https://rpc.sepolia-api.lisk.com",
      chainId: 4202,
      accounts: [process.env.WALLET_KEY as string], // Mengambil private key dari .env
    },
    // Anda bisa menambahkan jaringan lain di sini jika diperlukan
  },
  // Konfigurasi Etherscan untuk verifikasi kontrak di Blockscout
  etherscan: {
    apiKey: {
      liskSepolia: "your-etherscan-api-key-if-needed", // Anda mungkin tidak memerlukan ini untuk Lisk Sepolia Blockscout, tetapi baik untuk disiapkan
    },
    customChains: [
      {
        network: "liskSepolia",
        chainId: 4202,
        urls: {
          apiURL: "https://sepolia-blockscout.lisk.com/api", // URL API Blockscout Lisk Sepolia
          browserURL: "https://sepolia-blockscout.lisk.com", // URL browser Blockscout Lisk Sepolia
        },
      },
    ],
  },
};

export default config;
