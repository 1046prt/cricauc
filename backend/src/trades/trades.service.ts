import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trade, TradeStatus } from './entities/trade.entity';
import { CreateTradeDto } from './dto/create-trade.dto';
import { TeamsService } from '../teams/teams.service';
import { TransactionsService } from '../transactions/transactions.service';
import { Team } from '../teams/entities/team.entity';

@Injectable()
export class TradesService {
  constructor(
    @InjectRepository(Trade)
    private tradeRepository: Repository<Trade>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    private teamsService: TeamsService,
    private transactionsService: TransactionsService,
  ) {}

  async create(createTradeDto: CreateTradeDto, initiatorId: string): Promise<Trade> {
    const trade = this.tradeRepository.create({
      ...createTradeDto,
      initiatorId,
      status: TradeStatus.PENDING,
    });

    return this.tradeRepository.save(trade);
  }

  async findAll(teamId?: string): Promise<Trade[]> {
    const query = this.tradeRepository
      .createQueryBuilder('trade')
      .leftJoinAndSelect('trade.initiator', 'initiator')
      .leftJoinAndSelect('trade.initiatorTeam', 'initiatorTeam')
      .leftJoinAndSelect('trade.recipientTeam', 'recipientTeam');

    if (teamId) {
      query.where('trade.initiatorTeamId = :teamId OR trade.recipientTeamId = :teamId', { teamId });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Trade> {
    const trade = await this.tradeRepository.findOne({
      where: { id },
      relations: ['initiator', 'initiatorTeam', 'recipientTeam'],
    });

    if (!trade) {
      throw new NotFoundException('Trade not found');
    }

    return trade;
  }

  async acceptTrade(id: string, userId: string): Promise<Trade> {
    const trade = await this.findOne(id);

    if (trade.status !== TradeStatus.PENDING) {
      throw new BadRequestException('Trade is not pending');
    }

    // Load recipient team with owner
    const recipientTeam = await this.teamRepository.findOne({
      where: { id: trade.recipientTeamId },
      relations: ['owner'],
    });

    if (!recipientTeam || recipientTeam.ownerId !== userId) {
      throw new BadRequestException('Only recipient can accept trade');
    }

    // Load initiator team
    const initiatorTeam = await this.teamRepository.findOne({
      where: { id: trade.initiatorTeamId },
    });

    // Execute trade: swap players
    for (const playerId of trade.initiatorPlayers) {
      await this.teamsService.removePlayer(trade.initiatorTeamId, playerId);
      await this.teamsService.addPlayer(trade.recipientTeamId, playerId, 0);
    }

    for (const playerId of trade.recipientPlayers) {
      await this.teamsService.removePlayer(trade.recipientTeamId, playerId);
      await this.teamsService.addPlayer(trade.initiatorTeamId, playerId, 0);
    }

    // Handle cash if involved
    if (trade.cashInvolved > 0) {
      // Transfer cash from initiator to recipient
      await this.transactionsService.create({
        teamId: trade.initiatorTeamId,
        type: 'sale' as any,
        amount: trade.cashInvolved,
        description: `Trade cash to ${recipientTeam.name}`,
        tradeId: trade.id,
      });

      await this.transactionsService.create({
        teamId: trade.recipientTeamId,
        type: 'purchase' as any,
        amount: trade.cashInvolved,
        description: `Trade cash from ${initiatorTeam?.name || 'Team'}`,
        tradeId: trade.id,
      });
    }

    trade.status = TradeStatus.ACCEPTED;
    return this.tradeRepository.save(trade);
  }

  async rejectTrade(id: string, userId: string): Promise<Trade> {
    const trade = await this.findOne(id);

    if (trade.status !== TradeStatus.PENDING) {
      throw new BadRequestException('Trade is not pending');
    }

    const recipientTeam = await this.teamRepository.findOne({
      where: { id: trade.recipientTeamId },
    });

    if (!recipientTeam || recipientTeam.ownerId !== userId) {
      throw new BadRequestException('Only recipient can reject trade');
    }

    trade.status = TradeStatus.REJECTED;
    return this.tradeRepository.save(trade);
  }

  async cancelTrade(id: string, userId: string): Promise<Trade> {
    const trade = await this.findOne(id);

    if (trade.status !== TradeStatus.PENDING) {
      throw new BadRequestException('Only pending trades can be cancelled');
    }

    if (trade.initiatorId !== userId) {
      throw new BadRequestException('Only initiator can cancel trade');
    }

    trade.status = TradeStatus.CANCELLED;
    return this.tradeRepository.save(trade);
  }
}
