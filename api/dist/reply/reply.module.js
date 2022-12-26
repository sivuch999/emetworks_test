"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplyModule = void 0;
const common_1 = require("@nestjs/common");
const line_middleware_1 = require("./common/middleware/line.middleware");
const register_middleware_1 = require("./common/middleware/register.middleware");
const reply_controller_1 = require("./reply.controller");
let ReplyModule = class ReplyModule {
    configure(consumer) {
        consumer
            .apply(line_middleware_1.LineMiddleware, register_middleware_1.RegisterMiddleware)
            .forRoutes(reply_controller_1.ReplyController);
    }
};
ReplyModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [reply_controller_1.ReplyController]
    })
], ReplyModule);
exports.ReplyModule = ReplyModule;
//# sourceMappingURL=reply.module.js.map