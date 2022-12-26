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
exports.Poll = void 0;
const typeorm_1 = require("typeorm");
const poll_1 = require("../utils/define/poll");
const poll_list_entity_1 = require("./poll_list/poll_list.entity");
const poll_vote_entity_1 = require("./poll_vote/poll_vote.entity");
let Poll = class Poll {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Poll.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'oa_uid', type: 'varchar', nullable: false }),
    __metadata("design:type", String)
], Poll.prototype, "oaUid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false }),
    __metadata("design:type", String)
], Poll.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', nullable: false, default: poll_1.POLL_STATUS.Ready }),
    __metadata("design:type", Number)
], Poll.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Poll.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Poll.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], Poll.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => poll_list_entity_1.PollList, (pollList) => pollList.poll, { cascade: true }),
    __metadata("design:type", Array)
], Poll.prototype, "pollLists", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => poll_vote_entity_1.PollVote, (pollVote) => pollVote.poll, { cascade: true }),
    __metadata("design:type", Array)
], Poll.prototype, "pollVotes", void 0);
Poll = __decorate([
    (0, typeorm_1.Entity)("polls")
], Poll);
exports.Poll = Poll;
//# sourceMappingURL=poll.entity.js.map