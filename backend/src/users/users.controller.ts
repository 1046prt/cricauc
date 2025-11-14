import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async getProfile(@CurrentUser() user: User) {
    return this.usersService.findOne(user.id);
  }

  @Put('me')
  async updateProfile(@CurrentUser() user: User, @Body() updateData: Partial<User>) {
    return this.usersService.updateProfile(user.id, updateData);
  }
}

