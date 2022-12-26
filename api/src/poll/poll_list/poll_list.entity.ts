import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Poll } from '../poll.entity';
import { PollVote } from '../poll_vote/poll_vote.entity';

@Entity("poll_lists")
export class PollList {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'poll_id', type: 'integer', nullable: false })
  @Index()
  pollId?: number;

  @Column({ type: 'integer', nullable: false })
  @Index()
  number?: number;

  @Column({ type: 'varchar', nullable: false })
  answer?: string;

  @Index()
  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @ManyToOne(() => Poll, (poll) => poll.pollLists, {
    nullable: false,
  })
  @JoinColumn({ name: 'poll_id' })
  poll?: Poll;

  @OneToMany(
    (type) => PollVote,
    (pollVote) => pollVote.pollList,
    { cascade: true },
  )
  pollListVotes?: PollVote[];
}