import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BotModule } from './bot/bot.module';
import { UpdatesModule } from './updates/updates.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import config from './config/configuration';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) =>
        configService.getOrThrow('POSTGRES_DB_SETTINGS'),
      inject: [ConfigService],
    }),
    BotModule,
    UpdatesModule,
    UsersModule,
  ],
})
export class AppModule {}
