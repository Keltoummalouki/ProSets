import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async getUserOrders() {
    // TODO: Extract user ID from JWT
    return this.ordersService.findByUserId('user-id');
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() data: any) {
    return this.ordersService.create(data);
  }
}
