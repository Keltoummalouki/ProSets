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
  @UseGuards(AuthGuard)
  async create(@Body() data: any) {
    return this.assetsService.create(data);
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
