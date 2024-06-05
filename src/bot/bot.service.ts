import { Injectable } from '@nestjs/common';
import * as cron from 'node-cron';

import { Actions, Messages } from './bot.constants';
import { BotProvider } from './bot.provider';
import { UsersService } from '../users/users.service';
import getMeteoData from '../utils/getMeteo';
import sendCitySelection from '../utils/sendCitySelection';
import sendTimeSelection from '../utils/sendTimeSelection';
import convertTimeToCron from '../utils/timeToCronValue';

@Injectable()
export class BotService {
  private messageHandlers: Record<string, (chatId: number, message?: string) => Promise<void>>;
  private userTasks: Map<number, cron.ScheduledTask>;

  constructor(
    private readonly bot: BotProvider,
    private readonly usersService: UsersService,
  ) {
    this.messageHandlers = {
      [Actions.START]: this.handleStart.bind(this),
      [Actions.SELECT_CITY]: this.handleSelectCity.bind(this),
      [Actions.SELECT_TIME]: this.handleSelectTime.bind(this),
      [Actions.INFO]: this.handleInfo.bind(this),
      [Actions.EDIT]: this.handleEdit.bind(this),
      default: this.handleDefault.bind(this),
    };
    this.userTasks = new Map();
  }

  private async handleStart(chatId: number): Promise<void> {
    const user = await this.usersService.getUserByChatId(chatId);

    if (user) {
      await this.bot.sendMessage(
        chatId,
        `Ваши данные уже сохранены. Хотите изменить город или время? Используйте команду /edit.`,
      );
      return;
    }

    await this.bot.sendMessage(chatId, Messages.START);

    const inlineKeyboard = sendCitySelection();

    await this.bot.sendMessage(chatId, Messages.CITY_SELECTION, {
      reply_markup: inlineKeyboard,
    });
  }

  private async handleSelectCity(chatId: number, city: string): Promise<void> {
    const user = await this.usersService.getUserByChatId(chatId);
    if (!user) {
      await this.usersService.createUser({ chatId, city });
    } else {
      await this.usersService.updateUserCity(chatId, { city });
    }

    await this.bot.sendMessage(chatId, `${Messages.CITY_CONFIRMED} ${city}`);
    const inlineKeyboard = sendTimeSelection();

    await this.bot.sendMessage(chatId, Messages.TIME_SELECTION, {
      reply_markup: inlineKeyboard,
    });
  }

  private async handleSelectTime(chatId: number, time: string): Promise<void> {
    await this.usersService.updateUserTime(chatId, { time });
    const user = await this.usersService.getUserByChatId(chatId);
    this.scheduleUserTask(chatId, time, user.city);
    await this.bot.sendMessage(chatId, `${Messages.CITY_CONFIRMED} ${user.city} ${Messages.TIME_CONFIRMED} ${time}`);
  }

  private async handleInfo(chatId: number): Promise<void> {
    const user = await this.usersService.getUserByChatId(chatId);

    if (!user) {
      await this.bot.sendMessage(chatId, `Заполните сначала поля выбора города и время`);
      return;
    }

    const { city, time } = user;
    await this.bot.sendMessage(chatId, `${Messages.CITY_CONFIRMED} ${city} ${Messages.TIME_CONFIRMED} ${time}`);
  }

  private async handleEdit(chatId: number): Promise<void> {
    await this.bot.sendMessage(chatId, Messages.EDIT_CITY, {
      reply_markup: sendCitySelection(),
    });
  }

  private async handleDefault(chatId: number, city: string): Promise<void> {
    const result = await getMeteoData(city);
    await this.bot.sendMessage(chatId, result);
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
    const handler = this.messageHandlers[message] || this.messageHandlers.default;
    await handler(chatId, message);
  }

  async handleCallbackQuery(callbackQuery: any) {
    const [action] = callbackQuery.data.split(':');
    const chatId = callbackQuery.message.chat.id;

    if (action === Actions.SELECT_CITY) {
      const [, city] = callbackQuery.data.split(':');
      await this.messageHandlers[Actions.SELECT_CITY](chatId, city);
    }

    if (action === Actions.SELECT_TIME) {
      const [, hours, minutes] = callbackQuery.data.split(':');
      await this.messageHandlers[Actions.SELECT_TIME](chatId, `${hours}:${minutes}`);
    }
  }
}
