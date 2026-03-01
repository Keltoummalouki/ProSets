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

    // Generate proper S3 keys for files
    const timestamp = Date.now();
    const fileKey = `s3://prosets-private/assets/${timestamp}/${data.fileKey || data.name}`;
    const previewUrls = data.previewUrls
      ? data.previewUrls.map((url: string) => `s3://prosets-public/previews/${timestamp}/${url}`)
      : [];

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
  async update(@Param('id') id: string, @Body() data: any) {
    try {
      console.log('Updating asset:', id, data);

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

      const updateData: any = {
        name: data.name,
        description: data.description || '',
        price: parseFloat(data.price) || 0,
        categoryId,
      };

      // Only update status if provided
      if (data.status) {
        updateData.status = data.status;
      }

      console.log('Update data:', updateData);

      return this.assetsService.update(id, updateData);
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      console.log('Deleting asset:', id);
      return this.assetsService.delete(id);
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }
}
