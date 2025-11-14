import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog, AuditAction } from './entities/audit-log.entity';
import { Auction } from '../auctions/entities/auction.entity';
import { Team } from '../teams/entities/team.entity';
import { PlayersService } from '../players/players.service';
import { AuctionsService } from '../auctions/auctions.service';
import { StatsService } from '../stats/stats.service';
import { CreatePlayerDto } from '../players/dto/create-player.dto';
import { CreateHistoricalPointsDto } from '../stats/dto/create-historical-points.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
    @InjectRepository(Auction)
    private auctionRepository: Repository<Auction>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    private playersService: PlayersService,
    private auctionsService: AuctionsService,
    private statsService: StatsService,
  ) {}

  async logAction(
    userId: string,
    action: AuditAction,
    entityType: string,
    entityId: string,
    oldValue: any,
    newValue: any,
    description: string,
    ipAddress?: string,
  ): Promise<AuditLog> {
    const log = this.auditLogRepository.create({
      userId,
      action,
      entityType,
      entityId,
      oldValue,
      newValue,
      description,
      ipAddress,
    });

    return this.auditLogRepository.save(log);
  }

  async forceEndAuction(auctionId: string, userId: string, ipAddress?: string) {
    const auction = await this.auctionsService.findOne(auctionId);
    const oldStatus = auction.status;

    const endedAuction = await this.auctionsService.endAuction(auctionId);

    await this.logAction(
      userId,
      AuditAction.FORCE_END_AUCTION,
      'auction',
      auctionId,
      { status: oldStatus },
      { status: endedAuction.status },
      `Force ended auction for player ${endedAuction.player.name}`,
      ipAddress,
    );

    return endedAuction;
  }

  async adjustPurse(teamId: string, amount: number, userId: string, ipAddress?: string) {
    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    const oldPurse = team.purse;
    team.purse += amount;
    await this.teamRepository.save(team);

    await this.logAction(
      userId,
      AuditAction.ADJUST_PURSE,
      'team',
      teamId,
      { purse: oldPurse },
      { purse: team.purse },
      `Adjusted purse by ${amount > 0 ? '+' : ''}${amount}`,
      ipAddress,
    );

    return team;
  }

  async uploadPlayers(players: CreatePlayerDto[], userId: string, ipAddress?: string) {
    const created = await this.playersService.bulkCreate(players);

    await this.logAction(
      userId,
      AuditAction.UPLOAD_PLAYERS,
      'player',
      'bulk',
      {},
      { count: created.length },
      `Uploaded ${created.length} players`,
      ipAddress,
    );

    return created;
  }

  async uploadHistoricalPoints(
    points: CreateHistoricalPointsDto[],
    userId: string,
    ipAddress?: string,
  ) {
    const created = await this.statsService.bulkCreate(points);

    await this.logAction(
      userId,
      AuditAction.UPLOAD_PLAYERS,
      'historical_points',
      'bulk',
      {},
      { count: created.length },
      `Uploaded ${created.length} historical points records`,
      ipAddress,
    );

    return created;
  }

  async getAuditLogs(filters?: { userId?: string; action?: AuditAction; entityType?: string }) {
    const query = this.auditLogRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.user', 'user')
      .orderBy('log.createdAt', 'DESC');

    if (filters?.userId) {
      query.andWhere('log.userId = :userId', { userId: filters.userId });
    }

    if (filters?.action) {
      query.andWhere('log.action = :action', { action: filters.action });
    }

    if (filters?.entityType) {
      query.andWhere('log.entityType = :entityType', { entityType: filters.entityType });
    }

    return query.getMany();
  }
}
