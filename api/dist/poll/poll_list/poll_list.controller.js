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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollListController = void 0;
const common_1 = require("@nestjs/common");
const validation_service_1 = require("../../utils/validation/validation.service");
const poll_list_service_1 = require("./poll_list.service");
let PollListController = class PollListController {
    constructor(pollAnswerService, validationService) {
        this.pollAnswerService = pollAnswerService;
        this.validationService = validationService;
    }
    async Create(body) {
        try {
            const pollAnswerCreate = await this.pollAnswerService.
                Create(body.poll_lists);
            if (!pollAnswerCreate) {
                throw 'create failed';
            }
            return pollAnswerCreate;
        }
        catch (error) {
            console.log(error);
            return {
                status: this.validationService.StatusWithCode(400),
                error: error,
            };
        }
    }
};
__decorate([
    (0, common_1.Post)('/'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PollListController.prototype, "Create", null);
PollListController = __decorate([
    (0, common_1.Controller)('poll/poll_list'),
    __metadata("design:paramtypes", [poll_list_service_1.PollListService,
        validation_service_1.ValidationService])
], PollListController);
exports.PollListController = PollListController;
//# sourceMappingURL=poll_list.controller.js.map