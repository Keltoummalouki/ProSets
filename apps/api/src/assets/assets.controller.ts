import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  async findAll(
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.assetsService.findAll({
      category,
      search,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.assetsService.findById(id);
  }

  @Post()
  async create(@Body() data: any) {
    console.log('Received asset data:', data);

    if (!data.name) {
      throw new BadRequestException('Asset name is required');
    }

    // Map category name to ID
    const categoryMap: Record<string, string> = {
      '3D Models': 'cat_3d_models',
      'Code Snippets': 'cat_code_snippets',
      'Notion Templates': 'cat_notion_templates',
      'UI Kits': 'cat_ui_kits',
    };

    const categoryId = categoryMap[data.categoryId] || data.categoryId;

    // TODO: In production, upload base64 files to S3
    // For now, just store the file names
    const fileKey = data.fileKey || `assets/${Date.now()}/${data.name}`;
    const previewUrls = data.previewUrls || [];

    return this.assetsService.create({
      name: data.name,
      description: data.description || '',
      price: parseFloat(data.price) || 0,
      categoryId,
      sellerId: data.sellerId || 'seller_123',
      status: data.status || 'ACTIVE',
      fileKey,
      previewUrls,
    });
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() data: any) {
    return this.assetsService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string) {
    return this.assetsService.delete(id);
  }
}
