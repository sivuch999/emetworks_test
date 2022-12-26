import { PollList } from './poll_list/poll_list.entity';
import { PollVote } from './poll_vote/poll_vote.entity';
export declare class Poll {
    id?: number;
    oaUid?: string;
    question?: string;
    status?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    pollLists?: PollList[];
    pollVotes?: PollVote[];
}
