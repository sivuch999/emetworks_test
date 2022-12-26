import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compareSync } from 'bcrypt';
import { decode, JwtPayload, sign, verify } from 'jsonwebtoken';

@Injectable()
export class AuthenticationService {
  constructor(private readonly configService: ConfigService) {}

  public async compareAndSign(
    data: any,
    requestPassword: string,
    storePassword: string,
    subject: string,
  ): Promise<string> {
    if (!this.configService.get('Secret')) {
      throw 'empty secret';
    }

    // compare password
    const compare = compareSync(requestPassword, storePassword);
    if (!compare) {
      throw 'compare password is fail';
    }

    // sign data to token
    delete data.id;
    delete data.password;
    const token = sign({ data }, this.configService.get('Secret'), {
      subject,
      expiresIn: '24h',
    });

    return token;
  }

  public verifyAndDecode = (header: string): string | JwtPayload => {
    if (!header) {
      throw 'authorization header is required';
    }
    const [type, credential] = header.split(' ');
    if (type != 'Bearer' || !credential) {
      throw 'invalid token format';
    }

    // verify bearer token
    console.log('test');
    verify(credential, this.configService.get('Secret'));

    // decode jwt token
    return decode(credential);
  };
}
