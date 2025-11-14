import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LeaguesModule } from './leagues/leagues.module';
import { TeamsModule } from './teams/teams.module';
import { PlayersModule } from './players/players.module';
import { AuctionsModule } from './auctions/auctions.module';
import { DraftsModule } from './drafts/drafts.module';
import { TradesModule } from './trades/trades.module';
import { TransactionsModule } from './transactions/transactions.module';
import { StatsModule } from './stats/stats.module';
import { AdminModule } from './admin/admin.module';
import { dataSourceOptions } from './data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    AuthModule,
    UsersModule,
    LeaguesModule,
    TeamsModule,
    PlayersModule,
    AuctionsModule,
    DraftsModule,
    TradesModule,
    TransactionsModule,
    StatsModule,
    AdminModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
