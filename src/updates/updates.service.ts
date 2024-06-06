import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { Message, Update } from 'node-telegram-bot-api';

import { BotHandlersService } from '../bot-handler/bot-handler.service';
import { User } from '../users/entity/users.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class UpdatesService {
  private readonly logger: LoggerService = new Logger(UpdatesService.name);

  constructor(
    private readonly userService: UsersService,
    private readonly botHandlersService: BotHandlersService,
  ) {}

  async handleUpdate({ message }: Update) {
    const { from } = message;
    const { id: chatId } = from;
    const chatType = message.chat.type;
    const user = await this.userService.findOneByChatId(chatId);
    if (user && chatType === 'private') {
      this.logger.log(`Handling private message from chatId: ${chatId}`);
      await this.handleMessage(message, user);
    }
  }

  async handleMessage(message: Message, user: User) {
    const { text } = message;
    this.logger.log(`Update message: ${JSON.stringify(message)}`);
    await this.botHandlersService.handleTextMessage(text, user);
  }
}
