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
exports.MemberService = void 0;
const common_1 = require("@nestjs/common");
const member_entity_1 = require("./member.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
let MemberService = class MemberService {
    constructor(memberRepository) {
        this.memberRepository = memberRepository;
    }
    async Create(payload) {
        const sql = payload;
        return await this.memberRepository.save(sql);
    }
    async GetList(payload) {
        const sql = {
            relations: payload.relations,
            select: payload.select,
            where: {
                oaUid: payload.oaUid,
                isActive: payload.isActive
            },
            skip: payload.page
                ? Number(payload.limit) * (Number(payload.page) - 1)
                : undefined,
            take: payload.limit ? Number(payload.limit) : undefined,
        };
        return await this.memberRepository.find(sql);
    }
    async GetOne(payload) {
        const sql = {
            select: payload.select,
            where: {
                id: payload.id,
                oaUid: payload.oaUid,
                oaGid: payload.oaGid
            },
        };
        return await this.memberRepository.findOne(sql);
    }
    async Update(payload) {
        var _a;
        const members = await this.memberRepository.findOneBy({
            id: payload.id,
            oaUid: payload.oaUid,
            oaGid: payload.oaGid,
        });
        if (members) {
            members.isActive = (_a = payload.isActive) !== null && _a !== void 0 ? _a : undefined;
            return await this.memberRepository.save(members);
        }
        return null;
    }
};
MemberService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(member_entity_1.Member)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], MemberService);
exports.MemberService = MemberService;
//# sourceMappingURL=member.service.js.map