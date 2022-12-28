import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { POLL_STATUS } from 'src/utils/define/poll';
import { PollList } from './poll_list/poll_list.entity';
import { PollVote } from './poll_vote/poll_vote.entity';

@Entity("polls")
export class Poll {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'oa_uid', type: 'varchar', nullable: false })
  oaUid?: string;

  @Column({ name: 'oa_gid', type: 'varchar', nullable: false })
  oaGid?: string;

  @Column({ type: 'varchar', nullable: false })
  question?: string;

  // @Column({ type: 'varchar', nullable: true })
  // expired?: string;

  @Column({ type: 'tinyint', nullable: false, default: POLL_STATUS.Ready })
  status?: number;

  @Index()
  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @OneToMany(
    (type) => PollList,
    (pollList) => pollList.poll,
    { cascade: true },
  )
  pollLists?: PollList[];

  @OneToMany(
    (type) => PollVote,
    (pollVote) => pollVote.poll,
    { cascade: true },
  )
  pollVotes?: PollVote[];
}