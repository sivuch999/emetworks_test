import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import e, { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { ValidationService } from 'src/utils/validation/validation.service';
import { MemberService } from 'src/member/member.service';

@Injectable()
export class RegisterMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly validationService: ValidationService,
    private readonly memberService: MemberService,
  ) {}
  
    async use(req: Request, res: Response, next: NextFunction) {
        try {

            console.log(req.body.events)

            let mAction: { type: string, userIds: string[] }            

            if (req.body.events[0].type === 'memberJoined') {
                mAction.type = 'joined'
                mAction.userIds = req.body.events[0].joined.members[0].map((e: any) => e.userId)
                // mAction = { type: 'joined', userId: req.body.events[0].joined.members[0].userId }
            } else if (req.body.events[0].type === 'memberLeft') {
                mAction.type = 'left'
                mAction.userIds = req.body.events[0].left.members[0].map((e: any) => e.userId)
                // mAction = { type: 'left', userId: req.body.events[0].left.members[0].userId }
            }
            
            if (mAction) {
                mAction.userIds.map(async (userId: any) => {
                    if (mAction.type === 'joined' && userId > 0) {
                         // verify already userId
                        const getMember = await this.memberService.GetOne(
                            {
                                select: {
                                    id: true
                                },
                                oaUid: userId
                            }
                        )
                        if (!getMember) {                    
                            // get LINE PROFILE
                            const getProfile = await axios.get(`https://api.line.me/v2/bot/profile/${userId}`,
                                {
                                    headers: {
                                        Authorization: `Bearer ${this.configService.get("Line").Message.Token}`,
                                    }
                                }
                            );
                            if (!getProfile || getProfile.status != 200) {
                                throw 'get LINE profile is fail';
                            }
            
                            // create member
                            await this.memberService.Create(
                                {
                                    oaUid: userId,
                                    displayName: getProfile.data.displayName,
                                    pictureUrl: getProfile.data.pictureUrl,
                                    language: ((getProfile.data.language) ? getProfile.data.language : null )
                                }
                            )
                        } else {
                            if (getMember.isActive === false) {
                                await this.memberService.Update(
                                    {
                                        oaUid: userId,
                                        isActive: true
                                    }
                                )
                            }
                        }
                    } else if (mAction.type === 'left' && userId) {
                        await this.memberService.Update(
                            {
                                oaUid: userId,
                                isActive: false
                            }
                        )
                    }
                });
            }
        
            next();

        } catch (error) {
            console.log(error);
            return {
                status: this.validationService.StatusWithCode(401),
                error: error,
            }
        }

    }

}