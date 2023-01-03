import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { PollVoteService } from './poll/poll_vote/poll_vote.service';
import { SendPollService } from './push/send_poll/send_poll.service';

@Injectable()
export class AppService {
  constructor(
    private readonly pollVoteService: PollVoteService,
    private readonly sendPollService: SendPollService,
    private readonly configService: ConfigService,
  ) {}

  @Cron('0 0 8 * * *')
  async handleCronMemberNotVote() {
    console.log(new Date());
    
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
    }
  }
}
