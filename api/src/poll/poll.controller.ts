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
import { Request } from 'express';
import { Client } from '@line/bot-sdk';

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
      oaGid: string;
      day: number,
      pollLists: PollList[];
    },
    @Req() req: Request,
  ): Promise<any> {
    try {      

      this.validationService.NullValidator({
        pollLists: body.pollLists,
        oaUid: req['oa']['sub'],
        oaGid: body.oaGid,
      });

      if (body.pollLists.length > POLL_LIST_MAX) {
        throw `The number of polls isz greater than ${POLL_LIST_MAX}`;
      }
    
      var pollListValue = body.pollLists.map((v) => v.answer )
      var pollListFilterDup = pollListValue.filter((v, k) => { 
          return pollListValue.indexOf(v) == k 
      }).map((v: string) => { return { answer: v } })

      const pollCreate = 
        await this.pollService.
          Create(
            {
              question: body.question,
              oaUid: req['oa']['sub'],
              oaGid: body.oaGid,
              pollLists: pollListFilterDup,
            }
          );
      if (!pollCreate) {
        throw 'create polls failed';
      }

      const question = `${pollCreate.question}`
      const answer = pollCreate.pollLists.map((e: any) => {
        const queryParamsAnswer: any = { type: 'vote', pollId: pollCreate.id, pollListId: e.id }
        return {
          label: e.answer,
          data: new URLSearchParams(queryParamsAnswer).toString(),
          text: `โพล ${pollCreate.question} ตอบ ${e.answer}`
        }
      })
      
      const queryParamsPollId: any = { type: 'close', pollId: pollCreate.id }
      await this.sendPollService.SendCreatePoll(
        {
          to: body.oaGid,
          lineMessageToken: this.configService.get('Line').Message.Token,
          lineMessageSecret: this.configService.get('Line').Message.Secret
        },
        question,
        answer,
        new URLSearchParams(queryParamsPollId).toString()
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
    @Body() body: { status: number, oaGid: string; },
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
        const messages = await this.pollVoteService.SummaryPoll(pollUpdate.id)
        if (messages) {
          await this.sendPollService.SendSummaryPoll(
            {
              to: body.oaGid,
              lineMessageToken: this.configService.get('Line').Message.Token,
              lineMessageSecret: this.configService.get('Line').Message.Secret
            },
            messages
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
      groupId: string;
    },
    @Req() req: Request,
  ): Promise<any> {
    try {
      this.validationService.NullValidator({
        oaUid: req['oa']['sub'],
      });

      const client = new Client(
        {
          'channelAccessToken': this.configService.get('Line').Message.Token,
          'channelSecret': this.configService.get('Line').Message.Secret
        },
      )
      if (!client) {
        throw 'verify line token failed'
      }

      let isClosedToBool: boolean
      if (query.isClosed) {
        isClosedToBool = query.isClosed.toLowerCase() === 'false' ? false : Boolean(query.isClosed)
      }

      const pollGetList = await this.pollService.GetList(
        {
          select: {
            id: true,
            // oaUid: true,
            question: true,
            oaGid: true
          },
          isClosed: isClosedToBool ?? undefined,
          oaUid: req['oa']['sub'],
          oaGid: query.groupId ?? undefined,
        }
      )      

      const pollList = Promise.all(pollGetList.map(async (e: Poll): Promise<any>  => {
        const oaGroup = await client.getGroupSummary(e.oaGid)
        return {
          id: e.id,
          question: e.question,
          groupId: oaGroup.groupId,
          groupName: oaGroup.groupName
        }
      }))
  
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
      const push: any = []
      
      if (membersNotVote) {
        membersNotVote.forEach((e: any, k: number) => {          
          push[k] = {
            to: e.groupId,
            message: ''
          }
          let memberName = ''
          e.members.forEach((m: any) => {
            memberName += `${m.display_name}, `
          });
          push[k].message = `(${e.question}) ${memberName.slice(0, -2)} ยังไม่ได้ตอบ กรุณาตอบ poll ด้วยค่ะ`
        });        

        await this.sendPollService.SendReminderPoll(
          {
            lineMessageToken: this.configService.get('Line').Message.Token,
            lineMessageSecret: this.configService.get('Line').Message.Secret
          },
          push,
        )
        
        // x y z ยังไม่ได้ตอบ กรุณาตอบ poll ด้วยค่ะ
      }
      return push

    } catch (error) {
      console.log(error);
      return {
        status: this.validationService.StatusWithCode(400),
        error: error,
      }
    }

  

    
  }

}
