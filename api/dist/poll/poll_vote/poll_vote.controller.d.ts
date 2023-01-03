import { ValidationService } from 'src/utils/validation/validation.service';
import { PollVote } from './poll_vote.entity';
import { PollVoteService } from './poll_vote.service';
export declare class PollVoteController {
    private readonly pollVoteService;
    private readonly validationService;
    constructor(pollVoteService: PollVoteService, validationService: ValidationService);
    Create(body: {
        poll_votes: PollVote[];
    }): Promise<any>;
}
