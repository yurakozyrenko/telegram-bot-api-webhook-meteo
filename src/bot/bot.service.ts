import { Injectable } from '@nestjs/common';
import { BotProvider } from './bot.provider';
import { actions, messages, cities, times } from './bot.constants';
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
        await this.bot.sendMessage(chatId, messages.START);
        await this.sendCitySelection(chatId);
      },

      [actions.SELECT_CITY]: async (chatId: number, city: string) => {
        await this.usersService.createUser({ chatId, city });
        await this.bot.sendMessage(
          chatId,
          `${messages.CITY_CONFIRMED} ${city}`,
        );
        await this.sendTimeSelection(chatId);
      },

      [actions.SELECT_TIME]: async (chatId: number, time: string) => {
        await this.usersService.updateUser(chatId, { time });
        await this.bot.sendMessage(
          chatId,
          `${messages.TIME_CONFIRMED} ${time}`,
        );
        // this.scheduleDailyMessage(chatId, time); // Планирование сообщения на указанное время
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

  async sendCitySelection(chatId: number) {
    const inlineKeyboard = {
      inline_keyboard: cities.map((city) => [
        { text: city, callback_data: `${actions.SELECT_CITY}:${city}` },
      ]),
    };

    await this.bot.sendMessage(chatId, messages.CITY_SELECTION, {
      reply_markup: inlineKeyboard,
    });
  }

  async sendTimeSelection(chatId: number) {
    const inlineKeyboard = {
      inline_keyboard: times.map((time) => [
        { text: time, callback_data: `${actions.SELECT_TIME}:${time}` },
      ]),
    };

    await this.bot.sendMessage(chatId, messages.TIME_SELECTION, {
      reply_markup: inlineKeyboard,
    });
  }

  async handleCallbackQuery(callbackQuery: any) {

    const [action, data] = callbackQuery.data.split(':');
    const chatId = callbackQuery.message.chat.id;

    if (action === actions.SELECT_CITY) {
      await this.messageHandlers[actions.SELECT_CITY](chatId, data);
    }

    if (action === actions.SELECT_TIME) {
      await this.messageHandlers[actions.SELECT_TIME](chatId, data);
    }
  }
}
