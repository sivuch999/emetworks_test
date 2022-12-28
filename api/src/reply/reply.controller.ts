import { Controller, HttpCode, Post, Body } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@line/bot-sdk';
import { ValidationService } from 'src/utils/validation/validation.service';
import { PollVoteService } from 'src/poll/poll_vote/poll_vote.service';
import { ReplyService } from './reply.service';

@Controller('reply')
export class ReplyController {
    constructor(
        private readonly configService: ConfigService,
        private readonly pollVoteService: PollVoteService,
        private readonly replyService: ReplyService,
    ){}
  
    @Post(':loginClientId')
    @HttpCode(200)
    public async Webhook(@Body('client') client: Client, @Body('events') events: any) {       
        let failed = false
        await Promise.all(events.map(async (e: any): Promise<boolean> => {
            try {
                const replyToken = e.replyToken;            
                const replyMessage: Array<any> = [];
                
                switch (e.type) {
                    case 'postback':
                        const params = new URLSearchParams(e.postback.data)                                    
                        const pollId = Number(params.get('pollId'))                                    
                        const pollListId = Number(params.get('pollListId'))
                        const source = {
                            oaUid: e.source.userId,
                            oaGid: e.source.groupId,
                        }
                        if (!pollId || !pollListId || ! source.oaUid || !source.oaGid) {
                            break
                        }
                        const voted: any = await this.pollVoteService.VerifyVoted(source, pollId, pollListId)
                        if (!voted) {
                            break
                        }
                        replyMessage.push(voted.message)
                        if (!voted.isClosed) {
                            const isCompleted = await this.pollVoteService.VerifyCompletedAllVote(pollId)
                            if (isCompleted) {
                                replyMessage.push(
                                    {
                                        type: 'text',
                                        text: `โพล ${voted.question} ปิดโหวตแล้วค่ะ`
                                    }
                                )
                                const summary: string = await this.pollVoteService.SummaryPoll(pollId)
                                if (summary) {
                                    replyMessage.push(
                                        {
                                            type: 'text',
                                            text: `สรุปผลโหวต: ${summary}`
                                        }
                                    )
                                }
                            }                                    
                        }
                        break
                    case 'message':
                        if (!e.message) { return }
                        const textMessage = e.message.text
                        if (textMessage === '#โพล') {
                            if (e.source.groupId) {
                                const messages: any = await this.replyService.ReplyRequestPoll(
                                    '#โพล',
                                    `${this.configService.get('Line').Liff.Url}/poll?groupId=${e.source.groupId}`,
                                    `${this.configService.get('Line').Liff.Url}/list?groupId=${e.source.groupId}`
                                )
                                replyMessage.push(messages)
                            } else {
                                replyMessage.push(
                                    {
                                        type: 'text',
                                        text: `เกิดเข้าผิดพลาด ไม่พบรหัสกลุ่ม กรุณาลองใหม่อีกครั้งค่ะ`
                                    }
                                )
                            }
                        }
                        break;
                    default: break;
                }
    
                if (replyMessage.length > 0) {
                    client.replyMessage(replyToken, replyMessage)
                }
                return true
            } catch (error) {
                console.log(error);
                failed = true
                return false
            }
      
        }))
        
        if (!failed) {
            return true
        } else {
            throw 'some reply messages failed'
        }
        
    }
    
}