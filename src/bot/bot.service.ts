import { Injectable } from '@nestjs/common';
import { KeyboardButton } from 'node-telegram-bot-api';

import { BotProvider } from './bot.provider';
import { UsersService } from '../users/users.service';

@Injectable()
export class BotService {
  constructor(
    private readonly bot: BotProvider,
    private readonly usersService: UsersService,
  ) {}

  async sendMessage(chatId: number, message: string) {
    await this.bot.sendMessage(chatId, message);
  }

  async sendMessageAndKeyboard(chatId: number, text: string, keyboard: KeyboardButton[][]) {
    await this.bot.sendMessageAndKeyboard(chatId, text, keyboard);
  }
}
