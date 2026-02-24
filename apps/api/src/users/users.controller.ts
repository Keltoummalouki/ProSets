import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async getProfile() {
    // TODO: Extract user ID from JWT
    return this.usersService.findById('user-id');
  }

  @Patch('me')
  @UseGuards(AuthGuard)
  async updateProfile(@Body() data: any) {
    // TODO: Extract user ID from JWT
    return this.usersService.update('user-id', data);
  }
}
