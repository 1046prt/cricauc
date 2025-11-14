import { Controller, Get, Post, Body, Query, UseGuards, Param } from '@nestjs/common';
import { StatsService } from './stats.service';
import { CreateHistoricalPointsDto } from './dto/create-historical-points.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('player/:playerId')
  findByPlayer(@Param('playerId') playerId: string) {
    return this.statsService.findByPlayer(playerId);
  }

  @Get('season')
  findBySeason(@Query('season') season: string, @Query('leagueType') leagueType: string) {
    return this.statsService.findBySeason(season, leagueType);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createDto: CreateHistoricalPointsDto) {
    return this.statsService.create(createDto);
  }

  @Post('bulk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  bulkCreate(@Body() points: CreateHistoricalPointsDto[]) {
    return this.statsService.bulkCreate(points);
  }
}

