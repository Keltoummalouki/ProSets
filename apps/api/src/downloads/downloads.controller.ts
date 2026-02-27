import {
  Controller,
  Get,
  Param,
  Query,
  BadRequestException,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { DownloadsService } from './downloads.service';
import type { Response } from 'express';

@Controller('downloads')
export class DownloadsController {
  constructor(private readonly downloadsService: DownloadsService) {}

  @Get(':assetId')
  async getDownloadUrl(
    @Param('assetId') assetId: string,
    @Query('userId') userId: string,
    @Res() res: Response,
  ) {
    if (!userId) {
      throw new BadRequestException('userId is required');
    }

    try {
      const url = await this.downloadsService.generateDownloadUrl(
        assetId,
        userId,
      );
      res.json({ url });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }
}
