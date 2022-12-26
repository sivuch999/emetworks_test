import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'jsonwebtoken';
export declare class AuthenticationService {
    private readonly configService;
    constructor(configService: ConfigService);
    compareAndSign(data: any, requestPassword: string, storePassword: string, subject: string): Promise<string>;
    verifyAndDecode: (header: string) => string | JwtPayload;
}
