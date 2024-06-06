import { Injectable, Logger, LoggerService } from '@nestjs/common';

import { BotService } from '../bot/bot.service';
import { CronManager } from '../cron/cron.manager';
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
    private readonly cronManager: CronManager,
  ) {}

  async onModuleInit() {
    this.userActions = {
      [UserActions.START]: async (text, user) => this.handleStart(text, user),
      [UserActions.INFO]: async (text, user) => this.handleInfo(text, user),
      [UserActions.EDIT_TIME]: async (text, user) => this.handleEditTime(text, user),
      [UserActions.EDIT_CITY]: async (text, user) => this.handleEditCity(text, user),
      [UserActions.SELECT_CITY]: async (text, user) => this.handleSelectCity(text, user),
      [UserActions.SELECT_TIME]: async (text, user) => this.handleSelectTime(text, user),
    };
  }

  async handleTextMessage(text: string, user: User): Promise<void> {
    this.logger.log('run handleTextMessage');

    const { userState } = user;

    console.log(text, user);

    if (userState === UserState.WAITING_FOR_APPROVE_CITY) {
      return this.waitingForApproveActionCity(text, user);
    }

    if (userState === UserState.WAITING_FOR_APPROVE_TIME) {
      return this.waitingForApproveActionTime(text, user);
    }

    const actionHandler = this.userActions[text as UserActions];

    if (!actionHandler) {
      return;
    }
    return actionHandler(text, user);
  }

  async handleStart(text: string, { chatId }: User) {
    this.logger.log('run handleStart');
    await this.botService.sendMessage(chatId, messages.START);
    await this.usersService.updateUserState(chatId, { userState: UserState.START });
    console.log('hello');
  }

  async waitingForApproveActionCity(text: string, { chatId }: User): Promise<void> {
    this.logger.log('run waitingForApproveActionCity');
    await this.usersService.updateUserCity(chatId, { city: text, userState: UserState.START });
    await this.botService.sendMessage(chatId, `${messages.CITY_CONFIRMED} ${text}`);
    this.logger.log('waitingForApproveActionCity successfully ended');
  }

  async waitingForApproveActionTime(text: string, { chatId }: User): Promise<void> {
    this.logger.log('run waitingForApproveActionTime');
    await this.usersService.updateUserTime(chatId, { time: text, userState: UserState.START });
    await this.botService.sendMessage(chatId, `${messages.TIME_CONFIRMED} ${text}`);
    this.logger.log('waitingForApproveActionTime successfully ended');
  }

  async handleSelectCity(text: string, { chatId }: User): Promise<void> {
    console.log(text);
    await this.botService.sendMessage(chatId, `${messages.CITY_CONFIRMED} ${text}`);
    await this.usersService.updateUserState(chatId, { userState: UserState.WAITING_FOR_APPROVE_CITY });
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

  async handleEditCity(text: string, { chatId }: User): Promise<void> {
    console.log('edit');
    this.logger.log('run waitingForApproveActionCity');
    await this.botService.sendMessage(chatId, messages.CITY_SELECTION);
    await this.usersService.updateUserState(chatId, { userState: UserState.WAITING_FOR_APPROVE_CITY });
    this.logger.log('waitingForApproveActionCity successfully ended');
  }

  async handleEditTime(text: string, { chatId }: User): Promise<void> {
    console.log('edit');
    this.logger.log('run waitingForApproveActionTime');
    await this.botService.sendMessage(chatId, messages.TIME_SELECTION);
    await this.usersService.updateUserState(chatId, { userState: UserState.WAITING_FOR_APPROVE_TIME });
    this.logger.log('waitingForApproveActionTime successfully ended');
  }

  async handleDefault(text: string, { chatId }: User): Promise<void> {
    await this.botService.sendMessage(chatId, messages.DEFAULT);
  }
}
