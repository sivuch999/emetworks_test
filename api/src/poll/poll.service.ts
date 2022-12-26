import { Injectable } from '@nestjs/common';
import { Poll } from './poll.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationService } from 'src/utils/validation/validation.service';

@Injectable()
export class PollService {
  constructor(
    @InjectRepository(Poll)
    private pollsRepository: Repository<Poll>,
    private readonly validationService: ValidationService,
  ) {}

  public async Create(payload: Poll): Promise<Poll> {
    this.validationService.NullValidator({
      question: payload.question,
      oaUid: payload.oaUid
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
            status: In([2, 3])
          }
        ]
      } else {
        sql.where =  {
          // expired: MoreThanOrEqual(unix),
          oaUid: payload.oaUid,
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
        // expired: payload.expired,
      },
    };
    return await this.pollsRepository.findOne(sql)
  }

  public async Update(payload: Poll): Promise<Poll> {
    const polls = await this.pollsRepository.findOneBy({
      id: payload.id,

    });
    polls.status = payload.status ?? undefined;
    return await this.pollsRepository.save(polls);
  }

  // public async Delete(payload: Poll, isDestroy = false): Promise<any> {
  //   if (isDestroy) {
  //     const sql: Poll = payload;
  //     return await this.pollsRepository.delete(sql.id);
  //   } else {
  //     const sql: Poll = payload;
  //     return await this.pollsRepository.softDelete(sql.id);
  //   }
  // }
  
}
