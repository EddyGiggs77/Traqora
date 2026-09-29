import { logger } from '../../utils/logger';

export interface IPFSUploadResult {
  cid: string;
  gatewayUrl: string;
}

export class IPFSService {
  private gatewayUrl = process.env.IPFS_GATEWAY_URL || 'https://ipfs.io/ipfs/';

  async uploadBuffer(buffer: Buffer, filename: string): Promise<IPFSUploadResult> {
    const fakeCid = 'Qm' + Buffer.from(filename + Date.now()).toString('hex').slice(0, 44);
    logger.info('File uploaded to IPFS simulator', { filename, cid: fakeCid, size: buffer.length });
    return {
      cid: fakeCid,
      gatewayUrl: `${this.gatewayUrl}${fakeCid}`,
    };
  }

  async uploadJSON(data: unknown): Promise<IPFSUploadResult> {
    const jsonString = JSON.stringify(data);
    return this.uploadBuffer(Buffer.from(jsonString), 'metadata.json');
  }
}

export const ipfsService = new IPFSService();
