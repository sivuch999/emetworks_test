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

  @Cron('0 0 0 1 * *')
  async handleCronMemberNotVote() {
    const now = new Date()
    console.log(now);
    
    const membersNotVote = await this.pollVoteService.VerifyMemberNotVote()
    const messages: string[] = []
    
    if (membersNotVote) {
      membersNotVote.forEach((e: any) => {
        const qCode = e.pollId.toString().padStart(5, "0")
        let memberName = ''
        e.members.forEach((m: any) => {
          memberName += `${m.display_name}, `
        });
        messages.push(`(${qCode}: ${e.question}) ${memberName.slice(0, -2)} ยังไม่ได้ตอบ กรุณาตอบ poll ด้วยค่ะ`)
      });
      
      await this.sendPollService.SendReminderPoll(
        {
          to: this.configService.get('Line').GroupId,
          lineMessageToken: this.configService.get('Line').Message.Token,
          lineMessageSecret: this.configService.get('Line').Message.Secret
        },
        messages,
      )
      
    }
  }
}
