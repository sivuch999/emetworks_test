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
exports.RegisterMiddleware = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
const validation_service_1 = require("../../../utils/validation/validation.service");
const member_service_1 = require("../../../member/member.service");
let RegisterMiddleware = class RegisterMiddleware {
    constructor(configService, validationService, memberService) {
        this.configService = configService;
        this.validationService = validationService;
        this.memberService = memberService;
    }
    async use(req, res, next) {
        try {
            console.log(req.body.events);
            await Promise.all(req.body.events.map(async (event) => {
                try {
                    let mAction = { type: null, userIds: null };
                    let groupId = event.source.groupId;
                    if (event.type === 'memberJoined') {
                        mAction.type = 'joined';
                        mAction.userIds = event.joined.members.map((e) => e.userId);
                    }
                    else if (event.type === 'memberLeft') {
                        mAction.type = 'left';
                        mAction.userIds = event.left.members.map((e) => e.userId);
                    }
                    if (mAction.type) {
                        mAction.userIds.map(async (userId) => {
                            if (mAction.type === 'joined' && userId) {
                                const getMember = await this.memberService.GetOne({
                                    select: {
                                        id: true,
                                        isActive: true
                                    },
                                    oaUid: userId,
                                    oaGid: groupId
                                });
                                if (!getMember) {
                                    const getProfile = await axios_1.default.get(`https://api.line.me/v2/bot/profile/${userId}`, {
                                        headers: {
                                            Authorization: `Bearer ${this.configService.get("Line").Message.Token}`,
                                        }
                                    });
                                    if (!getProfile || getProfile.status != 200) {
                                        throw 'get LINE profile is fail';
                                    }
                                    await this.memberService.Create({
                                        oaUid: userId,
                                        displayName: getProfile.data.displayName,
                                        pictureUrl: getProfile.data.pictureUrl,
                                        language: getProfile.data.language ? getProfile.data.language : null,
                                        oaGid: groupId
                                    });
                                }
                                else {
                                    if (getMember.isActive === false) {
                                        console.log('false');
                                        await this.memberService.Update({
                                            oaUid: userId,
                                            oaGid: groupId,
                                            isActive: true
                                        });
                                    }
                                }
                            }
                            else if (mAction.type === 'left' && userId) {
                                await this.memberService.Update({
                                    oaUid: userId,
                                    oaGid: groupId,
                                    isActive: false
                                });
                            }
                        });
                    }
                }
                catch (error) {
                    console.log(error);
                    return;
                }
            }));
            next();
        }
        catch (error) {
            console.log(error);
            return {
                status: this.validationService.StatusWithCode(401),
                error: error,
            };
        }
    }
};
RegisterMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        validation_service_1.ValidationService,
        member_service_1.MemberService])
], RegisterMiddleware);
exports.RegisterMiddleware = RegisterMiddleware;
//# sourceMappingURL=register.middleware.js.map