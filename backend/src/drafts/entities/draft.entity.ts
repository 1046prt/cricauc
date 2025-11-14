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
import { DraftPick } from './draft-pick.entity';

export enum DraftStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('drafts')
export class Draft {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => League, (league) => league.drafts)
  @JoinColumn({ name: 'leagueId' })
  league: League;

  @Column()
  leagueId: string;

  @Column({
    type: 'enum',
    enum: DraftStatus,
    default: DraftStatus.SCHEDULED,
  })
  status: DraftStatus;

  @Column({ type: 'int', default: 60 })
  pickTimerSeconds: number;

  @Column({ type: 'int', default: 0 })
  currentPick: number;

  @Column({ type: 'jsonb', nullable: true })
  pickOrder: string[]; // Array of team IDs

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @OneToMany(() => DraftPick, (pick) => pick.draft)
  picks: DraftPick[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
