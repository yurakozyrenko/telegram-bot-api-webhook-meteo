import { Body, Controller, Post } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';

import { UpdatesService } from './updates.service';

@Controller('updates')
export class UpdatesController {
  constructor(private readonly updatesService: UpdatesService) {}

  @Post()
  handle(@Body() update: TelegramBot.Update) {
    return this.updatesService.handleUpdate(update);
  }
}
