import { ConfigService } from '@nestjs/config';
import { PollVoteService } from './poll/poll_vote/poll_vote.service';
import { SendPollService } from './push/send_poll/send_poll.service';
export declare class AppService {
    private readonly pollVoteService;
    private readonly sendPollService;
    private readonly configService;
    constructor(pollVoteService: PollVoteService, sendPollService: SendPollService, configService: ConfigService);
    handleCronMemberNotVote(): Promise<void>;
}
