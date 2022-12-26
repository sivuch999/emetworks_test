import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ValidationService } from 'src/utils/validation/validation.service';
import { MemberService } from './member.service';
import { DatetimeToUnix } from 'src/utils/helpers';
import { ConfigService } from '@nestjs/config';
import { Member } from './member.entity';

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
  

}
