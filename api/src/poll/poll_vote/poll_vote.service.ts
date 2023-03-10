import { Injectable } from '@nestjs/common';
import { PollVote } from './poll_vote.entity';
import { Repository, Connection } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { ValidationService } from 'src/utils/validation/validation.service';
import { PollService } from '../poll.service';
import { PollListService } from '../poll_list/poll_list.service';
import { DatetimeToUnix } from 'src/utils/helpers';
import { ConfigService } from '@nestjs/config';
import { MemberService } from 'src/member/member.service';
import { Member } from 'src/member/member.entity';
import { SendPollService } from 'src/push/send_poll/send_poll.service';
import { POLL_STATUS } from 'src/utils/define/poll';
import { ContentBody, TemplateContent } from 'src/template/flex.template';
import { Message } from '@line/bot-sdk';

@Injectable()
export class PollVoteService {
  constructor(
    @InjectRepository(PollVote) private readonly pollVoteRepository: Repository<PollVote>,
    @InjectRepository(PollVote) private readonly memberRepository: Repository<Member>,
    @InjectDataSource() private readonly connection: Connection,
    private readonly validationService: ValidationService,
    private readonly pollService: PollService,
    private readonly pollListService: PollListService,
    private readonly memberService: MemberService,
    private readonly sendPollService: SendPollService,
    private readonly configService: ConfigService,
  ) {}

  public async Create(payload: PollVote[]): Promise<PollVote[]> {
    this.validationService.NullValidator({
      poll_votes: payload,
    });
    return await this.pollVoteRepository.save(payload);
  }

  public async GetList(payload: any): Promise<PollVote[]> {
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

  public async GetOne(payload: any): Promise<PollVote> {
    const sql = {
      select: payload.select,
      where: {
        id: payload.id,
        pollId: payload.pollId,
        pollListId: payload.pollListId,
        oaUid: payload.oaUid,
        oaGid: payload.oaGid,
      },
    };
    return await this.pollVoteRepository.findOne(sql);
  }

  public async Update(payload: PollVote): Promise<PollVote> {
    const sql: PollVote = payload;
    return await this.pollVoteRepository.save(sql);
  }

  public async Delete(payload: PollVote, isDestroy = false): Promise<any> {
    if (isDestroy) {
      const sql: PollVote = payload;
      return await this.pollVoteRepository.delete(sql.id);
    } else {
      const sql: PollVote = payload;
      return await this.pollVoteRepository.softDelete(sql.id);
    }
  }

  public async VerifyVoted(source: any, pollId: number, pollListId: number): Promise<any> {
    try {
      let message = '?????????????????????????????????????????????????????????????????? ??????????????????????????????????????????????????????????????????????????????????????????????????? ?????????????????????????????????????????????????????????????????????'

      this.validationService.NullValidator({
        oaUid: source.oaUid,
        pollId: pollId,
        pollListId: pollListId,
      })
      
      // validate already poll
      const poll = await this.pollService.GetOne(
        {
          select: {
            id: true,
            question: true,
            // expired: true,
            status: true
          },
          id: pollId,
          oaUid: source.oaUid
        }
      )
      if (!poll) {
        throw 'get polls not found'
      }
      // validate poll expired time
      // const now = new Date()
      // let unix = DatetimeToUnix(now, 0)
      if (poll.status != 1) {
        message = `????????? ${poll.question} ??????????????????????????????????????????`
        return {
          message: {
            type: 'text',
            text: message
          },
          question: poll.question,
          isClosed: true
        }
      }
  
      // validate already poll_lists
      const pollList = await this.pollListService.GetOne(
        {
          select: {
            id: true,
            pollId: true
          },
          pollId: poll.id,
          id: pollListId
        }
      )
      if (!pollList) {
        throw 'get poll_lists not found'
      }

      // validate poll anwser already vote
      const pollVote = await this.GetOne(
        {
          select: {
            id: true,
          },
          pollId: poll.id,
          oaUid: source.oaUid,
          oaGid: source.oaGid
        }
      )

      console.log('source', source);
      console.log('pollVote', pollVote);
      

      const payload: PollVote = {
        pollId: poll.id,
        pollListId: pollList.id,
        oaUid: source.oaUid,
        oaGid: source.oaGid
      }      
      if (!pollVote) { // case not vote
        const pollVoteCreate = await this.Create([payload])
        if (pollVoteCreate) { message = '????????????????????????????????????????????? ???????????????????????????' }
      } else { // case already vote
        payload.id = pollVote.id
        const pollVoteUpdate = await this.Update(payload)
        if (pollVoteUpdate) { message = '???????????????????????????????????????????????? ???????????????????????????' }
      }
      
      return {
        message: {
          type: 'text',
          text: message
        },
        question: poll.question,
        isClosed: false
      }
      
    } catch (error) {
      console.log(error);
    }

  }

  public async VerifyCompletedAllVote(pollId: number): Promise<boolean> {
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
    `)
    
    if (Number(memberNotVoted[0].count) <= 0) {      
      const pollUpdate = await this.pollService.Update(
        {
          id: pollId,
          status: POLL_STATUS.Closed
        }
      )
      if (!pollUpdate) {
        throw 'delete failed';
      }
      return true
    }

    return false
    
  }

  public async SummaryPoll(pollId: number): Promise<Message[]> {
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
    `)

    let bodyContents: any = []
    rawPollSummary.forEach((e: any, k: number) => {
      if (k >= 3) {
        return
      }
      bodyContents.push({
        'type': 'box',
        'layout': 'baseline',
        'spacing': 'sm',
        'contents': [
          {
            'type': 'text',
            'text': `?????????????????? ${k+1}`,
            'color': '#aaaaaa',
            'size': 'sm',
            'flex': 2
          },
          {
            'type': 'text',
            'text': `${e.answer} (${e.count} ???????????????)`,
            'wrap': true,
            'color': '#666666',
            'size': 'sm',
            'flex': 5
          }
        ] 
      })
      
    })

    let body: ContentBody = {
      type: 'box',
      layout: 'vertical',
      contents: bodyContents
    }
    
    const pushMsg: Message[] = [TemplateContent('????????????????????????????????????', 'bubble', body, null)]

    return pushMsg
    
  }

  public async VerifyMemberNotVote(): Promise<any> {
    try {
      // get all already poll
      const pollGetList = await this.pollService.GetList(
        {
          select: {
            id: true,
            question: true,
            oaUid: true,
            oaGid: true
          },
          isClosed: false
        }
      )
      if (pollGetList.length <= 0) {
        throw 'get poll_vote not found';
      }

      // get member not vote
      let membersNotVote: any = []
      await Promise.all(pollGetList.map(async (e: any): Promise<any> => {
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
        `)
        if (members && members.length > 0) {
          membersNotVote.push(
            {
              pollId: e.id,
              groupId: e.oaGid,
              question: e.question,
              members: members
            }
          )          
        }
      }))

      return membersNotVote

    } catch (error) {
      console.log(error);
      return null
    }

  }

}
