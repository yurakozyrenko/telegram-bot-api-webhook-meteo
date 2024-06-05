import { Module } from '@nestjs/common';

import { UpdatesController } from './updates.controller';
import { UpdatesService } from './updates.service';
import { BotModule } from '../bot/bot.module';

@Module({
  imports: [BotModule],
  controllers: [UpdatesController],
  providers: [UpdatesService],
})
export class UpdatesModule {}
