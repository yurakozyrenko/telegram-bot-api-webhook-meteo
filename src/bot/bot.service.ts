import { Injectable } from '@nestjs/common';
import { KeyboardButton } from 'node-telegram-bot-api';

import { BotProvider } from './bot.provider';

@Injectable()
export class BotService {
  constructor(private readonly bot: BotProvider) {}

  async sendMessage(chatId: number, message: string) {
    await this.bot.sendMessage(chatId, message);
  }

  async sendMessageAndKeyboard(chatId: number, text: string, keyboard: KeyboardButton[][]) {
    await this.bot.sendMessageAndKeyboard(chatId, text, keyboard);
  }
}
