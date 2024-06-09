import { Injectable, Logger, LoggerService } from '@nestjs/common';

import { BotService } from '../bot/bot.service';
import { CronService } from '../cron/cron.service';
import { User } from '../users/entity/users.entity';
import { Cities, Times, UserActions, messages } from '../users/users.constants';
import { UsersService } from '../users/users.service';
import { TUsersActions } from '../users/users.types';
import delay from '../utils/delay';

@Injectable()
export class BotHandlersService {
  private readonly logger: LoggerService = new Logger(BotHandlersService.name);
  private userActions: TUsersActions;
  constructor(
    private readonly botService: BotService,
    private readonly usersService: UsersService,
    private readonly cronService: CronService,
  ) {}

  async onModuleInit() {
    this.userActions = {
      [UserActions.START]: async (text, user) => this.handleStart(text, user), //старт
      [UserActions.WEATHER]: async (text, user) => this.handleEditCity(text, user), //получить погоду
    };
  }

  async handleTextMessage(text: string, user: User): Promise<void> {
    this.logger.log('run handleTextMessage');

    const actionHandler = this.userActions[text as UserActions];

    const cities = Object.values(Cities) as string[];
    const times = Object.values(Times) as string[];

    if (cities.includes(text)) {
      return this.handleConfirmCity(text, user);
    }

    if (times.includes(text)) {
      return this.handleConfirmTime(text, user);
    }

    if (!actionHandler) {
      return this.handleDefault(text, user.chatId);
    }
    return actionHandler(text, user);
  }

  async handleStart(text: string, { chatId }: User) {
    this.logger.log('run handleStart');

    await this.botService.sendMessage(chatId, messages.START);
    await delay();
    const message = `${messages.MENU_SELECTION}`;
    const keyboard = [[{ text: `${messages.MENU_WEATHER}` }]];
    await this.botService.sendMessageAndKeyboard(chatId, message, keyboard);
  }

  async handleEditCity(text: string, { chatId }: User): Promise<void> {
    this.logger.log('run EditCity');

    const message = `${messages.CITY_SELECTION}`;

    const cities = Object.values(Cities) as string[];
    const cityButtons = cities.map((city) => [{ text: city }]);
    const keyboard = [...cityButtons];

    await this.botService.sendMessageAndKeyboard(chatId, message, keyboard);
  }

  async handleConfirmCity(text: string, user: User): Promise<void> {
    this.logger.log('run ConfirmCity');

    const { chatId } = user;
    await this.usersService.updateUserCity(chatId, { city: text });
    await this.handleEditTime(text, user);

    this.logger.log('ConfirmCity successfully ended');
  }

  async handleEditTime(text: string, user: User): Promise<void> {
    this.logger.log('run EditTime');

    const { chatId } = user;
    const message = `${messages.TIME_SELECTION}`;
    const times = Object.values(Times) as string[];
    const timeButtons = times.map((time) => [{ text: time }]);
    const keyboard = [...timeButtons];
    await this.botService.sendMessageAndKeyboard(chatId, message, keyboard);
  }

  async handleConfirmTime(text: string, { chatId }: User): Promise<void> {
    this.logger.log('run ConfirmTime');

    await this.cronService.createCronJob({ chatId, time: text });
    await this.handleConfirmCityTime(chatId);

    this.logger.log('ConfirmTime successfully ended');
  }

  async handleConfirmCityTime(chatId: number): Promise<void> {
    await this.botService.sendMessage(chatId, `${messages.ALREADY_SAVED}`);
  }

  async handleDefault(text: string, chatId: number): Promise<void> {
    await this.botService.sendMessage(chatId, messages.DEFAULT);
  }
}
