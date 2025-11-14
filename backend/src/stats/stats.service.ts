import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoricalPoints } from './entities/historical-points.entity';
import { Player } from '../players/entities/player.entity';
import { CreateHistoricalPointsDto } from './dto/create-historical-points.dto';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(HistoricalPoints)
    private historicalPointsRepository: Repository<HistoricalPoints>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {}

  async create(createDto: CreateHistoricalPointsDto): Promise<HistoricalPoints> {
    const player = await this.playerRepository.findOne({
      where: { id: createDto.playerId },
    });

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    const points = this.historicalPointsRepository.create(createDto);
    return this.historicalPointsRepository.save(points);
  }

  async findByPlayer(playerId: string): Promise<HistoricalPoints[]> {
    return this.historicalPointsRepository.find({
      where: { playerId },
      order: { season: 'DESC' },
    });
  }

  async findBySeason(season: string, leagueType: string): Promise<HistoricalPoints[]> {
    return this.historicalPointsRepository.find({
      where: { season, leagueType },
      relations: ['player'],
      order: { totalPoints: 'DESC' },
    });
  }

  async bulkCreate(points: CreateHistoricalPointsDto[]): Promise<HistoricalPoints[]> {
    const created = this.historicalPointsRepository.create(points);
    return this.historicalPointsRepository.save(created);
  }
}

