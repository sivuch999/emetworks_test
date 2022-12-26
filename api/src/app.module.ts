import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from '@hapi/joi';
import { AppController } from './app.controller';
import { EnvironmentController } from './configs/environment/environment.controller';
import { AppService } from './app.service';
import { MemberModule } from './member/member.module';
import { Member } from './member/member.entity';
import { ValidationModule } from './utils/validation/validation.module';
import { AuthenticationService } from './utils/authentication/authentication.service';
import { AuthenticationModule } from './utils/authentication/authentication.module';
import { ValidationService } from './utils/validation/validation.service';
// import { AdmPositions } from './member/adm_positions/adm_positions.entity';
import { PollListModule } from './poll/poll_list/poll_list.module';
import { PollList } from './poll/poll_list/poll_list.entity';
import { PollModule } from './poll/poll.module';
import { Poll } from './poll/poll.entity';
import { ReplyModule } from './reply/reply.module';
import { SendPollModule } from './push/send_poll/send_poll.module';
import { PollVoteModule } from './poll/poll_vote/poll_vote.module';
import { PollVote } from './poll/poll_vote/poll_vote.entity';
import { ScheduleModule } from '@nestjs/schedule';

const environmentController = new EnvironmentController();
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [environmentController.Get],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('production', 'development')
          .default('development'),
        PORT: Joi.number().default(8080)
      }),
    }),
    TypeOrmModule.forRoot({
      type: process.env.DIALECT ? 'mysql' : 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Member, Poll, PollList, PollVote],
      synchronize: process.env.DB_SYNCHRONIZE == 'YES' ? true : false,
      logging: true,
    }),
    ReplyModule,
    MemberModule,
    ValidationModule,
    AuthenticationModule,
    PollModule,
    PollListModule,
    PollVoteModule,
    SendPollModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
