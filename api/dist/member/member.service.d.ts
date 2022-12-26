import { Member } from './member.entity';
import { Repository } from 'typeorm';
export declare class MemberService {
    private memberRepository;
    constructor(memberRepository: Repository<Member>);
    Create(payload: Member): Promise<Member>;
    GetList(payload: any): Promise<Member[]>;
    GetOne(payload: any): Promise<Member>;
    Update(payload: Member): Promise<Member>;
}
