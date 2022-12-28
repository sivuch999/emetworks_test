import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from '@hapi/joi';
import { AppController } from './app.controller';
import { EnvironmentController } from './configs/environment/environment.controller';
import { AppService } from './app.service';
import { MemberModule } from './member/member.module';
import { Member } from './member/member.entity';
import { ValidationModule } from './utils/validation/validation.module';
import { AuthenticationModule } from './utils/authentication/authentication.module';
import { PollListModule } from './poll/poll_list/poll_list.module';
import { PollList } from './poll/poll_list/poll_list.entity';
import { PollModule } from './poll/poll.module';
import { Poll } from './poll/poll.entity';
import { ReplyModule } from './reply/reply.module';
import { SendPollModule } from './push/send_poll/send_poll.module';
import { PollVoteModule } from './poll/poll_vote/poll_vote.module';
import { PollVote } from './poll/poll_vote/poll_vote.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmConfigAsync } from './configs/typeorm.config';

const environmentController = new EnvironmentController();
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: [(process.env.NODE_ENV ? `.${process.env.NODE_ENV}.env` : '.env')],
      isGlobal: true,
      load: [environmentController.Get],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('local', 'deploy')
          .default('local'),
        // PORT: Joi.number().default(8080)
      }),
    }),
    TypeOrmModule.forRootAsync(TypeOrmConfigAsync
      // type: 'mysql',
      // host: configService.get('HOST'),
      // port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
      // username: process.env.DB_USERNAME,
      // password: process.env.DB_PASSWORD,
      // database: process.env.DB_NAME,
      // entities: [Member, Poll, PollList, PollVote],
      // synchronize: process.env.DB_SYNCHRONIZE == 'YES' ? true : false,
      // logging: true,
    ),
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
