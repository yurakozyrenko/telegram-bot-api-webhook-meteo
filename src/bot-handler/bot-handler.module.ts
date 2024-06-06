import { Module } from '@nestjs/common';

import { BotHandlersService } from './bot-handler.service';
import { BotModule } from '../bot/bot.module';
import { CronManager } from '../cron/cron.manager';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, BotModule],
  providers: [BotHandlersService, CronManager],
  exports: [BotHandlersService],
})
export class BotHandlersModule {}
