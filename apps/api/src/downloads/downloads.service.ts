import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class DownloadsService {
  private s3Client: S3Client;

  constructor(private prisma: PrismaService) {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  }

  async generateDownloadUrl(assetId: string, userId: string): Promise<string> {
    // Verify asset exists
    const asset = await this.prisma.asset.findUnique({
      where: { id: assetId },
    });

    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    // Verify user has purchased this asset
    const order = await this.prisma.order.findFirst({
      where: {
        userId,
        assetId,
        status: 'PAID',
      },
    });

    if (!order) {
      throw new ForbiddenException(
        'You do not have access to this asset. Please purchase it first.',
      );
    }

    // Generate presigned URL for S3 file (5 minute expiration)
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET || 'prosets-public',
      Key: asset.fileKey,
    });

    try {
      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: 300, // 5 minutes
      });
      return url;
    } catch (error) {
      // If AWS credentials aren't configured, return a placeholder
      if (!process.env.AWS_ACCESS_KEY_ID) {
        return `s3://${process.env.AWS_S3_BUCKET}/${asset.fileKey}?placeholder=true`;
      }
      throw error;
    }
  }
}
