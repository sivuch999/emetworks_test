import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ValidationService } from 'src/utils/validation/validation.service';
import { PollList } from './poll_list.entity';
import { PollListService } from './poll_list.service';

@Controller('poll/poll_list')
export class PollListController {
  constructor(
    private readonly pollAnswerService: PollListService,
    private readonly validationService: ValidationService,
  ) {}

  @Post('/')
  async Create(
    @Body()
    body: {
      poll_lists: PollList[];
   }
  ): Promise<any> {
    try {
      const pollAnswerCreate = 
        await this.pollAnswerService.
          Create(body.poll_lists);
      if (!pollAnswerCreate) {
        throw 'create failed';
      }

      return pollAnswerCreate;
    } catch (error) {
      console.log(error);
      return {
        status: this.validationService.StatusWithCode(400),
        error: error,
      }
    }
  }
}
