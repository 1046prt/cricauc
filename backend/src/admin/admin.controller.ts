import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { CreatePlayerDto } from '../players/dto/create-player.dto';
import { CreateHistoricalPointsDto } from '../stats/dto/create-historical-points.dto';
import { AuditAction } from './entities/audit-log.entity';
import * as csv from 'csv-parser';
import { Readable } from 'stream';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('audit-logs')
  getAuditLogs(
    @Query('userId') userId?: string,
    @Query('action') action?: AuditAction,
    @Query('entityType') entityType?: string,
  ) {
    return this.adminService.getAuditLogs({ userId, action, entityType });
  }

  @Post('auctions/:id/force-end')
  forceEndAuction(@Param('id') id: string, @CurrentUser() user: User, @Req() req: any) {
    return this.adminService.forceEndAuction(id, user.id, req.ip);
  }

  @Post('teams/:id/adjust-purse')
  adjustPurse(
    @Param('id') id: string,
    @Body('amount') amount: number,
    @CurrentUser() user: User,
    @Req() req: any,
  ) {
    return this.adminService.adjustPurse(id, amount, user.id, req.ip);
  }

  @Post('players/upload')
  uploadPlayers(@Body() players: CreatePlayerDto[], @CurrentUser() user: User, @Req() req: any) {
    return this.adminService.uploadPlayers(players, user.id, req.ip);
  }

  @Post('players/upload-csv')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPlayersCSV(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
    @Req() req: any,
  ) {
    const players: CreatePlayerDto[] = [];
    const stream = Readable.from(file.buffer.toString());

    return new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (row) => {
          players.push({
            name: row.name,
            role: row.role,
            nationality: row.nationality,
            age: parseInt(row.age) || undefined,
            basePrice: parseFloat(row.basePrice) || undefined,
            isActive: row.isActive !== 'false',
          });
        })
        .on('end', async () => {
          try {
            const result = await this.adminService.uploadPlayers(players, user.id, req.ip);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        })
        .on('error', reject);
    });
  }

  @Post('stats/upload')
  uploadHistoricalPoints(
    @Body() points: CreateHistoricalPointsDto[],
    @CurrentUser() user: User,
    @Req() req: any,
  ) {
    return this.adminService.uploadHistoricalPoints(points, user.id, req.ip);
  }

  @Post('stats/upload-csv')
  @UseInterceptors(FileInterceptor('file'))
  async uploadStatsCSV(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
    @Req() req: any,
  ) {
    const points: CreateHistoricalPointsDto[] = [];
    const stream = Readable.from(file.buffer.toString());

    return new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (row) => {
          points.push({
            playerId: row.playerId,
            season: row.season,
            leagueType: row.leagueType,
            totalPoints: parseInt(row.totalPoints),
            matchesPlayed: parseInt(row.matchesPlayed) || 0,
            runs: parseInt(row.runs) || 0,
            wickets: parseInt(row.wickets) || 0,
          });
        })
        .on('end', async () => {
          try {
            const result = await this.adminService.uploadHistoricalPoints(points, user.id, req.ip);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        })
        .on('error', reject);
    });
  }
}
