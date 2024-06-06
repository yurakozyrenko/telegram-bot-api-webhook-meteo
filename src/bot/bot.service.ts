import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { UserActions } from '../users/users.constants';
import { BotProvider } from './bot.provider';
import { BotHandlersService } from '../bot-handler/bot-handler.service';
import { CronManager } from '../cron/cron.manager';
import { UsersService } from '../users/users.service';
import { ChatMember, KeyboardButton } from 'node-telegram-bot-api';

@Injectable()
export class BotService /*implements OnModuleInit, OnModuleDestroy */ {
  // private handlers: BotHandlersService;
  // private cronManager: CronManager;
  // private messageHandlers: Record<string, (chatId: number, message?: string) => Promise<void>>;

  constructor(
    private readonly bot: BotProvider,
    private readonly usersService: UsersService,
  ) {
    // this.cronManager = new CronManager(bot);
    // this.handlers = new BotHandlersService(bot, usersService, this.cronManager);
    // this.messageHandlers = {
    //   [UserActions.START]: this.handlers.handleStart.bind(this.handlers),
    //   [UserActions.SELECT_CITY]: this.handlers.handleSelectCity.bind(this.handlers),
    //   [UserActions.SELECT_TIME]: this.handlers.handleSelectTime.bind(this.handlers),
    //   [UserActions.INFO]: this.handlers.handleInfo.bind(this.handlers),
    //   [UserActions.EDIT]: this.handlers.handleEdit.bind(this.handlers),
    //   default: this.handlers.handleDefault.bind(this.handlers),
    // };
  }

  // async onModuleInit() {
  //   const users = await this.usersService.getAllUsers();
  //   users.forEach((user) => this.cronManager.scheduleUserTask(user.chatId, user.time, user.city));
  // }

  // async onModuleDestroy() {
  //   this.cronManager.stopAllTasks();
  // }

  async sendMessage(chatId: number, message: string) {
    await this.bot.sendMessage(chatId, message);

    // const handler = this.messageHandlers[message] || this.messageHandlers.default;
    // await handler(chatId, message);
  }

  async sendMessageAndKeyboard(chatId: number, text: string, keyboard: KeyboardButton[][]) {
    const city = await this.bot.sendMessageAndKeyboard(chatId, text, keyboard);
    return city;
  }

  // async handleCallbackQuery(callbackQuery: any) {
  //   const [action, ...data] = callbackQuery.data.split(':');
  //   const chatId = callbackQuery.message.chat.id;

  //   if (action === UserActions.SELECT_CITY) {
  //     await this.handlers.handleSelectCity(chatId, data[0]);
  //   }

  //   if (action === UserActions.SELECT_TIME) {
  //     const [hours, minutes] = data;
  //     await this.handlers.handleSelectTime(chatId, `${hours}:${minutes}`);
  //   }
  // }
}
