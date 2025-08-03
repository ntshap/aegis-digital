// Note: ipfs-http-client is imported dynamically to avoid SSR issues
const IPFS_URL = process.env.NEXT_PUBLIC_IPFS_URL || 'http://localhost:5001';

interface IPFSClient {
  add: (file: Uint8Array | string | File) => Promise<{ cid: { toString(): string } }>;
  cat: (cid: string) => AsyncIterable<Uint8Array>;
}

export class IPFSService {
  private client: IPFSClient | null = null;

  private async getClient() {
    if (typeof window === 'undefined') {
      throw new Error('IPFS client can only be used in the browser');
    }

    if (!this.client) {
      try {
        // Dynamic import to avoid SSR issues
        const { create } = await import('ipfs-http-client');
        this.client = create({ url: IPFS_URL });
      } catch (error) {
        console.error('Failed to initialize IPFS client:', error);
        throw new Error('Failed to initialize IPFS client');
      }
    }

    return this.client;
  }
  /**
   * @notice Mengunggah sebuah file ke IPFS.
   * @param file Objek File yang akan diunggah.
   * @returns IPFS Content Identifier (CID).
   */
  public async uploadFile(file: File): Promise<string> {
    try {
      // Check if we're in the browser
      if (typeof window === 'undefined') {
        throw new Error('File upload can only be performed in the browser');
      }

      // Menggunakan API route Next.js sebagai proxy untuk upload IPFS
      // Ini membantu mengatasi masalah CORS dan menyembunyikan IPFS credentials
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload-ipfs', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.ipfsHash;
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`IPFS upload failed: ${errorMessage}`);
    }
  }

  /**
   * Alternative direct IPFS upload method (use only in browser)
   * @param file File to upload
   * @returns IPFS hash
   */
  public async uploadFileDirect(file: File): Promise<string> {
    try {
      const client = await this.getClient();
      
      const result = await client.add(file);
      return result.cid.toString();
    } catch (error) {
      console.error('Error uploading file directly to IPFS:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Direct IPFS upload failed: ${errorMessage}`);
    }
  }
}

export const ipfsService = new IPFSService();
