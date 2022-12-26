import { Member } from 'src/member/member.entity';
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
} from 'typeorm';
import { Poll } from '../poll.entity';
import { PollList } from '../poll_list/poll_list.entity';

@Entity("poll_votes")
export class PollVote {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'poll_id', type: 'integer', nullable: false })
  @Index()
  pollId?: number;

  @Column({ name: 'poll_list_id', type: 'integer', nullable: false })
  @Index()
  pollListId?: number;

  @Column({ name: 'oa_uid', type: 'varchar', nullable: false })
  oaUid?: string;

  @Index()
  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @ManyToOne(() => Poll, (poll) => poll.pollVotes, {
    nullable: false,
  })
  @JoinColumn({ name: 'poll_id' })
  poll?: Poll;

  @ManyToOne(() => PollList, (pollList) => pollList.pollListVotes, {
    nullable: false,
  })
  @JoinColumn({ name: 'poll_list_id' })
  pollList?: PollList;

  // @ManyToOne(() => Member, (member) => member.pollVotes, {
  //   nullable: false,
  // })
  // member?: Member;
}