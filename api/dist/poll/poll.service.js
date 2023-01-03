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
exports.PollService = void 0;
const common_1 = require("@nestjs/common");
const poll_entity_1 = require("./poll.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const validation_service_1 = require("../utils/validation/validation.service");
const send_poll_service_1 = require("../push/send_poll/send_poll.service");
const config_1 = require("@nestjs/config");
let PollService = class PollService {
    constructor(pollsRepository, validationService, sendPollService, configService) {
        this.pollsRepository = pollsRepository;
        this.validationService = validationService;
        this.sendPollService = sendPollService;
        this.configService = configService;
    }
    async Create(payload) {
        this.validationService.NullValidator({
            question: payload.question,
            oaUid: payload.oaUid,
            oaGid: payload.oaGid
        });
        payload.pollLists = payload.pollLists.map((e, k) => {
            return Object.assign(Object.assign({}, e), { number: k + 1 });
        });
        return await this.pollsRepository.save(payload);
    }
    async GetList(payload) {
        const sql = {
            relations: payload.relations,
            select: payload.select,
            where: {},
            skip: payload.page
                ? Number(payload.limit) * (Number(payload.page) - 1)
                : undefined,
            take: payload.limit ? Number(payload.limit) : undefined,
        };
        if (payload.isClosed != null && payload.isClosed != undefined) {
            if (payload.isClosed === true) {
                sql.where = [
                    {
                        oaUid: payload.oaUid,
                        oaGid: payload.oaGid,
                        status: (0, typeorm_1.In)([2, 3])
                    }
                ];
            }
            else {
                sql.where = {
                    oaUid: payload.oaUid,
                    oaGid: payload.oaGid,
                    status: 1
                };
            }
        }
        return await this.pollsRepository.find(sql);
    }
    async GetOne(payload) {
        const sql = {
            select: payload.select,
            where: {
                id: payload.id,
                oaUid: payload.oaUid
            },
        };
        return await this.pollsRepository.findOne(sql);
    }
    async Update(payload) {
        var _a;
        const polls = await this.pollsRepository.findOneBy({
            id: payload.id
        });
        polls.status = (_a = payload.status) !== null && _a !== void 0 ? _a : undefined;
        return await this.pollsRepository.save(polls);
    }
    async ClosePoll(source, pollId) {
        let message = 'เกิดข้อผิดพลาดบางอย่าง หรือคุณไม่มีสิทธิ์การจัดการโพลนี้ กรุณาลองใหม่อีกครั้งค่ะ';
        this.validationService.NullValidator({
            oaUid: source.oaUid,
            oaGid: source.oaGid,
            pollId: pollId,
        });
        const poll = await this.GetOne({
            select: {
                id: true,
                question: true,
                status: true
            },
            id: pollId,
            oaUid: source.oaUid
        });
        if (!poll) {
            return {
                message: {
                    type: 'text',
                    text: message
                },
                isClosed: true
            };
        }
        if (poll.status != 1) {
            message = `โพล ${poll.question} ปิดโหวตแล้วค่ะ`;
            return {
                message: {
                    type: 'text',
                    text: message
                },
                question: poll.question,
                isClosed: true
            };
        }
        const pollUpdate = await this.Update({
            id: pollId,
            status: 2
        });
        if (!pollUpdate) {
            throw 'close poll failed';
        }
        await this.sendPollService.SendClosedPoll({
            to: source.oaGid,
            lineMessageToken: this.configService.get('Line').Message.Token,
            lineMessageSecret: this.configService.get('Line').Message.Secret
        }, pollUpdate.id, pollUpdate.question);
        return true;
    }
};
PollService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(poll_entity_1.Poll)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        validation_service_1.ValidationService,
        send_poll_service_1.SendPollService,
        config_1.ConfigService])
], PollService);
exports.PollService = PollService;
//# sourceMappingURL=poll.service.js.map