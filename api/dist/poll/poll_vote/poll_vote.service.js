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
exports.PollVoteService = void 0;
const common_1 = require("@nestjs/common");
const poll_vote_entity_1 = require("./poll_vote.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const validation_service_1 = require("../../utils/validation/validation.service");
const poll_service_1 = require("../poll.service");
const poll_list_service_1 = require("../poll_list/poll_list.service");
const config_1 = require("@nestjs/config");
const member_service_1 = require("../../member/member.service");
const send_poll_service_1 = require("../../push/send_poll/send_poll.service");
const poll_1 = require("../../utils/define/poll");
let PollVoteService = class PollVoteService {
    constructor(pollVoteRepository, memberRepository, connection, validationService, pollService, pollListService, memberService, sendPollService, configService) {
        this.pollVoteRepository = pollVoteRepository;
        this.memberRepository = memberRepository;
        this.connection = connection;
        this.validationService = validationService;
        this.pollService = pollService;
        this.pollListService = pollListService;
        this.memberService = memberService;
        this.sendPollService = sendPollService;
        this.configService = configService;
    }
    async Create(payload) {
        this.validationService.NullValidator({
            poll_votes: payload,
        });
        return await this.pollVoteRepository.save(payload);
    }
    async GetList(payload) {
        const sql = {
            relations: payload.relations,
            select: payload.select,
            where: {
                pollId: payload.pollId,
            },
            skip: payload.page
                ? Number(payload.limit) * (Number(payload.page) - 1)
                : undefined,
            take: payload.limit ? Number(payload.limit) : undefined,
        };
        return await this.pollVoteRepository.find(sql);
    }
    async GetOne(payload) {
        const sql = {
            select: payload.select,
            where: {
                id: payload.id,
                pollId: payload.pollId,
                pollListId: payload.pollListId,
                oa_uid: payload.oa_uid,
            },
        };
        return await this.pollVoteRepository.findOne(sql);
    }
    async Update(payload) {
        const sql = payload;
        return await this.pollVoteRepository.save(sql);
    }
    async Delete(payload, isDestroy = false) {
        if (isDestroy) {
            const sql = payload;
            return await this.pollVoteRepository.delete(sql.id);
        }
        else {
            const sql = payload;
            return await this.pollVoteRepository.softDelete(sql.id);
        }
    }
    async VerifyVoted(source, pollId, pollListId) {
        try {
            let message = 'เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้งค่ะ';
            this.validationService.NullValidator({
                oaUid: source.oaUid,
                pollId: pollId,
                pollListId: pollListId,
            });
            console.log(1);
            const poll = await this.pollService.GetOne({
                select: {
                    id: true,
                    question: true,
                    status: true
                },
                id: pollId,
            });
            if (!poll) {
                throw 'get polls not found';
            }
            console.log(2);
            if (poll.status != 1) {
                message = `โพล ${poll.question} ปิดโหวตแล้วค่ะ`;
                return {
                    message: {
                        type: 'text',
                        text: message
                    },
                    question: poll.question,
                    isClosed: true
                };
            }
            console.log(3);
            const pollList = await this.pollListService.GetOne({
                select: {
                    id: true,
                    pollId: true
                },
                pollId: poll.id,
                id: pollListId
            });
            if (!pollList) {
                throw 'get poll_lists not found';
            }
            console.log(4);
            const pollVote = await this.GetOne({
                select: {
                    id: true,
                },
                pollId: poll.id,
                oaUid: source.oaUid
            });
            console.log(5);
            const payload = {
                pollId: poll.id,
                pollListId: pollList.id,
                oaUid: source.oaUid,
                oaGid: source.oaGid
            };
            if (!pollVote) {
                const pollVoteCreate = await this.Create([payload]);
                if (pollVoteCreate) {
                    message = 'ได้รับคำตอบแล้ว ขอบคุณค่ะ';
                }
            }
            else {
                payload.id = pollVote.id;
                const pollVoteUpdate = await this.Update(payload);
                if (pollVoteUpdate) {
                    message = 'เปลี่ยนคำตอบแล้ว ขอบคุณค่ะ';
                }
            }
            return {
                message: {
                    type: 'text',
                    text: message
                },
                question: poll.question,
                isClosed: false
            };
        }
        catch (error) {
            console.log(error);
        }
    }
    async VerifyCompletedAllVote(pollId) {
        const memberNotVoted = await this.connection.query(`
      SELECT
        COUNT(members.id) AS count
      FROM
        members
      LEFT JOIN poll_votes ON members.oa_uid = poll_votes.oa_uid
        AND poll_votes.poll_id = ${pollId}
        AND poll_votes.deleted_at IS NULL
      WHERE
        members.deleted_at IS NULL
        AND members.is_active = TRUE
        AND poll_votes.id IS NULL
    `);
        if (Number(memberNotVoted[0].count) <= 0) {
            const pollUpdate = await this.pollService.Update({
                id: pollId,
                status: poll_1.POLL_STATUS.Closed
            });
            if (!pollUpdate) {
                throw 'delete failed';
            }
            return true;
        }
        return false;
    }
    async SummaryPoll(pollId) {
        const rawPollSummary = await this.connection.query(`
      SELECT
        poll_lists.answer,
        COUNT(poll_votes.id) AS count
      FROM
        poll_lists
      LEFT JOIN poll_votes ON poll_lists.id = poll_votes.poll_list_id
      WHERE
        poll_votes.deleted_at IS NULL
        AND poll_lists.deleted_at IS NULL
        AND poll_lists.poll_id = ${pollId}
      GROUP BY
        poll_lists.id
      ORDER BY
        COUNT(poll_votes.id) DESC,
        poll_lists.id ASC
    `);
        if (rawPollSummary) {
            if (rawPollSummary.length > 0) {
                let message = '';
                rawPollSummary.map((e) => {
                    message += `${e.answer}(${e.count}) / `;
                });
                return message.slice(0, -3);
            }
        }
        return null;
    }
    async VerifyMemberNotVote() {
        try {
            const pollGetList = await this.pollService.GetList({
                select: {
                    id: true,
                    question: true,
                    oaUid: true,
                    oaGid: true
                },
                isClosed: false
            });
            if (pollGetList.length <= 0) {
                throw 'get poll_vote not found';
            }
            let membersNotVote = [];
            await Promise.all(pollGetList.map(async (e) => {
                const members = await this.connection.query(`
          SELECT
            members.id,
            members.display_name,
            poll_votes.id,
            poll_votes.poll_id
          FROM
            members
          LEFT JOIN poll_votes ON members.oa_uid = poll_votes.oa_uid
            AND poll_votes.poll_id = ${e.id}
          WHERE
            members.deleted_at IS NULL
            AND members.is_active = TRUE
            AND poll_votes.id IS NULL
        `);
                if (members && members.length > 0) {
                    membersNotVote.push({
                        pollId: e.id,
                        groupId: e.oaGid,
                        question: e.question,
                        members: members
                    });
                }
            }));
            return membersNotVote;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
};
PollVoteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(poll_vote_entity_1.PollVote)),
    __param(1, (0, typeorm_2.InjectRepository)(poll_vote_entity_1.PollVote)),
    __param(2, (0, typeorm_2.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Connection,
        validation_service_1.ValidationService,
        poll_service_1.PollService,
        poll_list_service_1.PollListService,
        member_service_1.MemberService,
        send_poll_service_1.SendPollService,
        config_1.ConfigService])
], PollVoteService);
exports.PollVoteService = PollVoteService;
//# sourceMappingURL=poll_vote.service.js.map