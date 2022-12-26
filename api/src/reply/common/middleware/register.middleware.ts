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
                        
            if (req.body.events[0].type == 'join') {
                const oaUid = req.body.events[0].source.userId
                // verify already member
                const getMember = await this.memberService.GetOne(
                    {
                        select: {
                            id: true
                        },
                        oaUid: oaUid
                    }
                )
                
                if (!getMember) {
                    // get LINE PROFILE
                    const getProfile = await axios.get(`https://api.line.me/v2/bot/profile/${oaUid}`,
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
                            oaUid: req.body.events[0].source.userId,
                            displayName: getProfile.data.displayName,
                            pictureUrl: getProfile.data.pictureUrl,
                            language: ((getProfile.data.language) ? getProfile.data.language : null )
                        }
                    )
                } else {
                    await this.memberService.Update(
                        {
                            oaUid: req.body.events[0].source.userId,
                            isActive: true
                        }
                    )
                }
            } else if (req.body.events[0].type == 'leave') {
                await this.memberService.Update(
                    {
                        oaUid: req.body.events[0].source.userId,
                        isActive: false
                    }
                )
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