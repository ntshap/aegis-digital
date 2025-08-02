# Aegis Digital - Penjaga Kedaulatan Diri Digital

Aegis Digital adalah platform blockchain yang memungkinkan pengguna untuk mengontrol data digital mereka dengan menggunakan teknologi Decentralized Identity (DID), IPFS untuk penyimpanan file terdesentralisasi, dan AI untuk analisis file otomatis.

## 🏗️ Arsitektur Sistem

### Frontend (Next.js + React)
- **Framework**: Next.js 15.4.5 dengan React 19
- **UI Library**: Tailwind CSS untuk styling
- **Blockchain Integration**: Wagmi v2 untuk interaksi dengan smart contract
- **IPFS**: ipfs-http-client untuk penyimpanan file terdesentralisasi
- **TypeScript**: Type safety dan developer experience yang lebih baik

### Backend AI (FastAPI + Python)
- **Framework**: FastAPI untuk REST API
- **AI Processing**: PIL untuk analisis gambar, text processing untuk dokumen
- **Hash Generation**: SHA256 untuk deteksi duplikasi file
- **CORS**: Konfigurasi untuk cross-origin requests

### Smart Contracts (Solidity + Hardhat)
- **AegisDIDRegistry**: Manajemen identitas terdesentralisasi
- **AegisFileRegistry**: Registry file dengan ownership tracking
- **AegisAccessControl**: Kontrol akses file berbasis DID
- **Network**: Lisk Sepolia Testnet

## 🚀 Fitur Utama

### 1. Decentralized Identity (DID)
- Registrasi DID unik untuk setiap pengguna
- Mapping DID ke alamat wallet Ethereum
- Kontrol penuh atas identitas digital

### 2. File Management
- Upload file ke IPFS dengan enkripsi
- Registrasi file di blockchain dengan proof of ownership
- Analisis AI otomatis untuk setiap file yang diupload

### 3. Access Control
- Grant/revoke akses file berbasis DID
- Granular permission management
- Audit trail untuk setiap akses file

### 4. AI Analysis
- Deteksi duplikasi file menggunakan hash comparison
- Analisis konten gambar (resolusi, format, thumbnail detection)
- Summarization untuk file teks
- Ekstraksi keywords otomatis

## 📁 Struktur Project

```
aegis-digital-project/
├── aegis-digital-frontend/my-app/    # Next.js Frontend
│   ├── src/
│   │   ├── app/                      # App Router
│   │   ├── components/               # React Components
│   │   ├── config/                   # Contract configs
│   │   ├── hooks/                    # Custom React hooks
│   │   └── services/                 # External services
├── aegis-digital-ai-backend/         # FastAPI Backend
│   └── app/
│       ├── models/                   # AI models
│       └── main.py                   # FastAPI app
└── aegis-digital-contracts/          # Smart Contracts
    ├── contracts/                    # Solidity contracts
    ├── scripts/                      # Deployment scripts
    └── test/                         # Contract tests
```

## 🛠️ Setup dan Installation

### Prerequisites
- Node.js 18+
- Python 3.8+
- MetaMask browser extension
- Git

### 1. Clone Repository
```bash
git clone https://github.com/ntshap/aegis-digital.git
cd aegis-digital-project
```

### 2. Frontend Setup
```bash
cd aegis-digital-frontend/my-app
npm install
npm run dev
```

### 3. Backend AI Setup
```bash
cd aegis-digital-ai-backend
pip install fastapi uvicorn pillow python-multipart
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Smart Contracts Setup
```bash
cd aegis-digital-contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy.ts --network lisk-sepolia
```

## 🔧 Konfigurasi

### Environment Variables
```env
# Frontend (.env.local)
NEXT_PUBLIC_AI_BACKEND_URL=http://127.0.0.1:8000

# Backend
CORS_ORIGINS=["http://localhost:3000"]
```

### MetaMask Network Configuration
- **Network Name**: Lisk Sepolia Testnet
- **RPC URL**: https://rpc.sepolia-api.lisk.com
- **Chain ID**: 4202
- **Currency Symbol**: ETH
- **Block Explorer**: https://sepolia-blockscout.lisk.com

## 🏃‍♂️ Menjalankan Aplikasi

1. **Start Backend AI**:
   ```bash
   cd aegis-digital-ai-backend
   uvicorn app.main:app --reload
   ```

2. **Start Frontend**:
   ```bash
   cd aegis-digital-frontend/my-app
   npm run dev
   ```

3. **Connect MetaMask** ke Lisk Sepolia Testnet

4. **Access Application** di http://localhost:3000

## 📋 API Documentation

### AI Backend Endpoints

#### GET /
- **Description**: Health check endpoint
- **Response**: Status dan versi aplikasi

#### POST /analyze-file
- **Description**: Analisis file dengan AI
- **Request**: Multipart form dengan file
- **Response**: 
  ```json
  {
    "filename": "example.jpg",
    "file_type": "image/jpeg",
    "ai_analysis": {
      "image_hash": "sha256...",
      "is_duplicate": false,
      "tags": ["high_resolution", "color_image"]
    }
  }
  ```

### Smart Contract Methods

#### AegisDIDRegistry
- `registerDID()`: Daftarkan DID baru
- `getDID(address)`: Ambil DID dari alamat
- `getAddressFromDID(bytes32)`: Ambil alamat dari DID

#### AegisFileRegistry
- `uploadFile(bytes32, bytes32)`: Daftarkan file baru
- `getFileOwner(bytes32)`: Ambil pemilik file
- `doesFileExist(bytes32)`: Cek keberadaan file

#### AegisAccessControl
- `grantAccess(bytes32, bytes32)`: Berikan akses file
- `revokeAccess(bytes32, bytes32)`: Cabut akses file
- `checkAccess(bytes32, bytes32)`: Cek status akses

## 🧪 Testing

### Frontend Testing
```bash
npm run test
npm run lint
```

### Smart Contract Testing
```bash
npx hardhat test
npx hardhat coverage
```

### Backend Testing
```bash
pytest app/tests/
```

## 📚 Technical Documentation

### Architecture Decisions
1. **Next.js App Router**: Untuk performance dan SEO yang lebih baik
2. **Wagmi v2**: Library terbaru untuk Web3 integration
3. **IPFS**: Penyimpanan terdesentralisasi untuk file
4. **Lisk Sepolia**: Testnet yang kompatibel dengan Ethereum

### Security Considerations
1. **DID-based Access Control**: Setiap akses dikontrol oleh DID
2. **Hash Verification**: File integrity menggunakan SHA256
3. **Smart Contract Ownership**: Ownable pattern untuk admin functions
4. **Input Validation**: Validasi input di frontend dan backend

### Performance Optimizations
1. **React Hooks**: Custom hooks untuk reusable logic
2. **Service Layer**: Abstraksi untuk external services
3. **Error Handling**: Comprehensive error handling di semua layer
4. **Type Safety**: TypeScript untuk compile-time checks

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Project ini menggunakan MIT License. Lihat file `LICENSE` untuk detail.

## 🔗 Links

- [Lisk Documentation](https://docs.lisk.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

---

**Aegis Digital** - Protecting your digital sovereignty with blockchain technology.
