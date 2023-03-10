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
const reply_service_1 = require("./reply.service");
const poll_service_1 = require("../poll/poll.service");
let ReplyController = class ReplyController {
    constructor(configService, pollVoteService, pollService, replyService) {
        this.configService = configService;
        this.pollVoteService = pollVoteService;
        this.pollService = pollService;
        this.replyService = replyService;
    }
    async Webhook(client, events) {
        let failed = false;
        await Promise.all(events.map(async (e) => {
            try {
                const replyToken = e.replyToken;
                const replyMessage = [];
                switch (e.type) {
                    case 'postback':
                        const params = new URLSearchParams(e.postback.data);
                        const type = String(params.get('type'));
                        const pollId = Number(params.get('pollId'));
                        const pollListId = Number(params.get('pollListId'));
                        const source = {
                            oaUid: e.source.userId,
                            oaGid: e.source.groupId,
                        };
                        console.log('source', source);
                        if (type == 'vote') {
                            if (!pollId || !pollListId || !source.oaUid || !source.oaGid) {
                                break;
                            }
                            const voted = await this.pollVoteService.VerifyVoted(source, pollId, pollListId);
                            if (!voted) {
                                break;
                            }
                            replyMessage.push(voted.message);
                            if (!voted.isClosed) {
                                const isCompleted = await this.pollVoteService.VerifyCompletedAllVote(pollId);
                                if (isCompleted) {
                                    replyMessage.push({
                                        type: 'text',
                                        text: `????????? ${voted.question} ??????????????????????????????????????????`
                                    });
                                    const messages = await this.pollVoteService.SummaryPoll(pollId);
                                    if (messages && messages.length > 0) {
                                        replyMessage.push(...messages);
                                    }
                                }
                            }
                        }
                        else if (type == 'close') {
                            const closed = await this.pollService.ClosePoll(source, pollId);
                            if (closed) {
                                if (closed.isClosed) {
                                    replyMessage.push(closed.message);
                                    break;
                                }
                                const messages = await this.pollVoteService.SummaryPoll(pollId);
                                if (messages && messages.length > 0) {
                                    replyMessage.push(...messages);
                                }
                            }
                        }
                        break;
                    case 'message':
                        if (!e.message) {
                            return;
                        }
                        const textMessage = e.message.text;
                        if (textMessage === '#?????????'.trim()) {
                            console.log('localhost');
                            if (e.source.groupId) {
                                const messages = await this.replyService.ReplyRequestPoll('#?????????', `${this.configService.get('Line').Liff.Url}/poll?groupId=${e.source.groupId}`, `${this.configService.get('Line').Liff.Url}/list?groupId=${e.source.groupId}`);
                                console.log(messages.contents.body.contents[0].contents);
                                console.log(messages.contents.body.contents[1].contents);
                                replyMessage.push(messages);
                            }
                            else {
                                replyMessage.push({
                                    type: 'text',
                                    text: `????????????????????????????????????????????? ?????????????????????????????????????????? ?????????????????????????????????????????????????????????????????????`
                                });
                            }
                        }
                        break;
                    default: break;
                }
                console.log('replyMessage', replyMessage);
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
    (0, common_1.Post)(':loginClientId'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)('client')),
    __param(1, (0, common_1.Body)('events')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bot_sdk_1.Client, Object]),
    __metadata("design:returntype", Promise)
], ReplyController.prototype, "Webhook", null);
ReplyController = __decorate([
    (0, common_1.Controller)('reply'),
    __metadata("design:paramtypes", [config_1.ConfigService,
        poll_vote_service_1.PollVoteService,
        poll_service_1.PollService,
        reply_service_1.ReplyService])
], ReplyController);
exports.ReplyController = ReplyController;
//# sourceMappingURL=reply.controller.js.map