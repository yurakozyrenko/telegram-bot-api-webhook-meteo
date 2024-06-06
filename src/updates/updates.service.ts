import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { Message, Update } from 'node-telegram-bot-api';
import { UsersService } from 'src/users/users.service';
import { BotHandlersService } from '../bot-handler/bot-handler.service';
import { User } from '../users/entity/users.entity';

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
    const user = await this.userService.getUserByChatId(chatId);
    if (user && chatType === 'private') this.logger.log(`Handling private message from chatId: ${chatId}`);
    return await this.handleMessage(message, user);
  }

  async handleMessage(message: Message, user: User) {
    const { text } = message;

    console.log(text);

    this.logger.log(`Update message: ${JSON.stringify(message)}`);
    await this.botHandlersService.handleTextMessage(text, user);
  }
}
