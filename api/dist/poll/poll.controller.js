"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollController = void 0;
const common_1 = require("@nestjs/common");
const validation_service_1 = require("../utils/validation/validation.service");
const poll_service_1 = require("./poll.service");
const poll_1 = require("../utils/define/poll");
const send_poll_service_1 = require("../push/send_poll/send_poll.service");
const poll_vote_service_1 = require("./poll_vote/poll_vote.service");
const config_1 = require("@nestjs/config");
let PollController = class PollController {
    constructor(configService, pollService, validationService, sendPollService, pollVoteService) {
        this.configService = configService;
        this.pollService = pollService;
        this.validationService = validationService;
        this.sendPollService = sendPollService;
        this.pollVoteService = pollVoteService;
    }
    async create(body, req) {
        try {
            this.validationService.NullValidator({
                poll_lists: body.pollLists,
                oaUid: req['oa']['sub'],
            });
            if (body.pollLists.length > poll_1.POLL_LIST_MAX) {
                throw `The number of polls is greater than ${poll_1.POLL_LIST_MAX}`;
            }
            const pollCreate = await this.pollService.
                Create({
                question: body.question,
                oaUid: req['oa']['sub'],
                pollLists: body.pollLists,
            });
            if (!pollCreate) {
                throw 'create polls failed';
            }
            const qCode = pollCreate.id.toString().padStart(5, "0");
            const question = `${qCode}: ${pollCreate.question}`;
            const answer = pollCreate.pollLists.map((e) => {
                return {
                    label: e.answer,
                    text: `${qCode}-${e.number}: ${e.answer}`
                };
            });
            await this.sendPollService.SendCreatePoll({
                to: this.configService.get('Line').GroupId,
                lineMessageToken: this.configService.get('Line').Message.Token,
                lineMessageSecret: this.configService.get('Line').Message.Secret
            }, question, answer, null);
            return pollCreate;
        }
        catch (error) {
            console.log(error);
            return {
                status: this.validationService.StatusWithCode(400),
                error: error,
            };
        }
    }
    async update(params, body) {
        try {
            this.validationService.NullValidator({
                id: params.id,
            });
            if (body.status && (body.status != poll_1.POLL_STATUS.Ready
                && body.status != poll_1.POLL_STATUS.Closed
                && body.status != poll_1.POLL_STATUS.Rejected)) {
                throw 'invalid status';
            }
            const pollUpdate = await this.pollService.Update({
                id: params.id,
                status: body.status
            });
            if (!pollUpdate) {
                throw 'delete failed';
            }
            await this.sendPollService.SendClosedPoll({
                to: this.configService.get('Line').GroupId,
                lineMessageToken: this.configService.get('Line').Message.Token,
                lineMessageSecret: this.configService.get('Line').Message.Secret
            }, pollUpdate.id, pollUpdate.question);
            if (body.status == poll_1.POLL_STATUS.Closed) {
                const summary = await this.pollVoteService.SummaryPoll(pollUpdate.id);
                if (summary) {
                    await this.sendPollService.SendSummaryPoll({
                        to: this.configService.get('Line').GroupId,
                        lineMessageToken: this.configService.get('Line').Message.Token,
                        lineMessageSecret: this.configService.get('Line').Message.Secret
                    }, `สรุปผลโหวต: ${summary}`);
                }
            }
            return pollUpdate;
        }
        catch (error) {
            console.log(error);
            return {
                status: this.validationService.StatusWithCode(400),
                error: error,
            };
        }
    }
    async list(query, req) {
        try {
            this.validationService.NullValidator({
                oaUid: req['oa']['sub'],
            });
            let isClosedToBool;
            if (query.isClosed) {
                isClosedToBool = query.isClosed.toLowerCase() === 'false' ? false : Boolean(query.isClosed);
            }
            const pollGetList = await this.pollService.GetList({
                select: {
                    id: true,
                    question: true
                },
                isClosed: isClosedToBool !== null && isClosedToBool !== void 0 ? isClosedToBool : undefined,
                oaUid: req['oa']['sub']
            });
            const pollList = pollGetList.map((e) => {
                return Object.assign(Object.assign({}, e), { code: e.id.toString().padStart(5, "0") });
            });
            return pollList;
        }
        catch (error) {
            console.log(error);
            return {
                status: this.validationService.StatusWithCode(400),
                error: error,
            };
        }
    }
    async notVote() {
        try {
            const membersNotVote = await this.pollVoteService.VerifyMemberNotVote();
            const messages = [];
            console.log(membersNotVote);
            if (membersNotVote) {
                membersNotVote.forEach((e) => {
                    const qCode = e.pollId.toString().padStart(5, "0");
                    let memberName = '';
                    e.members.forEach((m) => {
                        memberName += `${m.display_name}, `;
                    });
                    messages.push(`(${qCode}: ${e.question}) ${memberName.slice(0, -2)} ยังไม่ได้ตอบ กรุณาตอบ poll ด้วยค่ะ`);
                });
            }
            return messages;
        }
        catch (error) {
            console.log(error);
            return {
                status: this.validationService.StatusWithCode(400),
                error: error,
            };
        }
    }
};
__decorate([
    (0, common_1.Post)('/'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PollController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('close/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PollController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PollController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('not_vote'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PollController.prototype, "notVote", null);
PollController = __decorate([
    (0, common_1.Controller)('poll'),
    __metadata("design:paramtypes", [config_1.ConfigService,
        poll_service_1.PollService,
        validation_service_1.ValidationService,
        send_poll_service_1.SendPollService,
        poll_vote_service_1.PollVoteService])
], PollController);
exports.PollController = PollController;
//# sourceMappingURL=poll.controller.js.map