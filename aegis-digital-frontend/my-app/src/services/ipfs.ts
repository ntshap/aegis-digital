import type { IPFSHTTPClient } from 'ipfs-http-client';

let ipfsClient: IPFSHTTPClient | null = null;

const initIPFS = async (): Promise<IPFSHTTPClient> => {
  if (typeof window === 'undefined') {
    throw new Error('IPFS can only be used in browser environment');
  }
  
  if (!ipfsClient) {
    const { create } = await import('ipfs-http-client');
    ipfsClient = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
    });
  }
  
  return ipfsClient;
};

export class IPFSService {
  static async uploadFile(file: File): Promise<string> {
    try {
      const ipfs = await initIPFS();
      const result = await ipfs.add(file);
      return result.cid.toString();
    } catch (error) {
      throw new Error(`IPFS upload failed: ${error}`);
    }
  }

  static async getFileUrl(cid: string): Promise<string> {
    return `https://ipfs.infura.io/ipfs/${cid}`;
  }
}
