import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Get()
  findAll(@Query('leagueId') leagueId?: string) {
    return this.auctionsService.findAll(leagueId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auctionsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createAuctionDto: CreateAuctionDto) {
    return this.auctionsService.create(createAuctionDto);
  }

  @Post(':id/start')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  start(@Param('id') id: string) {
    return this.auctionsService.startAuction(id);
  }

  @Post(':id/end')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  end(@Param('id') id: string) {
    return this.auctionsService.endAuction(id);
  }

  @Post(':id/pause')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  pause(@Param('id') id: string) {
    return this.auctionsService.pauseAuction(id);
  }

  @Post(':id/resume')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  resume(@Param('id') id: string) {
    return this.auctionsService.resumeAuction(id);
  }

  @Post(':id/bid')
  @UseGuards(JwtAuthGuard)
  async placeBid(
    @Param('id') id: string,
    @Body('teamId') teamId: string,
    @Body('amount') amount: number,
    @CurrentUser() user: User,
  ) {
    return this.auctionsService.placeBid(id, teamId, user.id, amount);
  }
}
