import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { Message, Update } from 'node-telegram-bot-api';
import { BotService } from 'src/bot/bot.service';

@Injectable()
export class UpdatesService {
  private readonly logger: LoggerService = new Logger(UpdatesService.name);

  constructor(private readonly botService: BotService) {}

  async handleUpdate({ message }: Update) {
    const { from } = message;
    const { id: chatId } = from;
    const chatType = message.chat.type;
    if (chatType === 'private') return this.handleMessage(chatId, message);
  }

  async handleMessage(chatId: number, message: Message) {
    const { text } = message;
    this.logger.log(`Update message: ${JSON.stringify(message)}`);
    await this.botService.sendMessage(chatId, text);
  }
}
