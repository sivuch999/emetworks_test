import { ConfigService } from "@nestjs/config";
import { Client } from "@line/bot-sdk";
import { PollVoteService } from "src/poll/poll_vote/poll_vote.service";
import { ReplyService } from "./reply.service";
export declare class ReplyController {
    private readonly configService;
    private readonly pollVoteService;
    private readonly replyService;
    constructor(configService: ConfigService, pollVoteService: PollVoteService, replyService: ReplyService);
    Webhook(client: Client, events: any): Promise<boolean>;
}
