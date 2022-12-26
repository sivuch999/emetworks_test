import { PollList } from './poll_list.entity';
import { Repository } from 'typeorm';
import { ValidationService } from 'src/utils/validation/validation.service';
export declare class PollListService {
    private readonly pollAnswerRepository;
    private readonly validationService;
    constructor(pollAnswerRepository: Repository<PollList>, validationService: ValidationService);
    Create(payload: PollList[]): Promise<PollList[]>;
    GetList(payload: any): Promise<PollList[]>;
    GetOne(payload: any): Promise<PollList>;
}
