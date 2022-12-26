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
exports.AuthenticationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
let AuthenticationService = class AuthenticationService {
    constructor(configService) {
        this.configService = configService;
        this.verifyAndDecode = (header) => {
            if (!header) {
                throw 'authorization header is required';
            }
            const [type, credential] = header.split(' ');
            if (type != 'Bearer' || !credential) {
                throw 'invalid token format';
            }
            console.log('test');
            (0, jsonwebtoken_1.verify)(credential, this.configService.get('Secret'));
            return (0, jsonwebtoken_1.decode)(credential);
        };
    }
    async compareAndSign(data, requestPassword, storePassword, subject) {
        if (!this.configService.get('Secret')) {
            throw 'empty secret';
        }
        const compare = (0, bcrypt_1.compareSync)(requestPassword, storePassword);
        if (!compare) {
            throw 'compare password is fail';
        }
        delete data.id;
        delete data.password;
        const token = (0, jsonwebtoken_1.sign)({ data }, this.configService.get('Secret'), {
            subject,
            expiresIn: '24h',
        });
        return token;
    }
};
AuthenticationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AuthenticationService);
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=authentication.service.js.map