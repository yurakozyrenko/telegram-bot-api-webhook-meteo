import { Messages } from './bot.constants';
import { BotProvider } from './bot.provider';
import { CronManager } from './cron.manager';
import { UsersService } from '../users/users.service';
import sendCitySelection from '../utils/sendCitySelection';
import sendTimeSelection from '../utils/sendTimeSelection';

export class BotHandlers {
  constructor(
    private readonly bot: BotProvider,
    private readonly usersService: UsersService,
    private readonly cronManager: CronManager,
  ) {}

  async handleStart(chatId: number): Promise<void> {
    const user = await this.usersService.getUserByChatId(chatId);

    if (user) {
      await this.bot.sendMessage(
        chatId,
        `Ваши данные уже сохранены. Хотите изменить город или время? Используйте команду /edit.`,
      );
      return;
    }

    await this.bot.sendMessage(chatId, Messages.START);
    const inlineKeyboard = sendCitySelection();
    await this.bot.sendMessage(chatId, Messages.CITY_SELECTION, { reply_markup: inlineKeyboard });
  }

  async handleSelectCity(chatId: number, city: string): Promise<void> {
    const user = await this.usersService.getUserByChatId(chatId);
    if (!user) {
      await this.usersService.createUser({ chatId, city });
    } else {
      await this.usersService.updateUserCity(chatId, { city });
    }

    await this.bot.sendMessage(chatId, `${Messages.CITY_CONFIRMED} ${city}`);
    const inlineKeyboard = sendTimeSelection();
    await this.bot.sendMessage(chatId, Messages.TIME_SELECTION, { reply_markup: inlineKeyboard });
  }

  async handleSelectTime(chatId: number, time: string): Promise<void> {
    await this.usersService.updateUserTime(chatId, { time });
    const user = await this.usersService.getUserByChatId(chatId);
    this.cronManager.scheduleUserTask(chatId, time, user.city);
    await this.bot.sendMessage(chatId, `${Messages.CITY_CONFIRMED} ${user.city} ${Messages.TIME_CONFIRMED} ${time}`);
  }

  async handleInfo(chatId: number): Promise<void> {
    const user = await this.usersService.getUserByChatId(chatId);
    if (!user) {
      await this.bot.sendMessage(chatId, 'Заполните сначала поля выбора города и время');
      return;
    }
    const { city, time } = user;
    await this.bot.sendMessage(chatId, `${Messages.CITY_CONFIRMED} ${city} ${Messages.TIME_CONFIRMED} ${time}`);
  }

  async handleEdit(chatId: number): Promise<void> {
    await this.bot.sendMessage(chatId, Messages.EDIT_CITY, { reply_markup: sendCitySelection() });
  }

  async handleDefault(chatId: number): Promise<void> {
    await this.bot.sendMessage(chatId, 'Привет, я умею отправлять погоду');
  }
}
