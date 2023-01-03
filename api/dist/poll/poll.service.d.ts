import { Poll } from './poll.entity';
import { Repository } from 'typeorm';
import { ValidationService } from 'src/utils/validation/validation.service';
import { SendPollService } from 'src/push/send_poll/send_poll.service';
import { ConfigService } from '@nestjs/config';
export declare class PollService {
    private pollsRepository;
    private readonly validationService;
    private sendPollService;
    private configService;
    constructor(pollsRepository: Repository<Poll>, validationService: ValidationService, sendPollService: SendPollService, configService: ConfigService);
    Create(payload: Poll): Promise<Poll>;
    GetList(payload: any): Promise<Poll[]>;
    GetOne(payload: any): Promise<Poll>;
    Update(payload: Poll): Promise<Poll>;
    ClosePoll(source: any, pollId: number): Promise<any>;
}
