import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { Team } from './entities/team.entity';
import { TeamPlayer } from './entities/team-player.entity';
import { League } from '../leagues/entities/league.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Team, TeamPlayer, League])],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}
