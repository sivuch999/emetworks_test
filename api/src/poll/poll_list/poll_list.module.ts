import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiddlewareBasic } from 'src/commons/middleware/basic.middleware';
import { PollListController } from './poll_list.controller';
import { PollList } from './poll_list.entity';
import { PollListService } from './poll_list.service';
// import { AdmPositionsController } from './adm_positions/adm_positions.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([PollList])],
  controllers: [PollListController],
  providers: [PollListService],
  exports: [PollListService],
})
export class PollListModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(MiddlewareBasic)
  }
}
