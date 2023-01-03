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
const bot_sdk_1 = require("@line/bot-sdk");
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
                pollLists: body.pollLists,
                oaUid: req['oa']['sub'],
                oaGid: body.oaGid,
            });
            if (body.pollLists.length > poll_1.POLL_LIST_MAX) {
                throw `The number of polls isz greater than ${poll_1.POLL_LIST_MAX}`;
            }
            var pollListValue = body.pollLists.map((v) => v.answer);
            var pollListFilterDup = pollListValue.filter((v, k) => {
                return pollListValue.indexOf(v) == k;
            }).map((v) => { return { answer: v }; });
            const pollCreate = await this.pollService.
                Create({
                question: body.question,
                oaUid: req['oa']['sub'],
                oaGid: body.oaGid,
                pollLists: pollListFilterDup,
            });
            if (!pollCreate) {
                throw 'create polls failed';
            }
            const question = `${pollCreate.question}`;
            const answer = pollCreate.pollLists.map((e) => {
                const queryParamsAnswer = { type: 'vote', pollId: pollCreate.id, pollListId: e.id };
                return {
                    label: e.answer,
                    data: new URLSearchParams(queryParamsAnswer).toString(),
                    text: `โพล ${pollCreate.question} ตอบ ${e.answer}`
                };
            });
            const queryParamsPollId = { type: 'close', pollId: pollCreate.id };
            await this.sendPollService.SendCreatePoll({
                to: body.oaGid,
                lineMessageToken: this.configService.get('Line').Message.Token,
                lineMessageSecret: this.configService.get('Line').Message.Secret
            }, question, answer, new URLSearchParams(queryParamsPollId).toString());
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
                const messages = await this.pollVoteService.SummaryPoll(pollUpdate.id);
                if (messages) {
                    await this.sendPollService.SendSummaryPoll({
                        to: body.oaGid,
                        lineMessageToken: this.configService.get('Line').Message.Token,
                        lineMessageSecret: this.configService.get('Line').Message.Secret
                    }, messages);
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
        var _a;
        try {
            this.validationService.NullValidator({
                oaUid: req['oa']['sub'],
            });
            const client = new bot_sdk_1.Client({
                'channelAccessToken': this.configService.get('Line').Message.Token,
                'channelSecret': this.configService.get('Line').Message.Secret
            });
            if (!client) {
                throw 'verify line token failed';
            }
            let isClosedToBool;
            if (query.isClosed) {
                isClosedToBool = query.isClosed.toLowerCase() === 'false' ? false : Boolean(query.isClosed);
            }
            const pollGetList = await this.pollService.GetList({
                select: {
                    id: true,
                    question: true,
                    oaGid: true
                },
                isClosed: isClosedToBool !== null && isClosedToBool !== void 0 ? isClosedToBool : undefined,
                oaUid: req['oa']['sub'],
                oaGid: (_a = query.groupId) !== null && _a !== void 0 ? _a : undefined,
            });
            const pollList = Promise.all(pollGetList.map(async (e) => {
                const oaGroup = await client.getGroupSummary(e.oaGid);
                return {
                    id: e.id,
                    question: e.question,
                    groupId: oaGroup.groupId,
                    groupName: oaGroup.groupName
                };
            }));
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
            const push = [];
            if (membersNotVote) {
                membersNotVote.forEach((e, k) => {
                    push[k] = {
                        to: e.groupId,
                        message: ''
                    };
                    let memberName = '';
                    e.members.forEach((m) => {
                        memberName += `${m.display_name}, `;
                    });
                    push[k].message = `(${e.question}) ${memberName.slice(0, -2)} ยังไม่ได้ตอบ กรุณาตอบ poll ด้วยค่ะ`;
                });
                await this.sendPollService.SendReminderPoll({
                    lineMessageToken: this.configService.get('Line').Message.Token,
                    lineMessageSecret: this.configService.get('Line').Message.Secret
                }, push);
            }
            return push;
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