"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollVoteModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const basic_middleware_1 = require("../../commons/middleware/basic.middleware");
const member_entity_1 = require("../../member/member.entity");
const poll_vote_controller_1 = require("./poll_vote.controller");
const poll_vote_entity_1 = require("./poll_vote.entity");
const poll_vote_service_1 = require("./poll_vote.service");
let PollVoteModule = class PollVoteModule {
    configure(consumer) {
        consumer
            .apply(basic_middleware_1.MiddlewareBasic);
    }
};
PollVoteModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([poll_vote_entity_1.PollVote, member_entity_1.Member])],
        controllers: [poll_vote_controller_1.PollVoteController],
        providers: [poll_vote_service_1.PollVoteService],
        exports: [poll_vote_service_1.PollVoteService]
    })
], PollVoteModule);
exports.PollVoteModule = PollVoteModule;
//# sourceMappingURL=poll_vote.module.js.map