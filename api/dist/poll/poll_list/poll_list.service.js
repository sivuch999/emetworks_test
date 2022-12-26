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
exports.PollListService = void 0;
const common_1 = require("@nestjs/common");
const poll_list_entity_1 = require("./poll_list.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const validation_service_1 = require("../../utils/validation/validation.service");
let PollListService = class PollListService {
    constructor(pollAnswerRepository, validationService) {
        this.pollAnswerRepository = pollAnswerRepository;
        this.validationService = validationService;
    }
    async Create(payload) {
        this.validationService.NullValidator({
            poll_lists: payload,
        });
        return await this.pollAnswerRepository.save(payload);
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
        if (payload.keyword) {
            sql.where = [
                {
                    firstname: {
                        contains: payload.keyword ? payload.keyword : undefined,
                    },
                },
                {
                    lastname: {
                        contains: payload.keyword ? payload.keyword : undefined,
                    },
                },
            ];
        }
        return await this.pollAnswerRepository.find(sql);
    }
    async GetOne(payload) {
        const sql = {
            select: payload.select,
            where: {
                id: payload.id,
                poll_id: payload.poll_id,
                number: payload.number,
            },
        };
        return await this.pollAnswerRepository.findOne(sql);
    }
};
PollListService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(poll_list_entity_1.PollList)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        validation_service_1.ValidationService])
], PollListService);
exports.PollListService = PollListService;
//# sourceMappingURL=poll_list.service.js.map