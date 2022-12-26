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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const poll_vote_service_1 = require("./poll/poll_vote/poll_vote.service");
const send_poll_service_1 = require("./push/send_poll/send_poll.service");
let AppService = class AppService {
    constructor(pollVoteService, sendPollService, configService) {
        this.pollVoteService = pollVoteService;
        this.sendPollService = sendPollService;
        this.configService = configService;
    }
    async handleCronMemberNotVote() {
        const now = new Date();
        console.log(now);
        const membersNotVote = await this.pollVoteService.VerifyMemberNotVote();
        const messages = [];
        if (membersNotVote) {
            membersNotVote.forEach((e) => {
                const qCode = e.pollId.toString().padStart(5, "0");
                let memberName = '';
                e.members.forEach((m) => {
                    memberName += `${m.display_name}, `;
                });
                messages.push(`(${qCode}: ${e.question}) ${memberName.slice(0, -2)} ยังไม่ได้ตอบ กรุณาตอบ poll ด้วยค่ะ`);
            });
            await this.sendPollService.SendReminderPoll({
                to: this.configService.get('Line').GroupId,
                lineMessageToken: this.configService.get('Line').Message.Token,
                lineMessageSecret: this.configService.get('Line').Message.Secret
            }, messages);
        }
    }
};
__decorate([
    (0, schedule_1.Cron)('0 0 0 1 * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppService.prototype, "handleCronMemberNotVote", null);
AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [poll_vote_service_1.PollVoteService,
        send_poll_service_1.SendPollService,
        config_1.ConfigService])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map