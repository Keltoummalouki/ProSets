import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private prisma: PrismaClient;
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    try {
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });
      const adapter = new PrismaPg(pool);
      this.prisma = new PrismaClient({ adapter });
      this.logger.debug('PrismaClient initialized successfully');
    } catch (error) {
      this.logger.error(
        'Failed to initialize PrismaClient. Ensure "prisma generate" has been run.',
        error,
      );
      throw error;
    }
  }

  async onModuleInit() {
    try {
      await this.prisma.$connect();
      this.logger.log('Database connection established');
    } catch (error) {
      this.logger.error('Failed to connect to database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
    this.logger.log('Database connection closed');
  }

  get asset() {
    return this.prisma.asset;
  }

  get category() {
    return this.prisma.category;
  }

  get order() {
    return this.prisma.order;
  }

  get user() {
    return this.prisma.user;
  }
}
