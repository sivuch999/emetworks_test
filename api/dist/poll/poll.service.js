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
let PollService = class PollService {
    constructor(pollsRepository, validationService) {
        this.pollsRepository = pollsRepository;
        this.validationService = validationService;
    }
    async Create(payload) {
        this.validationService.NullValidator({
            question: payload.question,
            oaUid: payload.oaUid
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
                        status: (0, typeorm_1.In)([2, 3])
                    }
                ];
            }
            else {
                sql.where = {
                    oaUid: payload.oaUid,
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
            },
        };
        return await this.pollsRepository.findOne(sql);
    }
    async Update(payload) {
        var _a;
        const polls = await this.pollsRepository.findOneBy({
            id: payload.id,
        });
        polls.status = (_a = payload.status) !== null && _a !== void 0 ? _a : undefined;
        return await this.pollsRepository.save(polls);
    }
};
PollService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(poll_entity_1.Poll)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        validation_service_1.ValidationService])
], PollService);
exports.PollService = PollService;
//# sourceMappingURL=poll.service.js.map