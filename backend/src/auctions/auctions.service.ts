import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auction, AuctionStatus } from './entities/auction.entity';
import { Bid } from './entities/bid.entity';
import { Team } from '../teams/entities/team.entity';
import { League } from '../leagues/entities/league.entity';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { TeamsService } from '../teams/teams.service';
import { TransactionsService } from '../transactions/transactions.service';

@Injectable()
export class AuctionsService {
  constructor(
    @InjectRepository(Auction)
    private auctionRepository: Repository<Auction>,
    @InjectRepository(Bid)
    private bidRepository: Repository<Bid>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(League)
    private leagueRepository: Repository<League>,
    private teamsService: TeamsService,
    private transactionsService: TransactionsService,
  ) {}

  async create(createAuctionDto: CreateAuctionDto): Promise<Auction> {
    const auction = this.auctionRepository.create({
      ...createAuctionDto,
      status: AuctionStatus.SCHEDULED,
      currentPrice: createAuctionDto.startingPrice,
    });

    return this.auctionRepository.save(auction);
  }

  async findAll(leagueId?: string): Promise<Auction[]> {
    const where: any = {};
    if (leagueId) {
      where.leagueId = leagueId;
    }
    return this.auctionRepository.find({
      where,
      relations: ['player', 'league', 'bids', 'bids.team'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Auction> {
    const auction = await this.auctionRepository.findOne({
      where: { id },
      relations: ['player', 'league', 'bids', 'bids.team', 'bids.user'],
    });

    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    // Sort bids by createdAt DESC
    if (auction.bids) {
      auction.bids.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    return auction;
  }

  async startAuction(id: string): Promise<Auction> {
    const auction = await this.findOne(id);

    if (auction.status !== AuctionStatus.SCHEDULED) {
      throw new BadRequestException('Auction can only be started from scheduled status');
    }

    auction.status = AuctionStatus.LIVE;
    auction.startedAt = new Date();
    auction.timerSeconds = auction.league.auctionTimerSeconds;

    return this.auctionRepository.save(auction);
  }

  async placeBid(auctionId: string, teamId: string, userId: string, amount: number): Promise<Bid> {
    const auction = await this.findOne(auctionId);

    if (auction.status !== AuctionStatus.LIVE) {
      throw new BadRequestException('Auction is not live');
    }

    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // Validate bid amount
    const minBid = auction.currentPrice + auction.league.minBidIncrement;
    if (amount < minBid) {
      throw new BadRequestException(
        `Bid must be at least ${minBid} (current: ${auction.currentPrice} + increment: ${auction.league.minBidIncrement})`,
      );
    }

    // Check purse
    const availablePurse = team.purse - team.spent;
    if (amount > availablePurse) {
      throw new BadRequestException('Insufficient purse');
    }

    // Check max players
    const league = await this.leagueRepository.findOne({
      where: { id: auction.leagueId },
    });
    if (team.playerCount >= league.maxPlayersPerTeam) {
      throw new BadRequestException('Maximum players reached');
    }

    // Mark previous winning bid as not winning
    await this.bidRepository.update({ auctionId, isWinning: true }, { isWinning: false });

    // Create new bid
    const bid = this.bidRepository.create({
      auctionId,
      teamId,
      userId,
      amount,
      isWinning: true,
    });

    await this.bidRepository.save(bid);

    // Update auction
    auction.currentPrice = amount;
    auction.winningTeamId = teamId;
    await this.auctionRepository.save(auction);

    return bid;
  }

  async endAuction(id: string): Promise<Auction> {
    const auction = await this.findOne(id);

    if (auction.status !== AuctionStatus.LIVE && auction.status !== AuctionStatus.PAUSED) {
      throw new BadRequestException('Auction is not active');
    }

    auction.status = AuctionStatus.COMPLETED;
    auction.endedAt = new Date();

    // If there's a winning bid, add player to team and create transaction
    if (auction.winningTeamId) {
      await this.teamsService.addPlayer(
        auction.winningTeamId,
        auction.playerId,
        auction.currentPrice,
      );

      await this.transactionsService.create({
        teamId: auction.winningTeamId,
        type: 'purchase' as any,
        amount: auction.currentPrice,
        description: `Purchased ${auction.player.name} in auction`,
        auctionId: auction.id,
      });
    }

    return this.auctionRepository.save(auction);
  }

  async pauseAuction(id: string): Promise<Auction> {
    const auction = await this.findOne(id);

    if (auction.status !== AuctionStatus.LIVE) {
      throw new BadRequestException('Auction is not live');
    }

    auction.status = AuctionStatus.PAUSED;
    return this.auctionRepository.save(auction);
  }

  async resumeAuction(id: string): Promise<Auction> {
    const auction = await this.findOne(id);

    if (auction.status !== AuctionStatus.PAUSED) {
      throw new BadRequestException('Auction is not paused');
    }

    auction.status = AuctionStatus.LIVE;
    return this.auctionRepository.save(auction);
  }

  async updateTimer(id: string, seconds: number): Promise<Auction> {
    const auction = await this.findOne(id);
    auction.timerSeconds = seconds;
    return this.auctionRepository.save(auction);
  }
}
