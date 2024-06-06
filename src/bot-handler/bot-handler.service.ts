import { Injectable, Logger, LoggerService } from '@nestjs/common';

import { CronManager } from '../cron/cron.manager';
import { UserActions, UserState, messages } from '../users/users.constants';
import { UsersService } from '../users/users.service';
import { TUsersActions } from '../users/users.types';
import sendCitySelection from '../utils/sendCitySelection';
import sendTimeSelection from '../utils/sendTimeSelection';
import { User } from '../users/entity/users.entity';
import { BotService } from '../bot/bot.service';
import { cities } from 'src/bot/bot.constants';

@Injectable()
export class BotHandlersService {
  private readonly logger: LoggerService = new Logger(BotHandlersService.name);
  private userActions: TUsersActions;
  constructor(
    private readonly botService: BotService,
    private readonly usersService: UsersService,
    private readonly cronManager: CronManager,
  ) {}

  async onModuleInit() {
    this.userActions = {
      [UserActions.START]: async (text, user) => this.handleStart(text, user),
      [UserActions.INFO]: async (text, user) => this.handleInfo(text, user),
      [UserActions.EDIT]: async (text, user) => this.handleEdit(text, user),
      [UserActions.SELECT_CITY]: async (text, user) => this.handleSelectCity(text, user),
      [UserActions.SELECT_TIME]: async (text, user) => this.handleSelectTime(text, user),
      [UserActions.DEFAULT]: async (text, user) => this.handleDefault(text, user),
    };
  }

  async handleTextMessage(text: string, user: User): Promise<void> {
    this.logger.log('run handleTextMessage');
    return this.waitingForApproveAction(text, user);
  }

  async handleStart(text: string, { chatId }: User) {
    this.logger.log('run handleStart');
    await this.botService.sendMessage(chatId, messages.START);
    await this.botService.sendMessage(chatId, messages.CITY_SELECTION);
  }

  async waitingForApproveAction(text: string, { chatId }: User): Promise<void> {
    this.logger.log('run waitingForApproveAction');
    const message = `${messages.CITY_SELECTION}`;
    const keyboard = sendCitySelection();
    await this.botService.sendMessageAndKeyboard(chatId, message, keyboard);
    await this.usersService.createUser({ chatId, city: text });
    this.logger.log('waitingForApproveAction successfully ended');
  }

  async handleSelectCity(text: string, { chatId }: User): Promise<void> {
    await this.botService.sendMessage(chatId, `${messages.CITY_CONFIRMED} ${text}`);
  }

  async handleSelectTime(text: string, { chatId }: User): Promise<void> {
    const user = await this.usersService.getUserByChatId(chatId);
    await this.botService.sendMessage(
      chatId,
      `${messages.CITY_CONFIRMED} ${user.city} ${messages.TIME_CONFIRMED} ${text}`,
    );
  }

  async handleInfo(text: string, { chatId }: User): Promise<void> {
    const user = await this.usersService.getUserByChatId(chatId);
    if (!user) {
      await this.botService.sendMessage(chatId, messages.FILL_CITY_TIME_FIRST);
      return;
    }
    const { city, time } = user;
    await this.botService.sendMessage(chatId, `${messages.CITY_CONFIRMED} ${city} ${messages.TIME_CONFIRMED} ${time}`);
  }

  async handleEdit(text: string, { chatId }: User): Promise<void> {}

  async handleDefault(ctext: string, { chatId }: User): Promise<void> {
    await this.botService.sendMessage(chatId, messages.DEFAULT);
  }
}
