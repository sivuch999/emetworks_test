import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { LineMiddleware } from "./common/middleware/line.middleware";
import { RegisterMiddleware } from "./common/middleware/register.middleware";
import { ReplyController } from "./reply.controller";
import { ReplyService } from "./reply.service";

@Module({
    imports: [],
    controllers: [ReplyController],
    providers: [ReplyService],
    exports: [ReplyService]
})

export class ReplyModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {        
        consumer
        .apply(
            LineMiddleware,
            RegisterMiddleware
        )
        .forRoutes(
            ReplyController
        );
    }
}
