import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { League } from '../../leagues/entities/league.entity';
import { Player } from '../../players/entities/player.entity';
import { TeamPlayer } from './team-player.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  purse: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  spent: number;

  @Column({ type: 'int', default: 0 })
  playerCount: number;

  @ManyToOne(() => User, (user) => user.teams)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  ownerId: string;

  @ManyToOne(() => League, (league) => league.teams)
  @JoinColumn({ name: 'leagueId' })
  league: League;

  @Column()
  leagueId: string;

  @OneToMany(() => TeamPlayer, (teamPlayer) => teamPlayer.team)
  teamPlayers: TeamPlayer[];

  @OneToMany(() => Transaction, (transaction) => transaction.team)
  transactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

