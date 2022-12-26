import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthenticationService } from 'src/utils/authentication/authentication.service';
import { ValidationService } from 'src/utils/validation/validation.service';
export declare class MiddlewareBasic implements NestMiddleware {
    private readonly validationService;
    private readonly authenticationService;
    constructor(validationService: ValidationService, authenticationService: AuthenticationService);
    use(req: Request, res: Response, next: NextFunction): void;
}
