import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { TeamPlayer } from '../../teams/entities/team-player.entity';
import { Bid } from '../../auctions/entities/bid.entity';
import { HistoricalPoints } from '../../stats/entities/historical-points.entity';

export enum PlayerRole {
  BATTER = 'Batter',
  BOWLER = 'Bowler',
  ALL_ROUNDER = 'All-Rounder',
  WICKET_KEEPER = 'Wicket-Keeper',
}

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  image: string;

  @Column({
    type: 'enum',
    enum: PlayerRole,
  })
  role: PlayerRole;

  @Column({ nullable: true })
  nationality: string;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  basePrice: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  stats: Record<string, any>;

  @OneToMany(() => TeamPlayer, (teamPlayer) => teamPlayer.player)
  teamPlayers: TeamPlayer[];

  @OneToMany(() => Bid, (bid) => bid.player)
  bids: Bid[];

  @OneToMany(() => HistoricalPoints, (points) => points.player)
  historicalPoints: HistoricalPoints[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
