import { Controller, HttpCode, Post, Body } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, Message } from '@line/bot-sdk';
import { ValidationService } from 'src/utils/validation/validation.service';
import { PollVoteService } from 'src/poll/poll_vote/poll_vote.service';
import { ReplyService } from './reply.service';
import { PollService } from 'src/poll/poll.service';

@Controller('reply')
export class ReplyController {
    constructor(
        private readonly configService: ConfigService,
        private readonly pollVoteService: PollVoteService,
        private readonly pollService: PollService,
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
                        const type = String(params.get('type'))                                 
                        const pollId = Number(params.get('pollId'))                                    
                        const pollListId = Number(params.get('pollListId'))
                        const source = {
                            oaUid: e.source.userId,
                            oaGid: e.source.groupId,
                        }
                        console.log('source', source);
                        
                        if (type == 'vote') {
                            if (!pollId || !pollListId || ! source.oaUid || !source.oaGid) {
                                break
                            }
                            const voted = await this.pollVoteService.VerifyVoted(source, pollId, pollListId)
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
                                    const messages = await this.pollVoteService.SummaryPoll(pollId)                                    
                                    if (messages && messages.length > 0) {
                                        replyMessage.push(...messages)
                                    }
                                }                                    
                            }
                        } else if (type == 'close') {
                            const closed = await this.pollService.ClosePoll(source, pollId)
                            if (closed) {
                                if (closed.isClosed) {
                                    replyMessage.push(closed.message)
                                    break
                                }
                                const messages = await this.pollVoteService.SummaryPoll(pollId)                                    
                                if (messages && messages.length > 0) {
                                    replyMessage.push(...messages)
                                }
                            }
                        }

                        break
                    case 'message':
                        if (!e.message) { return }
                        const textMessage = e.message.text
                        if (textMessage === '#โพล'.trim()) {
                            console.log('localhost');
                            
                            if (e.source.groupId) {
                                const messages: any = await this.replyService.ReplyRequestPoll(
                                    '#โพล',
                                    `${this.configService.get('Line').Liff.Url}/poll?groupId=${e.source.groupId}`,
                                    `${this.configService.get('Line').Liff.Url}/list?groupId=${e.source.groupId}`
                                )
                                console.log(messages.contents.body.contents[0].contents);
                                console.log(messages.contents.body.contents[1].contents);
                                
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
    
                console.log('replyMessage', replyMessage);
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