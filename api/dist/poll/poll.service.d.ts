import { Poll } from './poll.entity';
import { Repository } from 'typeorm';
import { ValidationService } from 'src/utils/validation/validation.service';
export declare class PollService {
    private pollsRepository;
    private readonly validationService;
    constructor(pollsRepository: Repository<Poll>, validationService: ValidationService);
    Create(payload: Poll): Promise<Poll>;
    GetList(payload: any): Promise<Poll[]>;
    GetOne(payload: any): Promise<Poll>;
    Update(payload: Poll): Promise<Poll>;
}
