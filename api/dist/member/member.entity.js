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
exports.Member = void 0;
const typeorm_1 = require("typeorm");
let Member = class Member {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Member.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'oa_uid', type: 'varchar', nullable: false }),
    __metadata("design:type", String)
], Member.prototype, "oaUid", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'oa_gid', type: 'varchar', nullable: false }),
    __metadata("design:type", String)
], Member.prototype, "oaGid", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'display_name', type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "displayName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'picture_url', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "pictureUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "language", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', nullable: true, default: true }),
    __metadata("design:type", Boolean)
], Member.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Member.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Member.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], Member.prototype, "deletedAt", void 0);
Member = __decorate([
    (0, typeorm_1.Entity)('members')
], Member);
exports.Member = Member;
//# sourceMappingURL=member.entity.js.map