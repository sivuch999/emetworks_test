import { Injectable } from '@nestjs/common';
import { Member } from './member.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  public async Create(payload: Member): Promise<Member> {
    const sql = payload;
    return await this.memberRepository.save(sql);
  }

  public async GetList(payload: any): Promise<Member[]> {
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
          display_name: {
            contains: payload.keyword ? payload.keyword : undefined,
          },
        }
      ];
    }
    return await this.memberRepository.find(sql);
  }

  public async GetOne(payload: any): Promise<Member> {
    const sql = {
      select: payload.select,
      where: {
        id: payload.id,
        oaUid: payload.oaUid,
      },
    }
    return await this.memberRepository.findOne(sql);
  }

  public async Update(payload: Member): Promise<Member> {
    const members = await this.memberRepository.findOneBy({
      id: payload.id,
      oaUid: payload.oaUid,
    })
    members.isActive = payload.isActive ?? undefined;
    return await this.memberRepository.save(members);
  }

}
