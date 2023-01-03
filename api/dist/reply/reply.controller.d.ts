import { ConfigService } from '@nestjs/config';
import { Client } from '@line/bot-sdk';
import { PollVoteService } from 'src/poll/poll_vote/poll_vote.service';
import { ReplyService } from './reply.service';
import { PollService } from 'src/poll/poll.service';
export declare class ReplyController {
    private readonly configService;
    private readonly pollVoteService;
    private readonly pollService;
    private readonly replyService;
    constructor(configService: ConfigService, pollVoteService: PollVoteService, pollService: PollService, replyService: ReplyService);
    Webhook(client: Client, events: any): Promise<boolean>;
}
