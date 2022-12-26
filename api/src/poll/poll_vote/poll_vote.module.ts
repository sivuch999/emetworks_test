import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiddlewareBasic } from 'src/commons/middleware/basic.middleware';
import { Member } from 'src/member/member.entity';
import { PollVoteController } from './poll_vote.controller';
import { PollVote } from './poll_vote.entity';
import { PollVoteService } from './poll_vote.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([PollVote, Member])],
  controllers: [PollVoteController],
  providers: [PollVoteService],
  exports: [PollVoteService]
})
export class PollVoteModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(MiddlewareBasic)
      // .exclude({ path: 'pollAnswer/login', method: RequestMethod.POST })
      // .forRoutes(PollVoteController, AdmPositionsController);
  }
}
