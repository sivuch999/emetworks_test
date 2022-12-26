"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollModule = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const basic_middleware_1 = require("../commons/middleware/basic.middleware");
const line_middleware_1 = require("../commons/middleware/line.middleware");
const poll_controller_1 = require("./poll.controller");
const poll_entity_1 = require("./poll.entity");
const poll_service_1 = require("./poll.service");
const poll_list_controller_1 = require("./poll_list/poll_list.controller");
let PollModule = class PollModule {
    configure(consumer) {
        consumer
            .apply(basic_middleware_1.MiddlewareBasic, line_middleware_1.LineMiddleware)
            .forRoutes(poll_controller_1.PollController, poll_list_controller_1.PollListController);
    }
};
PollModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([poll_entity_1.Poll]), axios_1.HttpModule],
        controllers: [poll_controller_1.PollController],
        providers: [poll_service_1.PollService],
        exports: [poll_service_1.PollService],
    })
], PollModule);
exports.PollModule = PollModule;
//# sourceMappingURL=poll.module.js.map