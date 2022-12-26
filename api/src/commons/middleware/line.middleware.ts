import { Injectable, NestMiddleware } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { Request, Response, NextFunction } from "express"
import { ValidationService } from "src/utils/validation/validation.service"
import { HttpService } from "@nestjs/axios"

@Injectable()
export class LineMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly validationService: ValidationService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {        
    try {

      const [type, credential] = req.headers.authorization.split(' ');
      if (type != 'Bearer' || !credential) {
        throw 'invalid token format';
      }
      
      const params = new URLSearchParams()
      params.append('id_token', credential)
      params.append('client_id', this.configService.get('Line').Login.ClientId)
      const headers: any = { 
          'Content-Type': 'application/x-www-form-urlencoded'
      }
      const decode = await this.httpService.axiosRef.post(
          'https://api.line.me/oauth2/v2.1/verify',
          params,
          headers
      )
      if (decode) {
          req['oa'] = decode.data
          next()
      }

      return

    } catch (error) {
        console.log(error)
        res.json({
          status: this.validationService.StatusWithCode(401),
          error: error,
        })
      }
  }

}
