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
const validation_service_1 = require("../../utils/validation/validation.service");
const axios_1 = require("@nestjs/axios");
let LineMiddleware = class LineMiddleware {
    constructor(configService, httpService, validationService) {
        this.configService = configService;
        this.httpService = httpService;
        this.validationService = validationService;
    }
    async use(req, res, next) {
        try {
            const [type, credential] = req.headers.authorization.split(' ');
            if (type != 'Bearer' || !credential) {
                throw 'invalid token format';
            }
            const params = new URLSearchParams();
            params.append('id_token', credential);
            params.append('client_id', this.configService.get('Line').Login.ClientId);
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };
            const decode = await this.httpService.axiosRef.post('https://api.line.me/oauth2/v2.1/verify', params, headers);
            if (decode) {
                req['oa'] = decode.data;
                next();
            }
            return;
        }
        catch (error) {
            console.log(error);
            res.json({
                status: this.validationService.StatusWithCode(401),
                error: error,
            });
        }
    }
};
LineMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        axios_1.HttpService,
        validation_service_1.ValidationService])
], LineMiddleware);
exports.LineMiddleware = LineMiddleware;
//# sourceMappingURL=line.middleware.js.map