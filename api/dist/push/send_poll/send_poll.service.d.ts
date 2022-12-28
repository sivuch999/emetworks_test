export declare class SendPollService {
    SendCreatePoll(oa: any, question: string, answer: any[], expired: string): Promise<any>;
    SendClosedPoll(oa: any, id: number, question: string): Promise<any>;
    SendSummaryPoll(oa: any, message: string): Promise<any>;
    SendReminderPoll(oa: any, push: any[]): Promise<any>;
}
