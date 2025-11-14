import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { League } from '../../leagues/entities/league.entity';
import { Player } from '../../players/entities/player.entity';
import { Bid } from './bid.entity';

export enum AuctionStatus {
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('auctions')
export class Auction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => League, (league) => league.auctions)
  @JoinColumn({ name: 'leagueId' })
  league: League;

  @Column()
  leagueId: string;

  @ManyToOne(() => Player)
  @JoinColumn({ name: 'playerId' })
  player: Player;

  @Column()
  playerId: string;

  @Column({
    type: 'enum',
    enum: AuctionStatus,
    default: AuctionStatus.SCHEDULED,
  })
  status: AuctionStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  startingPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  currentPrice: number;

  @Column({ nullable: true })
  winningTeamId: string;

  @Column({ type: 'int', default: 30 })
  timerSeconds: number;

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  endedAt: Date;

  @OneToMany(() => Bid, (bid) => bid.auction)
  bids: Bid[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

