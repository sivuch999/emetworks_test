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
exports.MiddlewareBasic = void 0;
const common_1 = require("@nestjs/common");
const authentication_service_1 = require("../../utils/authentication/authentication.service");
const validation_service_1 = require("../../utils/validation/validation.service");
let MiddlewareBasic = class MiddlewareBasic {
    constructor(validationService, authenticationService) {
        this.validationService = validationService;
        this.authenticationService = authenticationService;
    }
    use(req, res, next) {
        try {
            next();
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
MiddlewareBasic = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [validation_service_1.ValidationService,
        authentication_service_1.AuthenticationService])
], MiddlewareBasic);
exports.MiddlewareBasic = MiddlewareBasic;
//# sourceMappingURL=basic.middleware.js.map