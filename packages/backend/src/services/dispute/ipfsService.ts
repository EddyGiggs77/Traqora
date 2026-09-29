import { logger } from '../../utils/logger';

export class IpfsService {
  async pinFile(buffer: Buffer, filename: string): Promise<string> {
    // Simulate IPFS pinning and CID generation
    const mockCid = 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi';
    logger.info('File pinned to IPFS', { filename, size: buffer.length, cid: mockCid });
    return mockCid;
  }

  async getFileUrl(cid: string): Promise<string> {
    return `https://ipfs.io/ipfs/${cid}`;
  }
}

export const ipfsService = new IpfsService();
