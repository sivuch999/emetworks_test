import { ConfigService } from "@nestjs/config";
import { Client } from "@line/bot-sdk";
import { PollVoteService } from "src/poll/poll_vote/poll_vote.service";
export declare class ReplyController {
    private readonly configService;
    private readonly pollVoteService;
    constructor(configService: ConfigService, pollVoteService: PollVoteService);
    Webhook(client: Client, events: any): Promise<boolean>;
}
