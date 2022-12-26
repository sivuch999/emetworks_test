"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollListModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const basic_middleware_1 = require("../../commons/middleware/basic.middleware");
const poll_list_controller_1 = require("./poll_list.controller");
const poll_list_entity_1 = require("./poll_list.entity");
const poll_list_service_1 = require("./poll_list.service");
let PollListModule = class PollListModule {
    configure(consumer) {
        consumer
            .apply(basic_middleware_1.MiddlewareBasic);
    }
};
PollListModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([poll_list_entity_1.PollList])],
        controllers: [poll_list_controller_1.PollListController],
        providers: [poll_list_service_1.PollListService],
        exports: [poll_list_service_1.PollListService],
    })
], PollListModule);
exports.PollListModule = PollListModule;
//# sourceMappingURL=poll_list.module.js.map