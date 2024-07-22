import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';

import { BotProvider } from './bot.provider';
import { BotService } from './bot.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [HttpModule, forwardRef(() => UsersModule)],
  providers: [BotService, BotProvider],
  exports: [BotService],
})
export class BotModule {}
