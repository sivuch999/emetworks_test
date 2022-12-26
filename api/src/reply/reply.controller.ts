import { Controller, HttpCode, Post, Body } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Client } from "@line/bot-sdk";
import { ValidationService } from "src/utils/validation/validation.service";
import { PollVoteService } from "src/poll/poll_vote/poll_vote.service";

@Controller("reply")
export class ReplyController {
    constructor(
        private readonly configService: ConfigService,
        private readonly pollVoteService: PollVoteService,
    ){}
  
    @Post(":loginClientId")
    @HttpCode(200)
    public async Webhook(@Body("client") client: Client, @Body("events") events: any) {
        console.log(events);
       
        let failed = false
        await Promise.all(events.map(async (e: any): Promise<boolean> => {
            try {
                const replyToken = e.replyToken;            
                const replyMessage: Array<any> = [];
                const textMessage = e.message.text
                switch (e.type) {
                    case "message":
                        if (textMessage.includes(": ")) {
                            const [code, _] = textMessage.split(": ")
                            if (code) {
                                if (code.split("-").length > 0) {
                                    const [pollCode, pollListId] = code.split("-")
                                    const oaUid: string = e.source.userId
                                    const pollId: number = Number(pollCode)
                                    const voted: any = await this.pollVoteService.VerifyVoted(oaUid, pollId, Number(pollListId))
                                    replyMessage.push(voted.message)
                                    if (!voted.isClosed) {
                                        const isCompleted = await this.pollVoteService.VerifyCompletedAllVote(pollId)
                                        if (isCompleted) {
                                            const qCode = pollId.toString().padStart(5, "0")
                                            replyMessage.push(
                                                {
                                                    type: 'text',
                                                    text: `(${qCode}: ${voted.question}) ปิดโหวตแล้วค่ะ`
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
                                }
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