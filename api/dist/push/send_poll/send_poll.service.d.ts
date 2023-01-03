import { Message } from '@line/bot-sdk';
import { ConfigService } from '@nestjs/config';
export declare class SendPollService {
    private readonly configService;
    constructor(configService: ConfigService);
    SendCreatePoll(oa: any, question: string, answer: any[], pollId: string): Promise<any>;
    SendClosedPoll(oa: any, id: number, question: string): Promise<any>;
    SendSummaryPoll(oa: any, pushMsg: Message[]): Promise<any>;
    SendReminderPoll(oa: any, push: any[]): Promise<any>;
}
