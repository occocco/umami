import { Injectable } from '@nestjs/common';
import { MemberRepository } from './member.repository.js';
import { CreateMemberDto } from './member.js';

@Injectable()
export class MemberService {
  constructor(private readonly memberRepo: MemberRepository) {}

  async signup(data: CreateMemberDto) {
    return this.memberRepo.create(data);
  }

  async findMemberByEmail(email: string) {
    return this.memberRepo.findByEmail(email);
  }
}
