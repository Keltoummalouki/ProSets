import { Module } from '@nestjs/common';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { AssetsPresignerService } from './assets-presigner.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AssetsController],
  providers: [AssetsService, AssetsPresignerService],
  exports: [AssetsService],
})
export class AssetsModule {}
