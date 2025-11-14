import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuditLog } from './entities/audit-log.entity';
import { League } from '../leagues/entities/league.entity';
import { Auction } from '../auctions/entities/auction.entity';
import { Team } from '../teams/entities/team.entity';
import { Player } from '../players/entities/player.entity';
import { PlayersModule } from '../players/players.module';
import { AuctionsModule } from '../auctions/auctions.module';
import { StatsModule } from '../stats/stats.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuditLog, League, Auction, Team, Player]),
    PlayersModule,
    AuctionsModule,
    StatsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}

