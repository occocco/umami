import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MemberService } from './member.service.js';
import { CreateMemberDto } from './member.js';

@ApiTags('회원')
@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  async signup(@Body() data: CreateMemberDto) {
    return this.memberService.signup(data);
  }
}
