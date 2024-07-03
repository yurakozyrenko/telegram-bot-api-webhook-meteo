import { Injectable, Logger, LoggerService } from '@nestjs/common';

import { BotService } from '../bot/bot.service';
import { CronService } from '../cron/cron.service';
import { User } from '../users/entity/users.entity';
import { UserActions, UserState, messages } from '../users/users.constants';
import { UsersService } from '../users/users.service';
import { TUsersActions } from '../users/users.types';
import delay from '../utils/delay';
import generateCities from '../utils/generateCities';
import generateTime from '../utils/generateTimes';
import getMeteoData from 'src/utils/getMeteo';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BotHandlersService {
  private readonly logger: LoggerService = new Logger(BotHandlersService.name);
  private userActions: TUsersActions;
  private readonly apiKey: string;

  constructor(
    private readonly botService: BotService,
    private readonly usersService: UsersService,
    private readonly cronService: CronService,
    private configService: ConfigService,
  ) {
    this.apiKey = this.configService.get('API_KEY');
  }

  async onModuleInit() {
    this.userActions = {
      [UserActions.START]: async (text, user) => this.handleStart(text, user), //старт
      [UserActions.WEATHER]: async (text, user) => this.handleEditCity(text, user), //получить погоду
      [UserActions.SETTINGS]: async (text, user) => this.handleEditCity(text, user), //настройки
      [UserActions.WEATHER_NOW]: async (text, user) => this.handleWeatherNow(text, user), //получить погоду сейчас
      [UserActions.SETTINGS_NOW]: async (text, user) => this.handleEditCity(text, user), // settings
      [UserActions.CANSEL]: async (text, user) => this.handleCansel(text, user), //отписаться
    };
  }

  async handleTextMessage(text: string, user: User): Promise<void> {
    this.logger.log('run handleTextMessage');

    const { userState } = user;

    if (userState === UserState.CITY) {
      return this.handleConfirmCity(text, user);
    }

    if (userState === UserState.TIME) {
      return this.handleConfirmTime(text, user);
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
    await this.usersService.updateUser(chatId, { userState: UserState.START });
    await delay();
    const message = `${messages.MENU_SELECTION}`;
    const keyboard = [
      [{ text: `${messages.MENU_WEATHER}` }],
      [{ text: `${messages.MENU_SETTINGS}` }],
      [{ text: `${messages.MENU_CANSEL}` }],
    ];
    await this.botService.sendMessageAndKeyboard(chatId, message, keyboard);
  }

  async handleEditCity(text: string, { chatId }: User): Promise<void> {
    this.logger.log('run EditCity');

    const message = `${messages.CITY_SELECTION}`;
    const keyboard = generateCities();
    await this.botService.sendMessageAndKeyboard(chatId, message, keyboard);
    await this.usersService.updateUser(chatId, { userState: UserState.CITY });
  }

  async handleConfirmCity(text: string, user: User): Promise<void> {
    this.logger.log('run ConfirmCity');

    const { chatId } = user;
    await this.usersService.updateUserCity(chatId, { city: text });
    this.logger.log('ConfirmCity successfully ended');

    await this.handleEditTime(text, user);
  }

  async handleEditTime(text: string, user: User): Promise<void> {
    this.logger.log('run EditTime');

    const { chatId } = user;
    const message = `${messages.TIME_SELECTION}`;

    const keyboard = generateTime();

    await this.botService.sendMessageAndKeyboard(chatId, message, keyboard);
    await this.usersService.updateUser(chatId, { userState: UserState.TIME });
  }

  async handleConfirmTime(text: string, { chatId }: User): Promise<void> {
    this.logger.log('run ConfirmTime');

    await this.cronService.createCronJob({ chatId, time: text });

    await this.botService.sendMessage(chatId, `${messages.ALREADY_SAVED}`);

    await this.usersService.updateUser(chatId, { userState: UserState.START });

    this.logger.log('ConfirmTime successfully ended');
  }

  async handleWeatherNow(text: string, user: User): Promise<void> {
    this.logger.log('run get WeatherNow');

    const { city, chatId } = user;

    const cityName = encodeURIComponent(city);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&&units=metric&&appid=${this.apiKey}`;

    const meteoData = await getMeteoData(city, url);

    await this.botService.sendMessage(chatId, meteoData);

    this.logger.log('WeatherNow successfully ended');
  }

  async handleSettings(text: string, user: User): Promise<void> {
    this.logger.log('run Settings ');

    const { city, chatId } = user;

    await this.botService.sendMessage(chatId, `${city}`);

    this.logger.log('Settings successfully ended');
  }

  async handleCansel(text: string, { chatId }: User): Promise<void> {
    this.logger.log('run Cansel ');

    try {
      await this.cronService.deleteCronJob(chatId);
    } catch (e) {}

    await this.botService.sendMessage(chatId, `${messages.MENU_CANSEL}`);

    this.logger.log('Cansel successfully ended');
  }

  async handleDefault(text: string, chatId: number): Promise<void> {
    this.logger.log('run Default ');

    await this.botService.sendMessage(chatId, messages.DEFAULT);

    this.logger.log('Default successfully ended');
  }
}
