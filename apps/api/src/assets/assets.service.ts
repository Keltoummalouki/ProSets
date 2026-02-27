import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AssetsPresignerService } from './assets-presigner.service';

@Injectable()
export class AssetsService {
  constructor(
    private prisma: PrismaService,
    private presigner: AssetsPresignerService,
  ) {}

  async findAll(filters: {
    category?: string;
    search?: string;
    page: number;
    limit: number;
  }) {
    const { category, search, page, limit } = filters;
    const skip = (page - 1) * limit;

    const where: any = {
      status: 'ACTIVE',
    };

    if (category) {
      where.category = { slug: category };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [assets, total] = await Promise.all([
      this.prisma.asset.findMany({
        where,
        skip,
        take: limit,
        include: { category: true, seller: { select: { id: true, name: true } } },
      }),
      this.prisma.asset.count({ where }),
    ]);

    // Convert S3 URLs to presigned URLs for preview images
    const assetsWithPresignedUrls = await Promise.all(
      assets.map(async (asset) => ({
        ...asset,
        previewUrls: asset.previewUrls.length > 0
          ? await this.presigner.getPresignedUrls(asset.previewUrls, 3600)
          : [],
      })),
    );

    return {
      assets: assetsWithPresignedUrls,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const asset = await this.prisma.asset.findUnique({
      where: { id },
      include: { category: true, seller: { select: { id: true, name: true } } },
    });

    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    // Convert S3 URLs to presigned URLs
    return {
      ...asset,
      previewUrls: asset.previewUrls.length > 0
        ? await this.presigner.getPresignedUrls(asset.previewUrls, 3600)
        : [],
    };
  }

  async create(data: any) {
    return this.prisma.asset.create({
      data,
      include: { category: true, seller: true },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.asset.update({
      where: { id },
      data,
      include: { category: true, seller: true },
    });
  }

  async delete(id: string) {
    return this.prisma.asset.delete({
      where: { id },
    });
  }
}
