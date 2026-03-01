import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import type { Request } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('checkout')
  async createCheckout(@Body() data: { assetId: string; userId: string }) {
    return this.paymentsService.createCheckoutSession(data);
  }

  @Get('session/:sessionId')
  async getSessionDetails(@Param('sessionId') sessionId: string) {
    return this.paymentsService.getSessionDetails(sessionId);
  }

  @Post('webhook')
  async handleWebhook(@Req() req: RawBodyRequest<Request>) {
    return this.paymentsService.handleStripeWebhook(req);
  }
}
