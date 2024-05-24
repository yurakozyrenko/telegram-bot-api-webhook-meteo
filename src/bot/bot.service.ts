import { Injectable } from '@nestjs/common';
import { BotProvider } from './bot.provider';
import { actions, messages } from './bot.constants';
import { Cron } from '@nestjs/schedule';
import { cronTime, cronTimezone } from 'src/utils/consts';
import getMeteoData from 'src/utils/getMeteo';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BotService {
  private messageHandlers: Record<
    string,
    (chatId: number, message: string) => Promise<void>
  >;

  constructor(
    private readonly bot: BotProvider,
    private readonly usersService: UsersService,
  ) {
    this.messageHandlers = {
      [actions.START]: async (chatId: number) => {
        
        const city = 'минск';
        await this.usersService.createUser({ chatId, city });
        await this.bot.sendMessage(chatId, messages.START);
      },
      default: async (chatId: number, message: string) => {
        const meteoData = await getMeteoData(message);

        await this.bot.sendMessage(chatId, meteoData);
      },
    };
  }

  async sendMessage(chatId: number, message: string) {
    const handler =
      this.messageHandlers[message] || this.messageHandlers.default;
    await handler(chatId, message);
  }

  @Cron(cronTime, { timeZone: cronTimezone })
  async sendMeteo() {
    const users = await this.usersService.getAllUsers();

    for (const user of users) {
      const meteoData = await getMeteoData(user.city);
      await this.bot.sendMessage(user.chatId, meteoData);
    }
  }
}
