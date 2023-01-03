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
import { MemberController } from './member.controller';
import { Member } from './member.entity';
import { MemberService } from './member.service';
// import { AdmPositionsController } from './adm_positions/adm_positions.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Member]), HttpModule],
  controllers: [MemberController],
  providers: [MemberService],
  exports: [MemberService]
})
export class MemberModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(MiddlewareBasic, LineMiddleware)
      // .exclude({ path: 'member/login', method: RequestMethod.POST })
      .forRoutes(MemberController);
  }
}
