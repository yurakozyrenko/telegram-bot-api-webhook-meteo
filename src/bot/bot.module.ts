import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { BotProvider } from './bot.provider';
import { BotService } from './bot.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [HttpModule, UsersModule],
  providers: [BotService, BotProvider],
  exports: [BotService],
})
export class BotModule {}
