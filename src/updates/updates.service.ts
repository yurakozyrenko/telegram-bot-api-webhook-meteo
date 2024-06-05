import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { Message, Update } from 'node-telegram-bot-api';

import { BotService } from '../bot/bot.service';

@Injectable()
export class UpdatesService {
  private readonly logger: LoggerService = new Logger(UpdatesService.name);

  constructor(private readonly botService: BotService) {}

  async handleUpdate(update: Update) {
    if (update.message) {
      const { from } = update.message;
      const { id: chatId } = from;
      const chatType = update.message.chat.type;

      if (chatType === 'private') this.logger.log(`Handling private message from chatId: ${chatId}`);
      return await this.handleMessage(chatId, update.message);
    }

    if (update.callback_query) {
      this.logger.log(`Handling callback query from chatId: ${update.callback_query.from.id}`);
      await this.botService.handleCallbackQuery(update.callback_query);
    }
  }

  async handleMessage(chatId: number, message: Message) {
    const { text } = message;
    this.logger.log(`Update message: ${JSON.stringify(message)}`);
    await this.botService.sendMessage(chatId, text);
  }
}
