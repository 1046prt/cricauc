import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Team } from '../../teams/entities/team.entity';

export enum TradeStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

@Entity('trades')
export class Trade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.trades)
  @JoinColumn({ name: 'initiatorId' })
  initiator: User;

  @Column()
  initiatorId: string;

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'initiatorTeamId' })
  initiatorTeam: Team;

  @Column()
  initiatorTeamId: string;

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'recipientTeamId' })
  recipientTeam: Team;

  @Column()
  recipientTeamId: string;

  @Column({ type: 'jsonb' })
  initiatorPlayers: string[]; // Array of player IDs

  @Column({ type: 'jsonb' })
  recipientPlayers: string[]; // Array of player IDs

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cashInvolved: number;

  @Column({
    type: 'enum',
    enum: TradeStatus,
    default: TradeStatus.PENDING,
  })
  status: TradeStatus;

  @Column({ type: 'text', nullable: true })
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
