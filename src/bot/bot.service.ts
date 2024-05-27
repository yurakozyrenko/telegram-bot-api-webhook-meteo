import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { BotProvider } from './bot.provider';
import { actions, messages } from './bot.constants';
import * as cron from 'node-cron';
import getMeteoData from 'src/utils/getMeteo';
import { UsersService } from 'src/users/users.service';

import convertTimeToCron from 'src/utils/timeToCronValue';
import sendCitySelection from 'src/utils/sendCitySelection';
import sendTimeSelection from 'src/utils/sendTimeSelection';

@Injectable()
export class BotService implements OnModuleInit, OnModuleDestroy {
  private messageHandlers: Record<
    string,
    (chatId: number, message: string) => Promise<void>
  >;
  private userTasks: Map<number, cron.ScheduledTask>;

  constructor(
    private readonly bot: BotProvider,
    private readonly usersService: UsersService,
  ) {
    this.messageHandlers = {
      [actions.START]: async (chatId: number) => {
        const user = await this.usersService.getUserByChatId(chatId);

        if (user) {
          await this.bot.sendMessage(
            chatId,
            `Ваши данные уже сохранены. Хотите изменить город или время? Используйте команду /edit.`,
          );
          return;
        }

        await this.bot.sendMessage(chatId, messages.START);

        const inlineKeyboard = sendCitySelection();

        await this.bot.sendMessage(chatId, messages.CITY_SELECTION, {
          reply_markup: inlineKeyboard,
        });
      },

      [actions.SELECT_CITY]: async (chatId: number, city: string) => {
        const user = await this.usersService.getUserByChatId(chatId);
        user
          ? await this.usersService.createUser({ chatId, city })
          : await this.usersService.updateUserCity(chatId, { city });

        await this.bot.sendMessage(
          chatId,
          `${messages.CITY_CONFIRMED} ${city}`,
        );
        const inlineKeyboard = sendTimeSelection();

        await this.bot.sendMessage(chatId, messages.TIME_SELECTION, {
          reply_markup: inlineKeyboard,
        });
      },

      [actions.SELECT_TIME]: async (chatId: number, time: string) => {
        await this.usersService.updateUserTime(chatId, { time });
        const user = await this.usersService.getUserByChatId(chatId);
        this.scheduleUserTask(chatId, time, user.city);
        await this.bot.sendMessage(
          chatId,
          `${messages.CITY_CONFIRMED} ${user.city} ${messages.TIME_CONFIRMED} ${time}`,
        );
      },

      [actions.INFO]: async (chatId: number) => {
        const user = await this.usersService.getUserByChatId(chatId);

        if (!user) {
          await this.bot.sendMessage(
            chatId,
            `Заполните сначала поля выбора города и время`,
          );
          return;
        }

        const { city, time } = user;
        await this.bot.sendMessage(
          chatId,
          `${messages.CITY_CONFIRMED} ${city} ${messages.TIME_CONFIRMED} ${time}`,
        );
      },

      [actions.EDIT]: async (chatId: number) => {
        await this.bot.sendMessage(chatId, messages.EDIT_CITY, {
          reply_markup: sendCitySelection(),
        });
      },

      default: async (chatId: number, message: string) => {
        await this.bot.sendMessage(chatId, 'Привет, чем могу помочь?');
      },
    };
    this.userTasks = new Map();
  }

  async onModuleInit() {
    await this.scheduleUserTasks();
  }

  async onModuleDestroy() {
    this.userTasks.forEach((task) => task.stop());
  }

  private async scheduleUserTasks() {
    const users = await this.usersService.getAllUsers();
    for (const user of users) {
      this.scheduleUserTask(user.chatId, user.time, user.city);
    }
  }

  private async scheduleUserTask(chatId: number, time: string, city: string) {
    if (this.userTasks.has(chatId)) {
      this.userTasks.get(chatId).stop();
    }

    const cronTime = convertTimeToCron(time);
    const task = cron.schedule(cronTime, async () => {
      const meteoData = await getMeteoData(city);
      await this.bot.sendMessage(chatId, meteoData);
    });

    this.userTasks.set(chatId, task);
  }

  async sendMessage(chatId: number, message: string) {
    const handler =
      this.messageHandlers[message] || this.messageHandlers.default;
    await handler(chatId, message);
  }

  async handleCallbackQuery(callbackQuery: any) {
    const [action] = callbackQuery.data.split(':');
    const chatId = callbackQuery.message.chat.id;

    if (action === actions.SELECT_CITY) {
      const [, city] = callbackQuery.data.split(':');
      await this.messageHandlers[actions.SELECT_CITY](chatId, city);
    }

    if (action === actions.SELECT_TIME) {
      const [, hours, minutes] = callbackQuery.data.split(':');

      await this.messageHandlers[actions.SELECT_TIME](
        chatId,
        `${hours}:${minutes}`,
      );
    }
  }
}
