import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Team } from '../../teams/entities/team.entity';
import { Auction } from '../../auctions/entities/auction.entity';
import { Draft } from '../../drafts/entities/draft.entity';

export enum LeagueType {
  IPL = 'IPL',
  WPL = 'WPL',
  ISL = 'ISL',
  HUNDRED = 'Hundred',
  WBBL = 'WBBL',
}

@Entity('leagues')
export class League {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: LeagueType,
  })
  type: LeagueType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePurse: number;

  @Column({ type: 'int', default: 11 })
  maxPlayersPerTeam: number;

  @Column({ type: 'int', default: 25 })
  maxPlayersPerAuction: number;

  @Column({ type: 'int', default: 30 })
  auctionTimerSeconds: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.25 })
  minBidIncrement: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @OneToMany(() => Team, (team) => team.league)
  teams: Team[];

  @OneToMany(() => Auction, (auction) => auction.league)
  auctions: Auction[];

  @OneToMany(() => Draft, (draft) => draft.league)
  drafts: Draft[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

