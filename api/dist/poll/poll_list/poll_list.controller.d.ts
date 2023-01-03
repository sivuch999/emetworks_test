import { ValidationService } from 'src/utils/validation/validation.service';
import { PollList } from './poll_list.entity';
import { PollListService } from './poll_list.service';
export declare class PollListController {
    private readonly pollVoteService;
    private readonly validationService;
    constructor(pollVoteService: PollListService, validationService: ValidationService);
    Create(body: {
        poll_lists: PollList[];
    }): Promise<any>;
}
