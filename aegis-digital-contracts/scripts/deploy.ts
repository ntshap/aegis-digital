import { ethers } from "hardhat";

async function main() {
  console.log("Memulai deployment smart contract Aegis Digital...");

  // Deploy AegisDIDRegistry
  const AegisDIDRegistry = await ethers.getContractFactory("AegisDIDRegistry");
  const didRegistry = await AegisDIDRegistry.deploy();
  // Menggunakan waitForDeployment() sebagai ganti deployed()
  await didRegistry.waitForDeployment();
  console.log("AegisDIDRegistry deployed to:", didRegistry.target); // Gunakan .target untuk alamat kontrak

  // Deploy AegisFileRegistry
  const AegisFileRegistry = await ethers.getContractFactory("AegisFileRegistry");
  const fileRegistry = await AegisFileRegistry.deploy();
  // Menggunakan waitForDeployment() sebagai ganti deployed()
  await fileRegistry.waitForDeployment();
  console.log("AegisFileRegistry deployed to:", fileRegistry.target); // Gunakan .target untuk alamat kontrak

  // Deploy AegisAccessControl, meneruskan alamat kontrak yang sudah di-deploy
  const AegisAccessControl = await ethers.getContractFactory("AegisAccessControl");
  // Perhatikan bahwa kita meneruskan .target untuk alamat kontrak yang sudah di-deploy
  const accessControl = await AegisAccessControl.deploy(fileRegistry.target, didRegistry.target);
  // Menggunakan waitForDeployment() sebagai ganti deployed()
  await accessControl.waitForDeployment();
  console.log("AegisAccessControl deployed to:", accessControl.target); // Gunakan .target untuk alamat kontrak

  // Simpan alamat kontrak ini untuk digunakan di frontend
  console.log("\n--- Alamat Kontrak yang Di-deploy ---");
  console.log("DID Registry Address:", didRegistry.target);
  console.log("File Registry Address:", fileRegistry.target);
  console.log("Access Control Address:", accessControl.target);

  console.log("\nDeployment selesai. Pastikan untuk mencatat alamat di atas!");
}

// Jalankan script deployment
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
