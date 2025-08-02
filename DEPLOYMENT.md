# Deployment Guide

## Prerequisites

### System Requirements
- Node.js 18+ dan npm
- Python 3.8+ dan pip
- Git untuk version control
- MetaMask browser extension

### Network Setup
Konfigurasi MetaMask untuk Lisk Sepolia Testnet:
- **Network Name**: Lisk Sepolia Testnet
- **RPC URL**: https://rpc.sepolia-api.lisk.com
- **Chain ID**: 4202
- **Currency Symbol**: ETH
- **Block Explorer**: https://sepolia-blockscout.lisk.com

## Step-by-Step Deployment

### 1. Clone dan Setup Repository
```bash
git clone https://github.com/ntshap/aegis-digital.git
cd aegis-digital-project
```

### 2. Deploy Smart Contracts
```bash
cd aegis-digital-contracts
npm install
npx hardhat compile

# Deploy ke Lisk Sepolia
npx hardhat run scripts/deploy.ts --network lisk-sepolia

# Copy contract addresses ke frontend config
```

### 3. Setup AI Backend
```bash
cd ../aegis-digital-ai-backend

# Install dependencies
pip install fastapi uvicorn pillow python-multipart

# Start backend server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend akan berjalan di `http://localhost:8000`

### 4. Setup Frontend
```bash
cd ../aegis-digital-frontend/my-app

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_AI_BACKEND_URL=http://127.0.0.1:8000" > .env.local

# Update contract addresses di src/config/contracts.ts dengan addresses dari deployment

# Start development server
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

### 5. Testing Deployment

#### Test AI Backend
```bash
curl -X GET http://localhost:8000/
# Expected: {"message": "Aegis Digital AI Backend is running!", "version": "1.0.0"}
```

#### Test Frontend
1. Buka http://localhost:3000
2. Connect MetaMask wallet
3. Register DID
4. Upload file untuk testing

## Production Deployment

### Backend Production Setup
```bash
# Install production dependencies
pip install gunicorn

# Start with gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend Production Build
```bash
# Build production version
npm run build

# Start production server
npm start
```

### Environment Variables (Production)
```env
# .env.local
NEXT_PUBLIC_AI_BACKEND_URL=https://your-ai-backend-domain.com
NODE_ENV=production

# Backend environment
CORS_ORIGINS=["https://your-frontend-domain.com"]
MAX_FILE_SIZE=52428800
```

## Docker Deployment

### AI Backend Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY app/ ./app/
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  frontend:
    build: ./aegis-digital-frontend/my-app
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_AI_BACKEND_URL=http://backend:8000
    depends_on:
      - backend

  backend:
    build: ./aegis-digital-ai-backend
    ports:
      - "8000:8000"
    environment:
      - CORS_ORIGINS=["http://localhost:3000"]
```

## Monitoring dan Maintenance

### Health Checks
- Frontend: `http://localhost:3000/`
- Backend: `http://localhost:8000/`
- Smart Contracts: Check deployment di block explorer

### Logs Monitoring
```bash
# Backend logs
tail -f /var/log/aegis-backend.log

# Frontend logs (dalam production)
pm2 logs aegis-frontend
```

### Performance Monitoring
- Response time monitoring
- Error rate tracking
- Resource usage (CPU, Memory)

## Troubleshooting

### Common Issues

#### MetaMask Connection Issues
- Pastikan network sudah dikonfigurasi dengan benar
- Clear MetaMask cache jika diperlukan
- Check RPC URL accessibility

#### Smart Contract Deployment Gagal
- Pastikan wallet memiliki ETH untuk gas fees
- Verify network configuration di hardhat.config.ts
- Check contract compilation berhasil

#### AI Backend Not Responding
- Verify port 8000 tidak digunakan aplikasi lain
- Check Python dependencies terinstall
- Validate file permissions

#### Frontend Build Errors
- Clear npm cache: `npm cache clean --force`
- Delete node_modules dan reinstall
- Check Node.js version compatibility

### Debug Commands
```bash
# Check ports
netstat -tulpn | grep :3000
netstat -tulpn | grep :8000

# Check processes
ps aux | grep node
ps aux | grep python

# Check logs
journalctl -u aegis-frontend
journalctl -u aegis-backend
```

## Security Checklist

### Production Security
- [ ] Update CORS origins untuk production domain
- [ ] Setup HTTPS untuk frontend dan backend
- [ ] Environment variables tidak di-commit ke repository
- [ ] Rate limiting untuk API endpoints
- [ ] Input validation di semua endpoints
- [ ] Regular dependency updates

### Smart Contract Security
- [ ] Audit smart contracts sebelum mainnet deployment
- [ ] Multi-sig wallet untuk contract ownership
- [ ] Timelock untuk critical functions
- [ ] Event monitoring untuk suspicious activities

## Backup dan Recovery

### Code Backup
- Regular commit ke Git repository
- Automated backups ke cloud storage
- Documentation updates

### Configuration Backup
- Environment variables
- Smart contract addresses
- Deployment scripts

### Recovery Procedures
1. Restore dari Git repository
2. Redeploy smart contracts jika diperlukan
3. Update configuration files
4. Restart services
5. Verify functionality

---

**Happy Deploying!** 🚀

Untuk bantuan tambahan, buka issue di repository atau hubungi tim development.
