import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Draft } from './draft.entity';
import { Player } from '../../players/entities/player.entity';
import { Team } from '../../teams/entities/team.entity';

@Entity('draft_picks')
export class DraftPick {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Draft, (draft) => draft.picks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'draftId' })
  draft: Draft;

  @Column()
  draftId: string;

  @ManyToOne(() => Player)
  @JoinColumn({ name: 'playerId' })
  player: Player;

  @Column()
  playerId: string;

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @Column()
  teamId: string;

  @Column({ type: 'int' })
  pickNumber: number;

  @CreateDateColumn()
  createdAt: Date;
}

