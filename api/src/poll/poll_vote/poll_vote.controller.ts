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
import { PollVote } from './poll_vote.entity';
import { PollVoteService } from './poll_vote.service';

@Controller('poll/poll_vote')
export class PollVoteController {
  constructor(
    private readonly pollVoteService: PollVoteService,
    private readonly validationService: ValidationService,
  ) {}

  @Post('/')
  async Create(
    @Body()
    body: {
      poll_votes: PollVote[];
   }
  ): Promise<any> {
    try {
      const pollAnswerCreate = 
        await this.pollVoteService.
          Create(body.poll_votes);
      if (!pollAnswerCreate) {
        throw 'Create failed';
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
