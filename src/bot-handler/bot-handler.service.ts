import { Injectable, Logger, LoggerService } from '@nestjs/common';

import { BotService } from '../bot/bot.service';
import { CronService } from '../cron/cron.service';
import { User } from '../users/entity/users.entity';
import { UserActions, UserState, messages } from '../users/users.constants';
import { UsersService } from '../users/users.service';
import { TUsersActions } from '../users/users.types';

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
      [UserActions.START]: async (text, user) => this.handleStart(text, user),
      [UserActions.INFO]: async (text, user) => this.handleInfo(text, user),
      [UserActions.EDIT_TIME]: async (text, user) => this.handleEditTime(text, user),
      [UserActions.EDIT_CITY]: async (text, user) => this.handleEditCity(text, user),
    };
  }

  async handleTextMessage(text: string, user: User): Promise<void> {
    this.logger.log('run handleTextMessage');

    const { userState } = user;

    if (userState === UserState.WAITING_FOR_APPROVE_CITY) {
      return this.waitingForApproveActionCity(text, user);
    }

    if (userState === UserState.WAITING_FOR_APPROVE_TIME) {
      return this.waitingForApproveActionTime(text, user);
    }

    const actionHandler = this.userActions[text as UserActions];

    if (!actionHandler) {
      return this.handleDefault(text, user.chatId);
    }
    return actionHandler(text, user);
  }

  async handleStart(text: string, { chatId }: User) {
    this.logger.log('run handleStart');
    await this.botService.sendMessage(chatId, messages.START);
    await this.handleCityAndTimeConfirmation(chatId);
    await this.usersService.updateUserState(chatId, { userState: UserState.START });
  }

  async waitingForApproveActionCity(text: string, { chatId }: User): Promise<void> {
    this.logger.log('run waitingForApproveActionCity');
    await this.usersService.updateUserCity(chatId, { city: text, userState: UserState.START });
    await this.botService.sendMessage(chatId, `${messages.CITY_CONFIRMED} ${text}`);
    await this.handleCityAndTimeConfirmation(chatId);
    this.logger.log('waitingForApproveActionCity successfully ended');
  }

  async waitingForApproveActionTime(text: string, { chatId }: User): Promise<void> {
    this.logger.log('run waitingForApproveActionTime');
    await this.usersService.updateUserTime(chatId, { time: text, userState: UserState.START });
    await this.cronService.createCronJob({ chatId, time: text });
    await this.botService.sendMessage(chatId, `${messages.TIME_CONFIRMED} ${text}`);
    await this.handleCityAndTimeConfirmation(chatId);
    this.logger.log('waitingForApproveActionTime successfully ended');
  }

  async handleInfo(text: string, { chatId }: User): Promise<void> {
    await this.handleCityAndTimeConfirmation(chatId);
  }

  async handleEditCity(text: string, { chatId }: User): Promise<void> {
    this.logger.log('run waitingForApproveActionCity');
    await this.botService.sendMessage(chatId, messages.CITY_SELECTION);
    await this.usersService.updateUserState(chatId, { userState: UserState.WAITING_FOR_APPROVE_CITY });
    this.logger.log('waitingForApproveActionCity successfully ended');
  }

  async handleEditTime(text: string, { chatId }: User): Promise<void> {
    this.logger.log('run waitingForApproveActionTime');
    await this.botService.sendMessage(chatId, messages.TIME_SELECTION);
    await this.usersService.updateUserState(chatId, { userState: UserState.WAITING_FOR_APPROVE_TIME });
    this.logger.log('waitingForApproveActionTime successfully ended');
  }

  async handleDefault(text: string, chatId: number): Promise<void> {
    await this.botService.sendMessage(chatId, messages.DEFAULT);
  }

  async handleCityAndTimeConfirmation(chatId: number): Promise<void> {
    const { city, time } = await this.usersService.getUserByChatId(chatId);
    if (!city) {
      await this.botService.sendMessage(chatId, messages.FILL_CITY_FIRST);
      return;
    }
    if (!time) {
      await this.botService.sendMessage(chatId, messages.FILL_TIME_FIRST);
      return;
    }
    await this.botService.sendMessage(chatId, `${messages.CITY_CONFIRMED} ${city}, ${messages.TIME_CONFIRMED} ${time}`);
  }
}
