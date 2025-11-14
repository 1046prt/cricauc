import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DraftsService } from './drafts.service';
import { DraftsController } from './drafts.controller';
import { Draft } from './entities/draft.entity';
import { DraftPick } from './entities/draft-pick.entity';
import { Team } from '../teams/entities/team.entity';
import { Player } from '../players/entities/player.entity';
import { League } from '../leagues/entities/league.entity';
import { TeamsModule } from '../teams/teams.module';

@Module({
  imports: [TypeOrmModule.forFeature([Draft, DraftPick, Team, Player, League]), TeamsModule],
  controllers: [DraftsController],
  providers: [DraftsService],
  exports: [DraftsService],
})
export class DraftsModule {}
