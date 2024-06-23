import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, LoggerService, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';
import { firstValueFrom } from 'rxjs';

import { ParseModes } from './bot.constants';

@Injectable()
export class BotProvider implements OnModuleInit {
  private readonly bot: TelegramBot;
  private readonly logger: LoggerService = new Logger(BotProvider.name);
  private readonly botToken: string;
  private readonly allowedBotUpdates: string[] = ['message'];
  private readonly telegramBotApiUrl = 'https://api.telegram.org/bot';

  constructor(
    private configService: ConfigService,
    private readonly httpClient: HttpService,
  ) {
    this.botToken = this.configService.get('TELEGRAM_BOT_TOKEN');
    this.bot = new TelegramBot(this.botToken, { polling: false });
    this.bot.setMyCommands([
      { command: 'start', description: 'Запустить бота' },
      { command: 'weather', description: 'получить погоду' },
      { command: 'cansel', description: 'отписпться от уведомлений' },
    ]);
  }

  async sendMessage(chatId: number, message: string) {
    await this.bot.sendMessage(chatId, message);
  }

  async sendMessageAndKeyboard(chatId: number, text: string, keyboard: TelegramBot.KeyboardButton[][]) {
    try {
      await this.bot.sendMessage(chatId, text, {
        reply_markup: {
          keyboard,
          one_time_keyboard: true,
          resize_keyboard: true,
        },
        parse_mode: ParseModes.HTML,
      });
    } catch (error) {
      this.logger.error(`Send message with keyboard to id - ${chatId} : ${error}`);
    }
  }

  async onModuleInit() {
    const webHookUrl = this.getWebHookUrl();

    await this.setWebHook(webHookUrl);

    const webHookInfo = await this.getWebHoolInfo();
    const isWebHookValid = await this.validateWebHook(webHookInfo, webHookUrl);

    if (!isWebHookValid) {
      throw new Error(`Webhook url is not set correctly for bot: ${JSON.stringify(webHookInfo)}`);
    }

    this.logger.log('Webhook url is set correctly for bot');
  }

  private async setWebHook(webHookUrl: string): Promise<boolean> {
    this.logger.debug('Start setting webhook for bot');

    const setWebhookParams = {
      url: webHookUrl,
      allowed_updates: this.allowedBotUpdates,
    };

    const { data: setResult } = await firstValueFrom(
      this.httpClient.post(`${this.telegramBotApiUrl}${this.botToken}/setWebhook`, setWebhookParams),
    );
    this.logger.debug(setResult);

    return setResult.result;
  }

  private async getWebHoolInfo() {
    const {
      data: { result: webHookInfo },
    } = await firstValueFrom(this.httpClient.get(`${this.telegramBotApiUrl}${this.botToken}/getWebhookInfo`));
    this.logger.debug(webHookInfo);

    return webHookInfo;
  }

  private validateWebHook(webHookInfo: TelegramBot.SetWebHookOptions, webHookUrl: string): boolean {
    return Boolean(
      webHookInfo.url === webHookUrl ||
        webHookInfo.allowed_updates.sort().toString() === this.allowedBotUpdates.sort().toString(),
    );
  }

  private getWebHookUrl() {
    const host = this.configService.get('WEBHOOK_HOST');
    const apiPrefix = this.configService.get('API_PREFIX');
    const apiVersion = this.configService.get('API_VERSION');
    const path = `${apiPrefix}${apiVersion}/updates`;
    return `${host}${path}`;
  }
}
