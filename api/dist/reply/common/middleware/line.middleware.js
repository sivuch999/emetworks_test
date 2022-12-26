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
exports.LineMiddleware = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const validation_service_1 = require("../../../utils/validation/validation.service");
const crypto_1 = require("crypto");
const bot_sdk_1 = require("@line/bot-sdk");
let LineMiddleware = class LineMiddleware {
    constructor(configService, validationService) {
        this.configService = configService;
        this.validationService = validationService;
    }
    async use(req, res, next) {
        try {
            console.log('ee');
            const channelSecret = process.env.LINE_MESSAGE_SECRET;
            const body = JSON.stringify(req.body);
            const signature = (0, crypto_1.createHmac)('SHA256', channelSecret).update(body).digest('base64');
            if (signature != req.headers['x-line-signature']) {
                throw "Validate line signature failed";
            }
            else {
                const client = new bot_sdk_1.Client({
                    channelAccessToken: this.configService.get('Line').Message.Token,
                    channelSecret: this.configService.get('Line').Message.Secret
                });
                if (!client) {
                    throw 'verify line token failed';
                }
                req.body.client = client;
            }
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
LineMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        validation_service_1.ValidationService])
], LineMiddleware);
exports.LineMiddleware = LineMiddleware;
//# sourceMappingURL=line.middleware.js.map