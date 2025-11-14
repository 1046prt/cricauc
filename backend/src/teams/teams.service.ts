import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { TeamPlayer } from './entities/team-player.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { League } from '../leagues/entities/league.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(TeamPlayer)
    private teamPlayerRepository: Repository<TeamPlayer>,
    @InjectRepository(League)
    private leagueRepository: Repository<League>,
  ) {}

  async create(createTeamDto: CreateTeamDto, ownerId: string): Promise<Team> {
    const league = await this.leagueRepository.findOne({
      where: { id: createTeamDto.leagueId },
    });

    if (!league) {
      throw new NotFoundException('League not found');
    }

    const team = this.teamRepository.create({
      ...createTeamDto,
      ownerId,
      purse: league.basePurse,
    });

    return this.teamRepository.save(team);
  }

  async findAll(leagueId?: string): Promise<Team[]> {
    const where: any = {};
    if (leagueId) {
      where.leagueId = leagueId;
    }
    return this.teamRepository.find({
      where,
      relations: ['owner', 'league', 'teamPlayers', 'teamPlayers.player'],
    });
  }

  async findOne(id: string): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id },
      relations: ['owner', 'league', 'teamPlayers', 'teamPlayers.player'],
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    return team;
  }

  async addPlayer(teamId: string, playerId: string, price: number): Promise<TeamPlayer> {
    const team = await this.findOne(teamId);

    if (team.spent + price > team.purse) {
      throw new BadRequestException('Insufficient purse');
    }

    const league = await this.leagueRepository.findOne({
      where: { id: team.leagueId },
    });

    if (team.playerCount >= league.maxPlayersPerTeam) {
      throw new BadRequestException('Maximum players reached');
    }

    const teamPlayer = this.teamPlayerRepository.create({
      teamId,
      playerId,
      purchasePrice: price,
      purchasedAt: new Date(),
    });

    await this.teamPlayerRepository.save(teamPlayer);

    // Update team stats
    team.spent += price;
    team.playerCount += 1;
    await this.teamRepository.save(team);

    return teamPlayer;
  }

  async removePlayer(teamId: string, playerId: string): Promise<void> {
    const teamPlayer = await this.teamPlayerRepository.findOne({
      where: { teamId, playerId },
    });

    if (!teamPlayer) {
      throw new NotFoundException('Player not in team');
    }

    const team = await this.findOne(teamId);
    team.spent -= teamPlayer.purchasePrice;
    team.playerCount -= 1;
    await this.teamRepository.save(team);

    await this.teamPlayerRepository.remove(teamPlayer);
  }
}
