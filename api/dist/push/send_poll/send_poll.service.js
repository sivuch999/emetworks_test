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
exports.SendPollService = void 0;
const bot_sdk_1 = require("@line/bot-sdk");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const flex_template_1 = require("../../template/flex.template");
let SendPollService = class SendPollService {
    constructor(configService) {
        this.configService = configService;
    }
    async SendCreatePoll(oa, question, answer, pollId) {
        const client = new bot_sdk_1.Client({
            'channelAccessToken': oa.lineMessageToken,
            'channelSecret': oa.lineMessageSecret
        });
        if (!client) {
            throw 'verify line token failed';
        }
        let body = {
            type: 'box',
            layout: 'vertical',
            contents: [
                {
                    'type': 'text',
                    'text': question,
                    'weight': 'bold',
                    'size': 'lg',
                    'wrap': true,
                },
            ]
        };
        let footer = {
            type: 'box',
            layout: 'vertical',
            contents: answer.map((e) => {
                return {
                    'type': 'button',
                    'style': 'secondary',
                    'height': 'sm',
                    'action': {
                        'type': 'postback',
                        'label': e.label,
                        'data': e.data,
                        'displayText': e.text
                    }
                };
            })
        };
        footer.contents.push({
            'type': 'button',
            'style': 'primary',
            'height': 'md',
            'action': {
                'type': 'postback',
                'label': `?????????????????????`,
                'data': pollId,
                'displayText': `?????????????????????????????? ${question}`
            },
            'color': '#CC0033'
        });
        const pushMsg = [(0, flex_template_1.TemplateContent)(question, 'bubble', body, footer)];
        await client.pushMessage(oa.to, pushMsg).catch((e) => { console.log(e); });
    }
    async SendClosedPoll(oa, id, question) {
        const client = new bot_sdk_1.Client({
            'channelAccessToken': oa.lineMessageToken,
            'channelSecret': oa.lineMessageSecret
        });
        if (!client) {
            throw 'verify line token failed';
        }
        const pushMsg = [
            {
                type: 'text',
                text: `????????? ${question} ??????????????????????????????????????????`
            }
        ];
        await client.pushMessage(oa.to, pushMsg).catch((e) => { console.log(e); });
    }
    async SendSummaryPoll(oa, pushMsg) {
        const client = new bot_sdk_1.Client({
            'channelAccessToken': oa.lineMessageToken,
            'channelSecret': oa.lineMessageSecret
        });
        if (!client) {
            throw 'verify line token failed';
        }
        await client.pushMessage(oa.to, pushMsg).catch((e) => { console.log(e); });
    }
    async SendReminderPoll(oa, push) {
        const client = new bot_sdk_1.Client({
            'channelAccessToken': oa.lineMessageToken,
            'channelSecret': oa.lineMessageSecret
        });
        if (!client) {
            throw 'verify line token failed';
        }
        push.forEach(async (e) => {
            await client.pushMessage(e.to, { type: 'text', text: e.message }).catch((e) => { console.log(e); });
        });
    }
};
SendPollService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SendPollService);
exports.SendPollService = SendPollService;
//# sourceMappingURL=send_poll.service.js.map