import { Controller } from '@nestjs/common';
import { Environment } from './environment.interface';

@Controller('environment')
export class EnvironmentController {
  public Get(): Environment {
    let options: Environment = {
      Name: process.env.NODE_ENV ?? 'development',
      Port: Number(process.env.PORT) ?? 8080,
      Secret: process.env.SECRET,
      Line: {
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
