import { Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request, Response, NextFunction } from "express";
import * as fs from "fs";
import { ValidationService } from "src/utils/validation/validation.service";
import { createHmac } from "crypto";
import { Client } from "@line/bot-sdk";

@Injectable()
export class LineMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly validationService: ValidationService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {        
    try {
      const channelSecret = this.configService.get('Line').Message.Secret
      
      const body = JSON.stringify(req.body);
      const signature = createHmac('SHA256', channelSecret).update(body).digest('base64');
      if (signature != req.headers['x-line-signature']) {
        throw "Validate line signature failed";
      } else {
        const client = new Client(
          {
            channelAccessToken: this.configService.get('Line').Message.Token,
            channelSecret: this.configService.get('Line').Message.Secret 
          },
        )
        if (!client) {
          throw 'verify line token failed'
        }

        req.body.client = client

      }
      
      next();

    } catch (error) {
      console.log(error);
      return {
        status: this.validationService.StatusWithCode(401),
        error: error,
      }
      // return { code: 401, status: this.utilsValidation.fnGetStatusWithCode(401), message: err };
    }
  }

}
