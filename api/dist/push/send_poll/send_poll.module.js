"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendPollModule = void 0;
const common_1 = require("@nestjs/common");
const send_poll_service_1 = require("./send_poll.service");
let SendPollModule = class SendPollModule {
};
SendPollModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [send_poll_service_1.SendPollService],
        exports: [send_poll_service_1.SendPollService]
    })
], SendPollModule);
exports.SendPollModule = SendPollModule;
//# sourceMappingURL=send_poll.module.js.map