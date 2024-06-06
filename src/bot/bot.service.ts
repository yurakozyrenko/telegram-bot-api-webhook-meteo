import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { Actions } from './bot.constants';
import { BotHandlers } from './bot.handlers';
import { BotProvider } from './bot.provider';
import { CronManager } from './cron.manager';
import { UsersService } from '../users/users.service';

@Injectable()
export class BotService implements OnModuleInit, OnModuleDestroy {
  private handlers: BotHandlers;
  private cronManager: CronManager;
  private messageHandlers: Record<string, (chatId: number, message?: string) => Promise<void>>;

  constructor(
    private readonly bot: BotProvider,
    private readonly usersService: UsersService,
  ) {
    this.cronManager = new CronManager(bot);
    this.handlers = new BotHandlers(bot, usersService, this.cronManager);

    this.messageHandlers = {
      [Actions.START]: this.handlers.handleStart.bind(this.handlers),
      [Actions.SELECT_CITY]: this.handlers.handleSelectCity.bind(this.handlers),
      [Actions.SELECT_TIME]: this.handlers.handleSelectTime.bind(this.handlers),
      [Actions.INFO]: this.handlers.handleInfo.bind(this.handlers),
      [Actions.EDIT]: this.handlers.handleEdit.bind(this.handlers),
      default: this.handlers.handleDefault.bind(this.handlers),
    };
  }

  async onModuleInit() {
    const users = await this.usersService.getAllUsers();
    users.forEach((user) => this.cronManager.scheduleUserTask(user.chatId, user.time, user.city));
  }

  async onModuleDestroy() {
    this.cronManager.stopAllTasks();
  }

  async sendMessage(chatId: number, message: string) {
    const handler = this.messageHandlers[message] || this.messageHandlers.default;
    await handler(chatId, message);
  }

  async handleCallbackQuery(callbackQuery: any) {
    const [action, ...data] = callbackQuery.data.split(':');
    const chatId = callbackQuery.message.chat.id;

    if (action === Actions.SELECT_CITY) {
      await this.handlers.handleSelectCity(chatId, data[0]);
    }

    if (action === Actions.SELECT_TIME) {
      const [hours, minutes] = data;
      await this.handlers.handleSelectTime(chatId, `${hours}:${minutes}`);
    }
  }
}
