import { HttpModule } from '@nestjs/axios';
import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiddlewareBasic } from 'src/commons/middleware/basic.middleware';
import { LineMiddleware } from 'src/commons/middleware/line.middleware';
import { PollController } from './poll.controller';
import { Poll } from './poll.entity';
import { PollService } from './poll.service';
import { PollListController } from './poll_list/poll_list.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Poll]), HttpModule],
  controllers: [PollController],
  providers: [PollService],
  exports: [PollService],
})
export class PollModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(MiddlewareBasic, LineMiddleware)
      // .exclude({ path: 'poll/login', method: RequestMethod.POST })
      .forRoutes(PollController, PollListController);
  }
}
