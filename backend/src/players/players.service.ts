import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player, PlayerRole } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {}

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const player = this.playerRepository.create(createPlayerDto);
    return this.playerRepository.save(player);
  }

  async findAll(filters?: {
    role?: PlayerRole;
    isActive?: boolean;
    search?: string;
  }): Promise<Player[]> {
    const query = this.playerRepository.createQueryBuilder('player');

    if (filters?.role) {
      query.andWhere('player.role = :role', { role: filters.role });
    }

    if (filters?.isActive !== undefined) {
      query.andWhere('player.isActive = :isActive', { isActive: filters.isActive });
    }

    if (filters?.search) {
      query.andWhere('player.name ILIKE :search', { search: `%${filters.search}%` });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Player> {
    const player = await this.playerRepository.findOne({
      where: { id },
      relations: ['historicalPoints'],
    });

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    return player;
  }

  async update(id: string, updatePlayerDto: UpdatePlayerDto): Promise<Player> {
    await this.playerRepository.update(id, updatePlayerDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.playerRepository.delete(id);
  }

  async bulkCreate(players: CreatePlayerDto[]): Promise<Player[]> {
    const createdPlayers = this.playerRepository.create(players);
    return this.playerRepository.save(createdPlayers);
  }
}
