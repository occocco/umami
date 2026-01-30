import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { LoggerModule } from 'nestjs-pino';
import { LoggerConfig } from './config/logger.config.js';
import { PrismaModule } from './api/prisma/prisma.module.js';
import { MemberModule } from './api/modules/member/member.module.js';

@Module({
  imports: [LoggerModule.forRoot(LoggerConfig), PrismaModule, MemberModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
