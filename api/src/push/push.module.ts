import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { BasicMiddleware } from "./common/middleware/basic.middleware";
import { SendPollModule } from "./send_poll/send_poll.module";

@Module({
    imports: [
      SendPollModule,
    ]
})

export class PushModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
      consumer
        .apply(
          BasicMiddleware
        )
        // .forRoutes(
        //   SendPollController,
        // );
    }
}
