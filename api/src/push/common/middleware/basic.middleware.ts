import { Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Client } from "@line/bot-sdk";
import { Request, Response, NextFunction } from "express";
import { ValidationService as UtilsValidation } from "src/utils/validation/validation.service";

@Injectable()
export class BasicMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly utilsValidation: UtilsValidation
  ) {}

  use(req: Request, res: Response, next: NextFunction) {

    try {   

      req.body.client = new Client({ "channelAccessToken": this.configService.get("Line").MessageToken, "channelSecret": this.configService.get("Line").MessageSecret });
      if (req.headers.authorization) {
        const [type, credentials] = req.headers.authorization.split(" ");
        if (type != "Basic" || credentials != this.configService.get("BasicToken")) {
          throw "verify token is fail";
        }
      } else {
        throw "header authorization is required";
      }
      
      next();

    } catch (error) {
      console.log(error);
      // return { code: 401, status: this.utilsValidation.fnGetStatusWithCode(401), message: err };
    }

  }
  
}
