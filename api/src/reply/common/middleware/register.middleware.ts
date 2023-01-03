import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
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
            console.log(req.body.events);
            
            await Promise.all(req.body.events.map(async (event: any): Promise<any> => {
                try {
                    let mAction: { type: string, userIds: string[] } = { type: null, userIds: null }
                    let groupId = event.source.groupId
                    
                    if (event.type === 'memberJoined') {
                        mAction.type = 'joined'
                        mAction.userIds = event.joined.members.map((e: any) => e.userId)
                        // mAction = { type: 'joined', userId: event.joined.members[0].userId }
                    } else if (event.type === 'memberLeft') {
                        mAction.type = 'left'
                        mAction.userIds = event.left.members.map((e: any) => e.userId)
                        // mAction = { type: 'left', userId: event.left.members[0].userId }
                    }
                    
                    if (mAction.type) {
                        mAction.userIds.map(async (userId: any) => {
                            
                            if (mAction.type === 'joined' && userId) {
                                 // verify already userId
                                const getMember = await this.memberService.GetOne(
                                    {
                                        select: {
                                            id: true,
                                            isActive: true
                                        },
                                        oaUid: userId,
                                        oaGid: groupId
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
                                    )
                                    
                                    if (!getProfile || getProfile.status != 200) {
                                        throw 'get LINE profile is fail';
                                    }
                                    
                                    // create member
                                    await this.memberService.Create(
                                        {
                                            oaUid: userId,
                                            displayName: getProfile.data.displayName,
                                            pictureUrl: getProfile.data.pictureUrl,
                                            language: getProfile.data.language ? getProfile.data.language : null,
                                            oaGid: groupId
                                        }
                                    )
                                } else {
                                    if (getMember.isActive === false) {
                                        console.log('false');
                                        
                                        await this.memberService.Update(
                                            {
                                                oaUid: userId,
                                                oaGid: groupId,
                                                isActive: true
                                            }
                                        )
                                    }
                                }
                            } else if (mAction.type === 'left' && userId) {
                                await this.memberService.Update(
                                    {
                                        oaUid: userId,
                                        oaGid: groupId,
                                        isActive: false
                                    }
                                )
                            }
                        });
                    }
                } catch (error) {
                    console.log(error)
                    return
                }
              
            }))

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