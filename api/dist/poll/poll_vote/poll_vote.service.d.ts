import { PollVote } from './poll_vote.entity';
import { Repository, Connection } from 'typeorm';
import { ValidationService } from 'src/utils/validation/validation.service';
import { PollService } from '../poll.service';
import { PollListService } from '../poll_list/poll_list.service';
import { ConfigService } from '@nestjs/config';
import { MemberService } from 'src/member/member.service';
import { Member } from 'src/member/member.entity';
import { SendPollService } from 'src/push/send_poll/send_poll.service';
import { Message } from '@line/bot-sdk';
export declare class PollVoteService {
    private readonly pollVoteRepository;
    private readonly memberRepository;
    private readonly connection;
    private readonly validationService;
    private readonly pollService;
    private readonly pollListService;
    private readonly memberService;
    private readonly sendPollService;
    private readonly configService;
    constructor(pollVoteRepository: Repository<PollVote>, memberRepository: Repository<Member>, connection: Connection, validationService: ValidationService, pollService: PollService, pollListService: PollListService, memberService: MemberService, sendPollService: SendPollService, configService: ConfigService);
    Create(payload: PollVote[]): Promise<PollVote[]>;
    GetList(payload: any): Promise<PollVote[]>;
    GetOne(payload: any): Promise<PollVote>;
    Update(payload: PollVote): Promise<PollVote>;
    Delete(payload: PollVote, isDestroy?: boolean): Promise<any>;
    VerifyVoted(source: any, pollId: number, pollListId: number): Promise<any>;
    VerifyCompletedAllVote(pollId: number): Promise<boolean>;
    SummaryPoll(pollId: number): Promise<Message[]>;
    VerifyMemberNotVote(): Promise<any>;
}
