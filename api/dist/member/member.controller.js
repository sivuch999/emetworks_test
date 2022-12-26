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
exports.MemberController = void 0;
const common_1 = require("@nestjs/common");
const validation_service_1 = require("../utils/validation/validation.service");
const member_service_1 = require("./member.service");
const config_1 = require("@nestjs/config");
let MemberController = class MemberController {
    constructor(configService, memberService, validationService) {
        this.configService = configService;
        this.memberService = memberService;
        this.validationService = validationService;
    }
    async create(body) {
        try {
            this.validationService.NullValidator({
                oaUid: body.oaUid
            });
            const memberCreate = await this.memberService.
                Create({
                oaUid: body.oaUid,
                displayName: body.displayName,
                pictureUrl: body.pictureUrl,
                language: body.language
            });
            if (!memberCreate) {
                throw 'create failed';
            }
            return memberCreate;
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
        const memberUpdate = await this.memberService.Update({
            oaUid: params.oaUid,
            isActive: body.isActive
        });
        if (!memberUpdate) {
            throw 'member update failed';
        }
        return memberUpdate;
    }
};
__decorate([
    (0, common_1.Post)('/'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MemberController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('/'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MemberController.prototype, "update", null);
MemberController = __decorate([
    (0, common_1.Controller)('member'),
    __metadata("design:paramtypes", [config_1.ConfigService,
        member_service_1.MemberService,
        validation_service_1.ValidationService])
], MemberController);
exports.MemberController = MemberController;
//# sourceMappingURL=member.controller.js.map