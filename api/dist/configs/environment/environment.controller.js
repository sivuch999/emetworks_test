"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentController = void 0;
const common_1 = require("@nestjs/common");
let EnvironmentController = class EnvironmentController {
    Get() {
        var _a, _b;
        let options = {
            Name: (_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : 'development',
            Port: (_b = Number(process.env.PORT)) !== null && _b !== void 0 ? _b : 8080,
            Secret: process.env.SECRET,
            Line: {
                Notify: {
                    Token: process.env.LINE_NOTIFY_TOKEN,
                },
                Message: {
                    Secret: process.env.LINE_MESSAGE_SECRET,
                    Token: process.env.LINE_MESSAGE_TOKEN,
                },
                Login: {
                    ClientId: process.env.LINE_LOGIN_CLIENT_ID,
                },
                GroupId: process.env.LINE_GROUP_ID,
            },
        };
        return options;
    }
};
EnvironmentController = __decorate([
    (0, common_1.Controller)('environment')
], EnvironmentController);
exports.EnvironmentController = EnvironmentController;
//# sourceMappingURL=environment.controller.js.map