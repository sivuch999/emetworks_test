import { ValidationService } from 'src/utils/validation/validation.service';
import { PollList } from './poll_list.entity';
import { PollListService } from './poll_list.service';
export declare class PollListController {
    private readonly pollAnswerService;
    private readonly validationService;
    constructor(pollAnswerService: PollListService, validationService: ValidationService);
    Create(body: {
        poll_lists: PollList[];
    }): Promise<any>;
}
