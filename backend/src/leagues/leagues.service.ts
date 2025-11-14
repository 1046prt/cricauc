import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { League } from './entities/league.entity';
import { CreateLeagueDto } from './dto/create-league.dto';
import { UpdateLeagueDto } from './dto/update-league.dto';

@Injectable()
export class LeaguesService {
  constructor(
    @InjectRepository(League)
    private leagueRepository: Repository<League>,
  ) {}

  async create(createLeagueDto: CreateLeagueDto): Promise<League> {
    const league = this.leagueRepository.create(createLeagueDto);
    return this.leagueRepository.save(league);
  }

  async findAll(): Promise<League[]> {
    return this.leagueRepository.find({
      where: { isActive: true },
      relations: ['teams'],
    });
  }

  async findOne(id: string): Promise<League> {
    const league = await this.leagueRepository.findOne({
      where: { id },
      relations: ['teams', 'auctions'],
    });

    if (!league) {
      throw new NotFoundException('League not found');
    }

    return league;
  }

  async update(id: string, updateLeagueDto: UpdateLeagueDto): Promise<League> {
    await this.leagueRepository.update(id, updateLeagueDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.leagueRepository.delete(id);
  }
}
