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
exports.PollList = void 0;
const typeorm_1 = require("typeorm");
const poll_entity_1 = require("../poll.entity");
const poll_vote_entity_1 = require("../poll_vote/poll_vote.entity");
let PollList = class PollList {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PollList.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'poll_id', type: 'integer', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], PollList.prototype, "pollId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], PollList.prototype, "number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false }),
    __metadata("design:type", String)
], PollList.prototype, "answer", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PollList.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PollList.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], PollList.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => poll_entity_1.Poll, (poll) => poll.pollLists, {
        nullable: false,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'poll_id' }),
    __metadata("design:type", poll_entity_1.Poll)
], PollList.prototype, "poll", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => poll_vote_entity_1.PollVote, (pollVote) => pollVote.pollList, { cascade: true }),
    __metadata("design:type", Array)
], PollList.prototype, "pollListVotes", void 0);
PollList = __decorate([
    (0, typeorm_1.Entity)("poll_lists")
], PollList);
exports.PollList = PollList;
//# sourceMappingURL=poll_list.entity.js.map