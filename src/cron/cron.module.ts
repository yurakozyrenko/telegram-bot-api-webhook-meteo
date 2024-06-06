import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CronRepository } from './cron.repository';
import { CronService } from './cron.service';
import { CronEntity } from './entity/cron.entity';
import { BotModule } from '../bot/bot.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([CronEntity]), BotModule, UsersModule],
  providers: [CronService, CronRepository],
  exports: [CronService],
})
export class CronModule {}
