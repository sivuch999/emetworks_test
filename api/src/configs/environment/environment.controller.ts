import { Controller } from '@nestjs/common';
import { Environment } from './environment.interface';

@Controller('environment')
export class EnvironmentController {
  public Get(): Environment {
    let options: Environment = {
      Name: process.env.NODE_ENV,
      Port: parseInt(process.env.PORT) ?? 8080,
      Database: {
        host: process.env.DB_HOST,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME,
        port: process.env.DB_PORT,
        synchronize: process.env.DB_SYNCHRONIZE,
        logging: process.env.LOGGING,
      },
      // Secret: process.env.SECRET,
      Line: {
        Liff: {
          Url: process.env.LINE_LIFF_URL
        },
        Notify: {
          Token: process.env.LINE_NOTIFY_TOKEN,
        },
        Message: {
          Secret: process.env.LINE_MESSAGE_SECRET,
          Token: process.env.LINE_MESSAGE_TOKEN,
        },
        Login: {
          ClientId: process.env.LINE_LOGIN_CLIENT_ID,
        },
        GroupId: process.env.LINE_GROUP_ID,
      },
    };
    return options;
  }
}
