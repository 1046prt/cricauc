import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionsService } from './auctions.service';
import { AuctionsController } from './auctions.controller';
import { AuctionGateway } from './auction.gateway';
import { Auction } from './entities/auction.entity';
import { Bid } from './entities/bid.entity';
import { Team } from '../teams/entities/team.entity';
import { League } from '../leagues/entities/league.entity';
import { Player } from '../players/entities/player.entity';
import { TeamsModule } from '../teams/teams.module';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auction, Bid, Team, League, Player]),
    TeamsModule,
    TransactionsModule,
  ],
  controllers: [AuctionsController],
  providers: [AuctionsService, AuctionGateway],
  exports: [AuctionsService],
})
export class AuctionsModule {}

