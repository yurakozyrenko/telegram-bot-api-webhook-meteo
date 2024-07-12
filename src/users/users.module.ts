import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entity/users.entity';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { BotModule } from '../bot/bot.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => BotModule)],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
