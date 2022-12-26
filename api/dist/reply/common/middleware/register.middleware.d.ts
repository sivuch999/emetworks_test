import { NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { ValidationService } from 'src/utils/validation/validation.service';
import { MemberService } from 'src/member/member.service';
export declare class RegisterMiddleware implements NestMiddleware {
    private readonly configService;
    private readonly validationService;
    private readonly memberService;
    constructor(configService: ConfigService, validationService: ValidationService, memberService: MemberService);
    use(req: Request, res: Response, next: NextFunction): Promise<{
        status: {
            code: number;
            message: string;
        };
        error: any;
    }>;
}
