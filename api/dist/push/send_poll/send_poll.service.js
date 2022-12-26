"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendPollService = void 0;
const bot_sdk_1 = require("@line/bot-sdk");
const common_1 = require("@nestjs/common");
const flex_template_1 = require("../template/flex.template");
let SendPollService = class SendPollService {
    async SendCreatePoll(oa, question, answer, expired) {
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
                {
                    'type': 'box',
                    'layout': 'vertical',
                    'margin': 'lg',
                    'spacing': 'sm',
                    'contents': [
                        {
                            'type': 'box',
                            'layout': 'baseline',
                            'spacing': 'sm',
                            'contents': [
                                {
                                    'type': 'text',
                                    'text': 'Expire:',
                                    'color': '#aaaaaa',
                                    'size': 'sm',
                                    'flex': 2
                                },
                            ]
                        }
                    ]
                }
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
                        'type': 'message',
                        'label': e.label,
                        'text': e.text
                    }
                };
            })
        };
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
        const qCode = id.toString().padStart(5, "0");
        const pushMsg = [
            {
                type: 'text',
                text: `(${qCode}: ${question}) ปิดโหวตแล้วค่ะ`
            }
        ];
        await client.pushMessage(oa.to, pushMsg).catch((e) => { console.log(e); });
    }
    async SendSummaryPoll(oa, message) {
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
                text: message
            }
        ];
        await client.pushMessage(oa.to, pushMsg).catch((e) => { console.log(e); });
    }
    async SendReminderPoll(oa, messages) {
        const client = new bot_sdk_1.Client({
            'channelAccessToken': oa.lineMessageToken,
            'channelSecret': oa.lineMessageSecret
        });
        if (!client) {
            throw 'verify line token failed';
        }
        const pushMsg = messages.map((e) => {
            return {
                type: 'text',
                text: e
            };
        });
        await client.pushMessage(oa.to, pushMsg).catch((e) => { console.log(e); });
    }
};
SendPollService = __decorate([
    (0, common_1.Injectable)()
], SendPollService);
exports.SendPollService = SendPollService;
//# sourceMappingURL=send_poll.service.js.map