import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { BotHandlersService } from './bot-handler.service';
import { BotModule } from '../bot/bot.module';
import { CronModule } from '../cron/cron.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, BotModule, CronModule, HttpModule],
  providers: [BotHandlersService],
  exports: [BotHandlersService],
})
export class BotHandlersModule {}
