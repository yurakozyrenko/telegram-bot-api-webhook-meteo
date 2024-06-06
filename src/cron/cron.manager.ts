import * as cron from 'node-cron';

import { BotProvider } from '../bot/bot.provider';
import getMeteoData from '../utils/getMeteo';
import convertTimeToCron from '../utils/timeToCronValue';

export class CronManager {
  private userTasks: Map<number, cron.ScheduledTask>;

  constructor(private readonly bot: BotProvider) {
    this.userTasks = new Map();
  }

  scheduleUserTask(chatId: number, time: string, city: string) {
    if (this.userTasks.has(chatId)) {
      this.userTasks.get(chatId).stop();
    }

    const cronTime = convertTimeToCron(time);
    const task = cron.schedule(cronTime, async () => {
      const meteoData = await getMeteoData(city);
      await this.bot.sendMessage(chatId, meteoData);
    });

    this.userTasks.set(chatId, task);
  }

  stopAllTasks() {
    this.userTasks.forEach((task) => task.stop());
  }
}
