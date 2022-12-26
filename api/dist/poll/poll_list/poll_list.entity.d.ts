import { Poll } from '../poll.entity';
import { PollVote } from '../poll_vote/poll_vote.entity';
export declare class PollList {
    id?: number;
    pollId?: number;
    number?: number;
    answer?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    poll?: Poll;
    pollListVotes?: PollVote[];
}
