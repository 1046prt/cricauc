import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Draft, DraftStatus } from './entities/draft.entity';
import { DraftPick } from './entities/draft-pick.entity';
import { CreateDraftDto } from './dto/create-draft.dto';
import { TeamsService } from '../teams/teams.service';
import { Team } from '../teams/entities/team.entity';
import { League } from '../leagues/entities/league.entity';

@Injectable()
export class DraftsService {
  constructor(
    @InjectRepository(Draft)
    private draftRepository: Repository<Draft>,
    @InjectRepository(DraftPick)
    private draftPickRepository: Repository<DraftPick>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(League)
    private leagueRepository: Repository<League>,
    private teamsService: TeamsService,
  ) {}

  async create(createDraftDto: CreateDraftDto): Promise<Draft> {
    const draft = this.draftRepository.create({
      ...createDraftDto,
      status: DraftStatus.SCHEDULED,
    });

    return this.draftRepository.save(draft);
  }

  async findAll(leagueId?: string): Promise<Draft[]> {
    const where: any = {};
    if (leagueId) {
      where.leagueId = leagueId;
    }
    return this.draftRepository.find({
      where,
      relations: ['league', 'picks', 'picks.player', 'picks.team'],
    });
  }

  async findOne(id: string): Promise<Draft> {
    const draft = await this.draftRepository.findOne({
      where: { id },
      relations: ['league', 'picks', 'picks.player', 'picks.team'],
    });

    if (!draft) {
      throw new NotFoundException('Draft not found');
    }

    return draft;
  }

  async startDraft(id: string): Promise<Draft> {
    const draft = await this.findOne(id);

    if (draft.status !== DraftStatus.SCHEDULED) {
      throw new BadRequestException('Draft can only be started from scheduled status');
    }

    draft.status = DraftStatus.IN_PROGRESS;
    draft.startedAt = new Date();
    draft.currentPick = 1;

    return this.draftRepository.save(draft);
  }

  async makePick(draftId: string, teamId: string, playerId: string): Promise<DraftPick> {
    const draft = await this.findOne(draftId);

    if (draft.status !== DraftStatus.IN_PROGRESS) {
      throw new BadRequestException('Draft is not in progress');
    }

    // Check if it's the team's turn
    const currentTeamIndex = (draft.currentPick - 1) % draft.pickOrder.length;
    const currentTeamId = draft.pickOrder[currentTeamIndex];

    if (currentTeamId !== teamId) {
      throw new BadRequestException('Not your turn to pick');
    }

    // Check if player is already picked
    const existingPick = await this.draftPickRepository.findOne({
      where: { draftId, playerId },
    });

    if (existingPick) {
      throw new BadRequestException('Player already picked');
    }

    const pick = this.draftPickRepository.create({
      draftId,
      teamId,
      playerId,
      pickNumber: draft.currentPick,
    });

    await this.draftPickRepository.save(pick);

    // Add player to team
    await this.teamsService.addPlayer(teamId, playerId, 0); // Draft picks are free

    // Update draft
    draft.currentPick += 1;

    // Check if draft is complete
    const league = await this.leagueRepository.findOne({
      where: { id: draft.leagueId },
    });
    const totalPicks = draft.pickOrder.length * league.maxPlayersPerTeam;
    if (draft.currentPick > totalPicks) {
      draft.status = DraftStatus.COMPLETED;
      draft.completedAt = new Date();
    }

    await this.draftRepository.save(draft);

    return pick;
  }

  async endDraft(id: string): Promise<Draft> {
    const draft = await this.findOne(id);

    draft.status = DraftStatus.COMPLETED;
    draft.completedAt = new Date();

    return this.draftRepository.save(draft);
  }
}
