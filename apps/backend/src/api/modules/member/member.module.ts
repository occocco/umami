import { Module } from '@nestjs/common';
import { MemberController } from './member.controller.js';
import { MemberService } from './member.service.js';
import { MemberRepository } from './member.repository.js';

@Module({
  controllers: [MemberController],
  providers: [MemberService, MemberRepository],
})
export class MemberModule {}
