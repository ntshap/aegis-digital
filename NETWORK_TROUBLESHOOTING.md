# Network Connection Troubleshooting Guide

## Common Issues and Solutions

### 1. "Network connection error. Please check your connection to Lisk Sepolia"

**Possible Causes:**
- Wallet not connected to Lisk Sepolia network
- RPC endpoint is down or overloaded
- Internet connectivity issues
- Firewall blocking requests

**Solutions:**
1. **Switch to Lisk Sepolia Network in MetaMask:**
   - Open MetaMask
   - Click on network dropdown
   - Add Lisk Sepolia if not present:
     - Network Name: Lisk Sepolia Testnet
     - RPC URL: https://rpc.sepolia-api.lisk.com
     - Chain ID: 4202
     - Currency Symbol: ETH
     - Block Explorer: https://sepolia-blockscout.lisk.com

2. **Check Internet Connection:**
   - Ensure stable internet connection
   - Try refreshing the page
   - Check if other websites work

3. **Clear Browser Cache:**
   - Clear browser cache and cookies
   - Disable browser extensions that might interfere
   - Try incognito/private mode

### 2. "Upload failed: Network connection error"

**Possible Causes:**
- IPFS node not accessible
- File too large
- Network timeout

**Solutions:**
1. **Use Alternative IPFS Services:**
   - Configure Pinata API keys in `.env.local`
   - Use Web3.Storage as fallback
   - Check if local IPFS node is running

2. **File Size Optimization:**
   - Ensure file is less than 10MB
   - Compress large files before upload

### 3. "Contract is not accessible"

**Possible Causes:**
- Wrong network selected
- Contract address incorrect
- RPC endpoint issues

**Solutions:**
1. **Verify Network:**
   - Ensure connected to Lisk Sepolia (Chain ID: 4202)
   - Check contract addresses in config/contracts.ts

2. **Reset Wallet:**
   - Reset MetaMask account (Settings > Advanced > Reset Account)
   - Reconnect wallet to the application

### 4. "Insufficient ETH balance for gas fees"

**Solutions:**
1. **Get Test ETH:**
   - Visit Lisk Sepolia faucet
   - Add at least 0.002 ETH to your wallet
   - Wait for transaction confirmation

### 5. General Network Issues

**Quick Fixes:**
1. **Refresh Connection:**
   - Disconnect and reconnect wallet
   - Refresh browser page
   - Wait 30 seconds between attempts

2. **Check RPC Status:**
   - Try alternative RPC endpoints
   - Check Lisk network status

3. **Browser Console Debugging:**
   - Open browser developer tools (F12)
   - Check console for specific error messages
   - Look for network request failures

## Environment Configuration

### Required Environment Variables
```
NEXT_PUBLIC_AI_API_URL=http://localhost:8000/api/analyze-file
NEXT_PUBLIC_IPFS_URL=http://localhost:5001
NEXT_PUBLIC_CHAIN_ID=4202
NEXT_PUBLIC_RPC_URL=https://rpc.sepolia-api.lisk.com
```

### Optional IPFS Configuration
```
# For production IPFS uploads
PINATA_API_KEY=your_pinata_api_key
PINATA_API_SECRET=your_pinata_secret
WEB3_STORAGE_TOKEN=your_web3_storage_token
```

## Monitoring and Debugging

### Check Network Status
1. Open browser console (F12)
2. Look for network-related errors
3. Check if RPC calls are failing
4. Monitor transaction status

### Verify Contract Deployment
- File Registry: 0xbBE261ba394CE8B890FBC1974F0402e681A5EE85
- DID Registry: 0xBb23087a2C1D0D1C430c119434De91be7516EA69
- Access Control: 0x144A3FD873A1E4e443f45eBAcFce7Afc60f557f9

### Test Connection
Run the test script to verify blockchain connectivity:
```bash
node test-contract-debug.js
```

## Recovery Steps

If all else fails:
1. Clear all browser data for the application
2. Reset MetaMask account
3. Re-add Lisk Sepolia network manually
4. Restart browser
5. Try from a different browser/device

## Contact Support

If issues persist:
- Check browser console for error messages
- Note the exact error message and steps to reproduce
- Include your wallet address and transaction hashes if applicable
