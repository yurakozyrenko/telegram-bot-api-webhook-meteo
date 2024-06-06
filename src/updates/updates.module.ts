import { Module } from '@nestjs/common';

import { UpdatesController } from './updates.controller';
import { UpdatesService } from './updates.service';
import { BotModule } from '../bot/bot.module';
import { BotHandlersModule } from '../bot-handler/bot-handler.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [BotModule, UsersModule, BotHandlersModule],
  controllers: [UpdatesController],
  providers: [UpdatesService],
})
export class UpdatesModule {}
