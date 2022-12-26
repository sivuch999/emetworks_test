import { ValidationService } from 'src/utils/validation/validation.service';
import { PollService } from './poll.service';
import { PollList } from './poll_list/poll_list.entity';
import { SendPollService } from 'src/push/send_poll/send_poll.service';
import { PollVoteService } from 'src/poll/poll_vote/poll_vote.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
export declare class PollController {
    private readonly configService;
    private readonly pollService;
    private readonly validationService;
    private readonly sendPollService;
    private readonly pollVoteService;
    constructor(configService: ConfigService, pollService: PollService, validationService: ValidationService, sendPollService: SendPollService, pollVoteService: PollVoteService);
    create(body: {
        question: string;
        oaUid: string;
        day: number;
        pollLists: PollList[];
    }, req: Request): Promise<any>;
    update(params: any, body: {
        status: number;
    }): Promise<any>;
    list(query: {
        isClosed: string;
    }, req: Request): Promise<any>;
    notVote(): Promise<any>;
}
