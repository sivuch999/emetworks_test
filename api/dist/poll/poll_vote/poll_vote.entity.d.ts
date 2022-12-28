import { Poll } from '../poll.entity';
import { PollList } from '../poll_list/poll_list.entity';
export declare class PollVote {
    id?: number;
    pollId?: number;
    pollListId?: number;
    oaUid?: string;
    oaGid?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    poll?: Poll;
    pollList?: PollList;
}
