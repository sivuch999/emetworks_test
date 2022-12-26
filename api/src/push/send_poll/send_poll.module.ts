import { Global, Module } from "@nestjs/common";
import { SendPollService } from "./send_poll.service";

@Global()
@Module({
  providers: [SendPollService],
  exports: [SendPollService]
})
export class SendPollModule {}
