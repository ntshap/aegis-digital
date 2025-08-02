# Components Documentation

## ConnectWalletButton

### Purpose
Handles wallet connection and disconnection using MetaMask connector.

### Props
None

### State
- Uses `useAccount`, `useConnect`, `useDisconnect` hooks from Wagmi

### Functionality
- **Connect**: Initiates MetaMask connection
- **Disconnect**: Terminates current wallet connection
- **Display**: Shows connected wallet address in truncated format

### Usage
```tsx
import { ConnectWalletButton } from '@/components/ConnectWalletButton';

<ConnectWalletButton />
```

---

## FileUploadSection

### Purpose
Comprehensive file upload, IPFS storage, AI analysis, and blockchain registration.

### Dependencies
- IPFS client for file storage
- AI backend for file analysis
- Smart contracts for file registration
- DID operations for ownership

### Key Features
1. **DID Registration**: Register new DID for user
2. **File Upload**: Upload to IPFS with CID generation
3. **AI Analysis**: Automatic file analysis via backend
4. **Blockchain Registration**: Register file on Lisk network
5. **Access Management**: Grant access to other users

### State Management
- `selectedFile`: Currently selected file
- `uploadStatus`: Status messages for user feedback
- `aiAnalysisResult`: AI analysis results
- `fileCIDToShare`: CID for sharing functionality
- `recipientDID`: Target DID for access grant

### Error Handling
- Network connectivity issues
- Smart contract transaction failures
- IPFS upload failures
- AI backend communication errors

---

## FileListSection

### Purpose
Display user's files and manage access control.

### Features
1. **File Listing**: Display user's uploaded files (placeholder)
2. **Access Revocation**: Remove access from specific users
3. **Access Checking**: Verify current access permissions

### Smart Contract Integration
- Reads user DID from blockchain
- Interacts with access control contract
- Manages revocation transactions

### State Management
- `status`: Operation status messages
- `fileList`: User's file collection
- `fileCIDToRevoke`: Target file for access revocation
- `recipientDIDToRevoke`: Target user for access revocation
- `accessStatus`: Current access verification result

---

## Component Patterns

### Error Handling Pattern
```tsx
try {
  await operation();
  setStatus('Success message');
} catch (error: any) {
  setStatus(`Operation failed: ${error.message}`);
}
```

### Loading State Pattern
```tsx
<button 
  disabled={isLoading || !canPerformAction}
  className="btn-primary disabled:opacity-50"
>
  {isLoading ? 'Processing...' : 'Action'}
</button>
```

### Form Validation Pattern
```tsx
const isValid = field1 && field2 && isConnected;
```

## Styling Guidelines

### CSS Classes
- `btn-primary`: Blue action buttons
- `btn-success`: Green success buttons  
- `btn-danger`: Red destructive buttons
- `input-field`: Standard input styling
- `disabled:opacity-50`: Disabled state styling

### Color Scheme
- Background: Gray-900 (#1a202c)
- Cards: Gray-700, Gray-800
- Text: White, Gray-300
- Accents: Purple, Pink, Indigo gradients

### Responsive Design
- Mobile-first approach
- Flexible layouts with space-y and grid utilities
- Readable typography scales
