import { Injectable, Logger } from '@nestjs/common';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class AssetsPresignerService {
  private s3Client: S3Client | null = null;
  private readonly logger = new Logger(AssetsPresignerService.name);
  private readonly isDev = process.env.NODE_ENV !== 'production';

  constructor() {
    // Only initialize S3 client if credentials are provided
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      this.s3Client = new S3Client({
        region: process.env.AWS_REGION || 'us-east-1',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      });
    } else if (!this.isDev) {
      this.logger.warn('AWS credentials not configured. S3 presigned URLs will not work in production.');
    }
  }

  async getPresignedUrl(s3Key: string, expiresIn: number = 3600): Promise<string> {
    // In development without AWS credentials, return a placeholder image URL
    if (!this.s3Client) {
      this.logger.debug(`Returning placeholder URL for ${s3Key}`);
      return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23374151" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-size="20" fill="%239CA3AF" text-anchor="middle" dominant-baseline="middle"%3EPreview Image%3C/text%3E%3C/svg%3E`;
    }

    try {
      // Handle both full S3 URIs and just keys
      const key = s3Key.startsWith('s3://') ? s3Key.split('/').slice(3).join('/') : s3Key;
      const bucket = process.env.AWS_S3_BUCKET || 'prosets-public';

      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      const url = await getSignedUrl(this.s3Client, command, { expiresIn });
      return url;
    } catch (error) {
      this.logger.error('Error generating presigned URL:', error);
      // Return placeholder on error
      return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23374151" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-size="20" fill="%239CA3AF" text-anchor="middle" dominant-baseline="middle"%3EPreview Image%3C/text%3E%3C/svg%3E`;
    }
  }

  async getPresignedUrls(s3Keys: string[], expiresIn: number = 3600): Promise<string[]> {
    return Promise.all(s3Keys.map((key) => this.getPresignedUrl(key, expiresIn)));
  }
}
