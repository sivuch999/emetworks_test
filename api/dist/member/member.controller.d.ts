import { ValidationService } from 'src/utils/validation/validation.service';
import { MemberService } from './member.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
export declare class MemberController {
    private readonly configService;
    private readonly memberService;
    private readonly validationService;
    constructor(configService: ConfigService, memberService: MemberService, validationService: ValidationService);
    create(body: {
        oaUid: string;
        displayName?: string;
        pictureUrl?: string;
        language?: string;
    }): Promise<any>;
    update(params: any, body: {
        isActive: boolean;
    }): Promise<any>;
    listGroupByUid(req: Request): Promise<any>;
}
