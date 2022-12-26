import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthenticationService } from 'src/utils/authentication/authentication.service';
import { ValidationService } from 'src/utils/validation/validation.service';

@Injectable()
export class MiddlewareBasic implements NestMiddleware {
  constructor(
    private readonly validationService: ValidationService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    try {
      // const me = this.authenticationService.verifyAndDecode(
      //   req.headers.authorization,
      // );
      // req['me'] = me;

      next();
    } catch (error) {
      console.log(error);
      res.json({
        status: this.validationService.StatusWithCode(401),
        error: error,
      });
    }
  }
}
