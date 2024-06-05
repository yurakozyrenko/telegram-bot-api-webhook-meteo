import { Module } from '@nestjs/common';

import { BotModule } from '../bot/bot.module';
import { UpdatesController } from './updates.controller';
import { UpdatesService } from './updates.service';

@Module({
  imports: [BotModule],
  controllers: [UpdatesController],
  providers: [UpdatesService],
})
export class UpdatesModule {}
