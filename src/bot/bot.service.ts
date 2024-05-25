import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { BotProvider } from './bot.provider';
import { actions, messages, cities, times } from './bot.constants';
// import { Cron } from '@nestjs/schedule';
import * as cron from 'node-cron';
// import { cronTime, cronTimezone } from 'src/utils/consts';
import getMeteoData from 'src/utils/getMeteo';
import { UsersService } from 'src/users/users.service';
import convertTimeToCron from 'src/utils/timeToCronValue';

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
        const user = await this.usersService.getUserByChatId(chatId);
        this.scheduleUserTask(chatId, time, user.city);
      },

      default: async (chatId: number, message: string) => {
        const meteoData = await getMeteoData(message);
        await this.bot.sendMessage(chatId, meteoData);
      },
    };
    // Инициализация userTasks в конструкторе
    this.userTasks = new Map();
  }

  // Реализация метода OnModuleInit
  async onModuleInit() {
    await this.scheduleUserTasks();
  }

  // Реализация метода OnModuleDestroy
  async onModuleDestroy() {
    this.userTasks.forEach((task) => task.stop());
  }

  // Метод для запуска задач для всех пользователей при инициализации модуля
  private async scheduleUserTasks() {
    const users = await this.usersService.getAllUsers();
    for (const user of users) {
      this.scheduleUserTask(user.chatId, user.time, user.city);
    }
  }

  // Метод для планирования задачи для конкретного пользователя
  private scheduleUserTask(chatId: number, time: string, city: string) {
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
