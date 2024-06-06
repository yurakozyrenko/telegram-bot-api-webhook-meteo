import { Module } from '@nestjs/common';

import { BotHandlersService } from './bot-handler.service';
import { BotModule } from '../bot/bot.module';
import { UsersModule } from '../users/users.module';
import { CronManager } from 'src/cron/cron.manager';

@Module({
  imports: [UsersModule, BotModule],
  providers: [BotHandlersService, CronManager],
  exports: [BotHandlersService],
})
export class BotHandlersModule {}
