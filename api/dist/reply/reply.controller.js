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
exports.ReplyController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bot_sdk_1 = require("@line/bot-sdk");
const poll_vote_service_1 = require("../poll/poll_vote/poll_vote.service");
let ReplyController = class ReplyController {
    constructor(configService, pollVoteService) {
        this.configService = configService;
        this.pollVoteService = pollVoteService;
    }
    async Webhook(client, events) {
        console.log(events);
        let failed = false;
        await Promise.all(events.map(async (e) => {
            try {
                const replyToken = e.replyToken;
                const replyMessage = [];
                const textMessage = e.message.text;
                switch (e.type) {
                    case "message":
                        if (textMessage.includes(": ")) {
                            const [code, _] = textMessage.split(": ");
                            if (code) {
                                if (code.split("-").length > 0) {
                                    const [pollCode, pollListId] = code.split("-");
                                    const oaUid = e.source.userId;
                                    const pollId = Number(pollCode);
                                    const voted = await this.pollVoteService.VerifyVoted(oaUid, pollId, Number(pollListId));
                                    replyMessage.push(voted.message);
                                    if (!voted.isClosed) {
                                        const isCompleted = await this.pollVoteService.VerifyCompletedAllVote(pollId);
                                        if (isCompleted) {
                                            const qCode = pollId.toString().padStart(5, "0");
                                            replyMessage.push({
                                                type: 'text',
                                                text: `(${qCode}: ${voted.question}) ปิดโหวตแล้วค่ะ`
                                            });
                                            const summary = await this.pollVoteService.SummaryPoll(pollId);
                                            if (summary) {
                                                replyMessage.push({
                                                    type: 'text',
                                                    text: `สรุปผลโหวต: ${summary}`
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        break;
                    default: break;
                }
                if (replyMessage.length > 0) {
                    client.replyMessage(replyToken, replyMessage);
                }
                return true;
            }
            catch (error) {
                console.log(error);
                failed = true;
                return false;
            }
        }));
        if (!failed) {
            return true;
        }
        else {
            throw 'some reply messages failed';
        }
    }
};
__decorate([
    (0, common_1.Post)(":loginClientId"),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)("client")),
    __param(1, (0, common_1.Body)("events")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bot_sdk_1.Client, Object]),
    __metadata("design:returntype", Promise)
], ReplyController.prototype, "Webhook", null);
ReplyController = __decorate([
    (0, common_1.Controller)("reply"),
    __metadata("design:paramtypes", [config_1.ConfigService,
        poll_vote_service_1.PollVoteService])
], ReplyController);
exports.ReplyController = ReplyController;
//# sourceMappingURL=reply.controller.js.map