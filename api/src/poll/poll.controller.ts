import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ValidationService } from 'src/utils/validation/validation.service';
import { PollService } from './poll.service';
import { PollList } from './poll_list/poll_list.entity';
import { POLL_LIST_MAX, POLL_STATUS } from 'src/utils/define/poll';
import { SendPollService } from 'src/push/send_poll/send_poll.service';
import { PollVoteService } from 'src/poll/poll_vote/poll_vote.service';
import { ConfigService } from '@nestjs/config';
import { Poll } from './poll.entity';
import { query, Request } from 'express';

@Controller('poll')
export class PollController {
  constructor(
    private readonly configService: ConfigService,
    private readonly pollService: PollService,
    private readonly validationService: ValidationService,
    private readonly sendPollService: SendPollService,
    private readonly pollVoteService: PollVoteService
  ) {}

  @Post('/')
  async create(
    @Body()
    body: {
      question: string;
      oaUid: string;
      day: number,
      pollLists: PollList[];
    },
    @Req() req: Request,
  ): Promise<any> {
    try {      

      this.validationService.NullValidator({
        poll_lists: body.pollLists,
        oaUid: req['oa']['sub'],
      });

      if (body.pollLists.length > POLL_LIST_MAX) {
        throw `The number of polls is greater than ${POLL_LIST_MAX}`;
      }

      // const milliseconds = 1575909015 * 1000 // 1575909015000
      // const dateObject = new Date(milliseconds)
          
      // const now = new Date()
      // let expired = null
      // if (body.day != null && body.day != undefined) {
      //   expired = DatetimeToUnix(now, body.day)
      // }
      
      const pollCreate = 
        await this.pollService.
          Create(
            {
              question: body.question,
              oaUid: req['oa']['sub'],
              
              // expired: expired ? expired.toString() : null,
              pollLists: body.pollLists,
            }
          );
      if (!pollCreate) {
        throw 'create polls failed';
      }

      const qCode = pollCreate.id.toString().padStart(5, "0")
      const question = `${qCode}: ${pollCreate.question}`
      const answer = pollCreate.pollLists.map((e: any) => {
        return {
          label: e.answer,
          text: `${qCode}-${e.number}: ${e.answer}`
        }
      })
      
      await this.sendPollService.SendCreatePoll(
        {
          to: this.configService.get('Line').GroupId,
          lineMessageToken: this.configService.get('Line').Message.Token,
          lineMessageSecret: this.configService.get('Line').Message.Secret
        },
        question,
        answer,
        null
      )

      return pollCreate;
      
    } catch (error) {
      console.log(error);
      return {
        status: this.validationService.StatusWithCode(400),
        error: error,
      };
    }
  }

  @Patch('close/:id')
  async update(
    @Param() params,
    @Body() body: { status: number },
  ): Promise<any> {
    try {
      this.validationService.NullValidator({
        id: params.id,
      });

      if (
        body.status && (
          body.status != POLL_STATUS.Ready
          && body.status != POLL_STATUS.Closed
          && body.status != POLL_STATUS.Rejected
        )
      ) {
        throw 'invalid status'
      }

      const pollUpdate = await this.pollService.Update(
        {
          id: params.id,
          status: body.status
        }
      )
      if (!pollUpdate) {
        throw 'delete failed';
      }

      await this.sendPollService.SendClosedPoll(
        {
          to: this.configService.get('Line').GroupId,
          lineMessageToken: this.configService.get('Line').Message.Token,
          lineMessageSecret: this.configService.get('Line').Message.Secret
        },
        pollUpdate.id,
        pollUpdate.question
      )

      if (body.status == POLL_STATUS.Closed) {
        const summary = await this.pollVoteService.SummaryPoll(pollUpdate.id)
        if (summary) {
          await this.sendPollService.SendSummaryPoll(
            {
              to: this.configService.get('Line').GroupId,
              lineMessageToken: this.configService.get('Line').Message.Token,
              lineMessageSecret: this.configService.get('Line').Message.Secret
            },
            `สรุปผลโหวต: ${summary}`,
          )
        }
      }

      return pollUpdate;
      
    } catch (error) {
      console.log(error);
      return {
        status: this.validationService.StatusWithCode(400),
        error: error,
      };
    }
  }

  @Get('list')
  async list(
    @Query()
    query: {
      isClosed: string;
    },
    @Req() req: Request,
  ): Promise<any> {
    try {
      this.validationService.NullValidator({
        oaUid: req['oa']['sub'],
      });

      let isClosedToBool: boolean
      if (query.isClosed) {
        isClosedToBool = query.isClosed.toLowerCase() === 'false' ? false : Boolean(query.isClosed)
      }

      const pollGetList = await this.pollService.GetList(
        {
          select: {
            id: true,
            // oaUid: true,
            question: true
          },
          isClosed: isClosedToBool ?? undefined,
          oaUid: req['oa']['sub']
        }
      )

      const pollList = pollGetList.map((e: Poll) => {
        return {
          ...e,
          code: e.id.toString().padStart(5, "0")
        }
      })
  
      return pollList

    } catch (error) {
      console.log(error);
      return {
        status: this.validationService.StatusWithCode(400),
        error: error,
      }
    }
    
  }

  @Get('not_vote')
  async notVote(): Promise<any> {
    try { 
      const membersNotVote = await this.pollVoteService.VerifyMemberNotVote()
      const messages: any = []
      console.log(membersNotVote);
      
      if (membersNotVote) {
        membersNotVote.forEach((e: any) => {
          const qCode = e.pollId.toString().padStart(5, "0")
          let memberName = ''
          e.members.forEach((m: any) => {
            memberName += `${m.display_name}, `
          });
          messages.push(`(${qCode}: ${e.question}) ${memberName.slice(0, -2)} ยังไม่ได้ตอบ กรุณาตอบ poll ด้วยค่ะ`)
        });
        // x y z ยังไม่ได้ตอบ กรุณาตอบ poll ด้วยค่ะ
      }
      return messages

    } catch (error) {
      console.log(error);
      return {
        status: this.validationService.StatusWithCode(400),
        error: error,
      }
    }

  

    
  }

}