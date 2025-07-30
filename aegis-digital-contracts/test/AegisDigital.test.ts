import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { AegisDIDRegistry, AegisFileRegistry, AegisAccessControl } from "../typechain-types";

describe("Aegis Digital Smart Contracts", function () {
  let didRegistry: AegisDIDRegistry;
  let fileRegistry: AegisFileRegistry;
  let accessControl: AegisAccessControl;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress; 
  let other: SignerWithAddress; 

  // Contoh CIDs dan DIDs (dalam format bytes32)
  const TEST_FILE_CID_1 = ethers.encodeBytes32String("testfilecid1");
  const TEST_FILE_CID_2 = ethers.encodeBytes32String("testfilecid2");
  let user1DID: string; 
  let user2DID: string; 

  // Hook 'before' utama untuk seluruh suite tes
  before(async function () {
    [owner, user1, user2, user3, other] = await ethers.getSigners(); // Inisialisasi user3

    // Deploy AegisDIDRegistry
    const AegisDIDRegistryFactory = await ethers.getContractFactory("AegisDIDRegistry");
    didRegistry = await AegisDIDRegistryFactory.deploy();
    await didRegistry.waitForDeployment();
    console.log("AegisDIDRegistry deployed to:", didRegistry.target);

    // Deploy AegisFileRegistry
    const AegisFileRegistryFactory = await ethers.getContractFactory("AegisFileRegistry");
    fileRegistry = await AegisFileRegistryFactory.deploy();
    await fileRegistry.waitForDeployment();
    console.log("AegisFileRegistry deployed to:", fileRegistry.target);

    // Deploy AegisAccessControl, meneruskan alamat kontrak yang sudah di-deploy
    const AegisAccessControlFactory = await ethers.getContractFactory("AegisAccessControl");
    accessControl = await AegisAccessControlFactory.deploy(fileRegistry.target, didRegistry.target);
    await accessControl.waitForDeployment();
    console.log("AegisAccessControl deployed to:", accessControl.target);

    // --- Inisialisasi DID untuk user1 dan user2 di sini sekali saja ---
    // Register DID for user1
    await didRegistry.connect(user1).registerDID();
    user1DID = await didRegistry.connect(user1).getDID(user1.address);
    console.log(`User1 DID: ${user1DID}`);

    // Register DID for user2
    await didRegistry.connect(user2).registerDID();
    user2DID = await didRegistry.connect(user2).getDID(user2.address);
    console.log(`User2 DID: ${user2DID}`);

    // Upload file for user1 (jika belum terdaftar)
    if (!(await fileRegistry.doesFileExist(TEST_FILE_CID_1))) {
      await fileRegistry.connect(user1).uploadFile(TEST_FILE_CID_1, user1DID);
      console.log(`File CID 1 registered by User1 DID: ${TEST_FILE_CID_1}`);
    }
  });

  describe("AegisDIDRegistry", function () {
    it("Should allow a user to register their DID", async function () {
      // Menguji pendaftaran DID untuk 'other' yang belum terdaftar di hook utama
      await expect(didRegistry.connect(other).registerDID())
        .to.emit(didRegistry, "DIDRegistered")
        .withArgs(other.address, (did: string) => {
          // Memastikan DID yang di-emit tidak nol dan cocok dengan yang diambil dari kontrak
          expect(did).to.not.equal(ethers.ZeroHash);
          return true; // Mengembalikan true untuk menandakan asersi lulus
        });
      
      const otherDID = await didRegistry.connect(other).getDID(other.address);
      expect(otherDID).to.not.equal(ethers.ZeroHash);
    });

    it("Should not allow a user to register DID twice", async function () {
      // Gunakan user yang sudah terdaftar (user1)
      await expect(didRegistry.connect(user1).registerDID())
        .to.be.revertedWith("AegisDIDRegistry: DID already registered");
    });

    it("Should return the correct DID for a registered user", async function () {
      const retrievedDID = await didRegistry.connect(user1).getDID(user1.address);
      expect(retrievedDID).to.equal(user1DID);
    });

    it("Should return zero DID for an unregistered user", async function () {
      // Gunakan user3 yang dijamin belum terdaftar
      const unregisteredDID = await didRegistry.connect(user3).getDID(user3.address);
      expect(unregisteredDID).to.equal(ethers.ZeroHash);
    });

    it("Should return the correct address for a given DID", async function () {
      const retrievedAddress = await didRegistry.getAddressFromDID(user1DID);
      expect(retrievedAddress).to.equal(user1.address);
    });
  });

  describe("AegisFileRegistry", function () {
    it("Should allow a user to upload and register a file CID", async function () {
      // Gunakan user 'other' yang baru saja mendaftar di tes AegisDIDRegistry
      const otherDID = await didRegistry.connect(other).getDID(other.address);
      await expect(fileRegistry.connect(other).uploadFile(TEST_FILE_CID_2, otherDID))
        .to.emit(fileRegistry, "FileUploaded")
        .withArgs(TEST_FILE_CID_2, otherDID, (timestamp: bigint) => { // Ubah tipe menjadi bigint
          // Memastikan timestamp adalah BigInt positif yang valid
          expect(timestamp).to.be.a('bigint').and.to.be.above(0n); // Gunakan 0n untuk BigInt nol
          return true;
        });

      const fileInfo = await fileRegistry.files(TEST_FILE_CID_2);
      expect(fileInfo.ownerDID).to.equal(otherDID);
      expect(fileInfo.exists).to.be.true;
    });

    it("Should not allow registering the same file CID twice", async function () {
      await expect(fileRegistry.connect(user1).uploadFile(TEST_FILE_CID_1, user1DID))
        .to.be.revertedWith("AegisFileRegistry: File already registered");
    });

    it("Should return the correct owner DID for a registered file", async function () {
      const ownerDID = await fileRegistry.getFileOwner(TEST_FILE_CID_1);
      expect(ownerDID).to.equal(user1DID);
    });

    it("Should revert when getting owner of a non-existent file", async function () {
      const TEST_FILE_CID_3 = ethers.encodeBytes32String("testfilecid3");
      await expect(fileRegistry.getFileOwner(TEST_FILE_CID_3))
        .to.be.revertedWith("AegisFileRegistry: File does not exist");
    });

    it("Should correctly report if a file exists", async function () {
      expect(await fileRegistry.doesFileExist(TEST_FILE_CID_1)).to.be.true;
      const TEST_FILE_CID_4 = ethers.encodeBytes32String("testfilecid4");
      expect(await fileRegistry.doesFileExist(TEST_FILE_CID_4)).to.be.false;
    });
  });

  describe("AegisAccessControl", function () {
    it("Should allow file owner to grant access to another DID", async function () {
      await expect(accessControl.connect(user1).grantAccess(TEST_FILE_CID_1, user2DID))
        .to.emit(accessControl, "AccessGranted")
        .withArgs(TEST_FILE_CID_1, user2DID, user1DID);

      expect(await accessControl.hasAccess(TEST_FILE_CID_1, user2DID)).to.be.true;
    });

    it("Should not allow non-owner to grant access", async function () {
      await expect(accessControl.connect(user2).grantAccess(TEST_FILE_CID_1, user1DID))
        .to.be.revertedWith("AegisAccessControl: Only file owner can grant access");
    });

    it("Should not allow granting access to the same DID twice", async function () {
      if (!(await accessControl.hasAccess(TEST_FILE_CID_1, user2DID))) {
        await accessControl.connect(user1).grantAccess(TEST_FILE_CID_1, user2DID);
      }
      await expect(accessControl.connect(user1).grantAccess(TEST_FILE_CID_1, user2DID))
        .to.be.revertedWith("AegisAccessControl: Access already granted");
    });

    it("Should allow file owner to revoke access from another DID", async function () {
      if (!(await accessControl.hasAccess(TEST_FILE_CID_1, user2DID))) {
        await accessControl.connect(user1).grantAccess(TEST_FILE_CID_1, user2DID);
      }

      await expect(accessControl.connect(user1).revokeAccess(TEST_FILE_CID_1, user2DID))
        .to.emit(accessControl, "AccessRevoked")
        .withArgs(TEST_FILE_CID_1, user2DID, user1DID);

      expect(await accessControl.hasAccess(TEST_FILE_CID_1, user2DID)).to.be.false;
    });

    it("Should not allow non-owner to revoke access", async function () {
      await expect(accessControl.connect(user2).revokeAccess(TEST_FILE_CID_1, user1DID))
        .to.be.revertedWith("AegisAccessControl: Only file owner can revoke access");
    });

    it("Should not allow revoking access if not granted", async function () {
      if (await accessControl.hasAccess(TEST_FILE_CID_1, user2DID)) {
        await accessControl.connect(user1).revokeAccess(TEST_FILE_CID_1, user2DID);
      }
      await expect(accessControl.connect(user1).revokeAccess(TEST_FILE_CID_1, ethers.ZeroHash)) // Menggunakan ZeroHash sebagai contoh DID yang tidak diberikan akses
        .to.be.revertedWith("AegisAccessControl: Access not granted");
    });

    it("Should correctly check access status", async function () {
      await accessControl.connect(user1).grantAccess(TEST_FILE_CID_1, user2DID);
      expect(await accessControl.checkAccess(TEST_FILE_CID_1, user2DID)).to.be.true;
      
      expect(await accessControl.checkAccess(TEST_FILE_CID_1, user1DID)).to.be.false; 
      
      expect(await accessControl.checkAccess(TEST_FILE_CID_1, ethers.encodeBytes32String("someotherdid"))).to.be.false;
    });

    it("Should revert if trying to grant access to zero DID", async function () {
      await expect(accessControl.connect(user1).grantAccess(TEST_FILE_CID_1, ethers.ZeroHash))
        .to.be.revertedWith("AegisAccessControl: Recipient DID cannot be zero");
    });

    it("Should revert if trying to revoke access from zero DID", async function () {
      await expect(accessControl.connect(user1).revokeAccess(TEST_FILE_CID_1, ethers.ZeroHash))
        .to.be.revertedWith("AegisAccessControl: Access not granted");
    });
  });
});
