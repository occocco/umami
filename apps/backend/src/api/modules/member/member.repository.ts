import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class MemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.member.findUnique({ where: { email } });
  }

  create(data: Prisma.MemberCreateInput) {
    return this.prisma.member.create({ data });
  }
}
