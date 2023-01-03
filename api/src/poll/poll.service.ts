import { Injectable } from '@nestjs/common';
import { Poll } from './poll.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationService } from 'src/utils/validation/validation.service';
import { SendPollService } from 'src/push/send_poll/send_poll.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PollService {
  constructor(
    @InjectRepository(Poll)
    private pollsRepository: Repository<Poll>,
    private readonly validationService: ValidationService,
    private sendPollService: SendPollService,
    private configService: ConfigService
  ) {}

  public async Create(payload: Poll): Promise<Poll> {
    this.validationService.NullValidator({
      question: payload.question,
      oaUid: payload.oaUid,
      oaGid: payload.oaGid
    });
    payload.pollLists = payload.pollLists.map((e: any, k: number) => {
      return {
        ...e,
        number: k+1
      }
    })
    return await this.pollsRepository.save(payload);
  }

  public async GetList(payload: any): Promise<Poll[]> {
    const sql = {
      relations: payload.relations,
      select: payload.select,
      where: {},
      skip: payload.page
        ? Number(payload.limit) * (Number(payload.page) - 1)
        : undefined,
      take: payload.limit ? Number(payload.limit) : undefined,
    };

    if (payload.isClosed != null && payload.isClosed != undefined) {
      // const now = new Date()
      // const unix = Math.floor(now.getTime() / 1000)
      if (payload.isClosed === true) {
        sql.where = [
          {
            oaUid: payload.oaUid,
            oaGid: payload.oaGid,
            status: In([2, 3])
          }
        ]
      } else {
        sql.where =  {
          // expired: MoreThanOrEqual(unix),
          oaUid: payload.oaUid,
          oaGid: payload.oaGid,
          status: 1
        }
      }
    }

    return await this.pollsRepository.find(sql);
  }

  public async GetOne(payload: any): Promise<Poll> {
    const sql = {
      select: payload.select,
      where: {
        id: payload.id,
        oaUid: payload.oaUid
        // expired: payload.expired,
      },
    };
    return await this.pollsRepository.findOne(sql)
  }

  public async Update(payload: Poll): Promise<Poll> {
    const polls = await this.pollsRepository.findOneBy({
      id: payload.id
    });
    polls.status = payload.status ?? undefined;
    return await this.pollsRepository.save(polls);
  }

  public async ClosePoll(source: any, pollId: number): Promise<any> {
    let message = 'เกิดข้อผิดพลาดบางอย่าง หรือคุณไม่มีสิทธิ์การจัดการโพลนี้ กรุณาลองใหม่อีกครั้งค่ะ'

    this.validationService.NullValidator({
      oaUid: source.oaUid,
      oaGid: source.oaGid,
      pollId: pollId,
    })

    // validate already poll
    const poll = await this.GetOne(
      {
        select: {
          id: true,
          question: true,
          status: true
        },
        id: pollId,
        oaUid: source.oaUid
      }
    )
    
    //ไม่มีสิทธิ์เข้าถึงโพล
    if (!poll) {      
      return {
        message: {
          type: 'text',
          text: message
        },
        isClosed: true
      }
    }

    if (poll.status != 1) {
      message = `โพล ${poll.question} ปิดโหวตแล้วค่ะ`
      return {
        message: {
          type: 'text',
          text: message
        },
        question: poll.question,
        isClosed: true
      }
    }

    //////////



    //////////

    const pollUpdate = await this.Update(
      {
        id: pollId,
        status: 2
      }
    )
    if (!pollUpdate) {
      throw 'close poll failed'
    }

    await this.sendPollService.SendClosedPoll(
      {
        to: source.oaGid,
        lineMessageToken: this.configService.get('Line').Message.Token,
        lineMessageSecret: this.configService.get('Line').Message.Secret
      },
      pollUpdate.id,
      pollUpdate.question
    )

    return true

  }
  
}
