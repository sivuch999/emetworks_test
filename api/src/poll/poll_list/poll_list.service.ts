import { Injectable } from '@nestjs/common';
import { PollList } from './poll_list.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationService } from 'src/utils/validation/validation.service';

@Injectable()
export class PollListService {
  constructor(
    @InjectRepository(PollList) private readonly pollAnswerRepository: Repository<PollList>,
    private readonly validationService: ValidationService,
  ) {}

  public async Create(payload: PollList[]): Promise<PollList[]> {
    this.validationService.NullValidator({
      poll_lists: payload,
    });
    return await this.pollAnswerRepository.save(payload);
  }

  public async GetList(payload: any): Promise<PollList[]> {
    const sql = {
      relations: payload.relations,
      select: payload.select,
      where: {},
      skip: payload.page
        ? Number(payload.limit) * (Number(payload.page) - 1)
        : undefined,
      take: payload.limit ? Number(payload.limit) : undefined,
    };
    if (payload.keyword) {
      sql.where = [
        {
          firstname: {
            contains: payload.keyword ? payload.keyword : undefined,
          },
        },
        {
          lastname: {
            contains: payload.keyword ? payload.keyword : undefined,
          },
        },
      ];
    }
    return await this.pollAnswerRepository.find(sql);
  }

  public async GetOne(payload: any): Promise<PollList> {
    const sql = {
      select: payload.select,
      where: {
        id: payload.id,
        poll_id: payload.poll_id,
        number: payload.number,
      },
    };
    return await this.pollAnswerRepository.findOne(sql);
  }

}
