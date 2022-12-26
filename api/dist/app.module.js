"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const Joi = require("@hapi/joi");
const app_controller_1 = require("./app.controller");
const environment_controller_1 = require("./configs/environment/environment.controller");
const app_service_1 = require("./app.service");
const member_module_1 = require("./member/member.module");
const member_entity_1 = require("./member/member.entity");
const validation_module_1 = require("./utils/validation/validation.module");
const authentication_module_1 = require("./utils/authentication/authentication.module");
const poll_list_module_1 = require("./poll/poll_list/poll_list.module");
const poll_list_entity_1 = require("./poll/poll_list/poll_list.entity");
const poll_module_1 = require("./poll/poll.module");
const poll_entity_1 = require("./poll/poll.entity");
const reply_module_1 = require("./reply/reply.module");
const send_poll_module_1 = require("./push/send_poll/send_poll.module");
const poll_vote_module_1 = require("./poll/poll_vote/poll_vote.module");
const poll_vote_entity_1 = require("./poll/poll_vote/poll_vote.entity");
const schedule_1 = require("@nestjs/schedule");
const environmentController = new environment_controller_1.EnvironmentController();
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [environmentController.Get],
                validationSchema: Joi.object({
                    NODE_ENV: Joi.string()
                        .valid('production', 'development')
                        .default('development'),
                    PORT: Joi.number().default(8080)
                }),
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: process.env.DIALECT ? 'mysql' : 'postgres',
                host: process.env.DB_HOST,
                port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                entities: [member_entity_1.Member, poll_entity_1.Poll, poll_list_entity_1.PollList, poll_vote_entity_1.PollVote],
                synchronize: process.env.DB_SYNCHRONIZE == 'YES' ? true : false,
                logging: true,
            }),
            reply_module_1.ReplyModule,
            member_module_1.MemberModule,
            validation_module_1.ValidationModule,
            authentication_module_1.AuthenticationModule,
            poll_module_1.PollModule,
            poll_list_module_1.PollListModule,
            poll_vote_module_1.PollVoteModule,
            send_poll_module_1.SendPollModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map