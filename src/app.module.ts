import { Module } from '@nestjs/common';
import { ConfigModule} from '@nestjs/config';
// import { BotModule } from './bot/bot.module';
import { UpdatesModule } from './updates/updates.module';

import config from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ConfigModule,
    // BotModule,
    UpdatesModule,
  ],
})
export class AppModule {}
