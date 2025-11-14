import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Player } from '../../players/entities/player.entity';

@Entity('historical_points')
@Index(['playerId', 'season', 'leagueType'])
export class HistoricalPoints {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Player, (player) => player.historicalPoints)
  @JoinColumn({ name: 'playerId' })
  player: Player;

  @Column()
  playerId: string;

  @Column()
  season: string;

  @Column()
  leagueType: string;

  @Column({ type: 'int' })
  totalPoints: number;

  @Column({ type: 'int', default: 0 })
  matchesPlayed: number;

  @Column({ type: 'int', default: 0 })
  runs: number;

  @Column({ type: 'int', default: 0 })
  wickets: number;

  @Column({ type: 'jsonb', nullable: true })
  detailedStats: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
