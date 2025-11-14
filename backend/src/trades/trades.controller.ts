import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { TradesService } from './trades.service';
import { CreateTradeDto } from './dto/create-trade.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('trades')
@UseGuards(JwtAuthGuard)
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  @Get()
  findAll(@Query('teamId') teamId?: string) {
    return this.tradesService.findAll(teamId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tradesService.findOne(id);
  }

  @Post()
  create(@Body() createTradeDto: CreateTradeDto, @CurrentUser() user: User) {
    return this.tradesService.create(createTradeDto, user.id);
  }

  @Post(':id/accept')
  accept(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tradesService.acceptTrade(id, user.id);
  }

  @Post(':id/reject')
  reject(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tradesService.rejectTrade(id, user.id);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tradesService.cancelTrade(id, user.id);
  }
}
