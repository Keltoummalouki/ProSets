import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

@Injectable()
export class PrismaService {
  private static instance: PrismaClient;

  private static getInstance(): PrismaClient {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaClient();
    }
    return PrismaService.instance;
  }

  get asset() {
    return PrismaService.getInstance().asset;
  }

  get category() {
    return PrismaService.getInstance().category;
  }

  get order() {
    return PrismaService.getInstance().order;
  }

  get user() {
    return PrismaService.getInstance().user;
  }
}
