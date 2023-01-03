import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ValidationService } from 'src/utils/validation/validation.service';
import { MemberService } from './member.service';
import { ConfigService } from '@nestjs/config';
import { Member } from './member.entity';
import { Client } from '@line/bot-sdk';
import { Request } from 'express';

@Controller('member')
export class MemberController {
  constructor(
    private readonly configService: ConfigService,
    private readonly memberService: MemberService,
    private readonly validationService: ValidationService
  ) {}

  @Post('/')
  async create(
    @Body()
    body: {
      oaUid: string;
      displayName?: string,
      pictureUrl?: string,
      language?: string
    }
  ): Promise<any> {
    try {

      this.validationService.NullValidator({
        oaUid: body.oaUid
      });
      
      const memberCreate = 
        await this.memberService.
          Create(
            {
              oaUid: body.oaUid,
              displayName: body.displayName,
              pictureUrl: body.pictureUrl,
              language: body.language
            }
          );
      if (!memberCreate) {
        throw 'create failed';
      }

      return memberCreate;
      
    } catch (error) {
      console.log(error);
      return {
        status: this.validationService.StatusWithCode(400),
        error: error,
      };
    }
  }

  @Patch('/')
  async update(
    @Param() params,
    @Body() body: { isActive: boolean },
  ): Promise<any> {
    const memberUpdate = await this.memberService.Update(
      {
        oaUid: params.oaUid,
        isActive: body.isActive
      }
    )
    if (!memberUpdate) {
      throw 'member update failed';
    }
    return memberUpdate
  }

  @Get('group')
  async listGroupByUid(
    @Req() req: Request,
  ): Promise<any> {
    try {
      this.validationService.NullValidator({
        oaUid: req['oa']['sub'],
      })

      const client = new Client(
        {
          'channelAccessToken': this.configService.get('Line').Message.Token,
          'channelSecret': this.configService.get('Line').Message.Secret
        },
      )
      if (!client) {
        throw 'verify line token failed'
      }

      const memberGetList = await this.memberService.GetList(
        {
          select: {
            id: true,
            oaUid: true,
            oaGid: true
          },
          oaUid: req['oa']['sub'],
          isActive: true
        }
      )      

      const pollList = Promise.all(memberGetList.map(async (e: Member): Promise<any>  => {
        const oaGroup = await client.getGroupSummary(e.oaGid)
        return {
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
  

}
