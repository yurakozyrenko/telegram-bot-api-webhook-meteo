import { HttpException, HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

import { CronRepository } from './cron.repository';
import { CreateCronJobDto } from './dto/createCronJob.dto';
import { UpdateCronJobDto } from './dto/updateCronJob.dto';
import { CronEntity } from './entity/cron.entity';
import { BotService } from '../bot/bot.service';
import { UsersService } from '../users/users.service';
import { cronTimezone } from '../utils/consts';
import getMeteoData from '../utils/getMeteo';
import timeToCronValue from '../utils/timeToCronValue';

@Injectable()
export class CronService implements OnModuleInit {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly botService: BotService,
    private readonly userService: UsersService,
    private readonly cronRepository: CronRepository,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async addCronJob(chatId: CronEntity['chatId'], time: CronEntity['time']) {
    this.logger.log(`trying to add cron job with time: ${time} andchatId: ${chatId}`);
    time = timeToCronValue(time);
    const { city } = await this.userService.findOneByChatId(chatId);
    const meteoData = await getMeteoData(city);
    const job = new CronJob(time, () => this.botService.sendMessage(chatId, meteoData), null, true, cronTimezone);
    this.schedulerRegistry.addCronJob(chatId.toString(), job);
    this.logger.log(`Cron job scheduled with cronTime: ${time} and chatId: ${chatId}`);
  }

  stopCronJob(chatId: string) {
    this.logger.log(`trying to stop cron job with chatId ${chatId}`);
    this.schedulerRegistry.deleteCronJob(chatId);
    this.logger.log(`Active cron job with chatId ${chatId} stopped`);
  }

  stopAllCronJobs() {
    this.logger.log('trying to stop all cron jobs');
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((job: CronJob) => {
      job.stop();
    });
    this.logger.log('All active cron jobs stopped');
  }

  async getCronJobs(): Promise<CronEntity[]> {
    this.logger.log('trying to get all cron jobs');

    const [cronJobs, count] = await this.cronRepository.getCronJobs();

    this.logger.log(`${count} cron jobs successfully get`);

    return cronJobs;
  }

  async deleteCronJob(chatId: CronEntity['chatId']) {
    this.logger.log(`trying to delete cron job with chatId: ${chatId}`);

    const cronJobById = await this.cronRepository.getCronJobByChatId(chatId);

    if (!cronJobById) {
      this.logger.error(`CronJob with chatId: ${chatId} not exist`);
      throw new HttpException(`CronJob with chatId: ${chatId} not exist`, HttpStatus.BAD_REQUEST);
    }

    const { affected } = await this.cronRepository.deleteCronJob(chatId);

    this.stopCronJob(cronJobById.chatId.toString());
    this.logger.log(`${affected} cron jobs successfully deleted with chatId: ${chatId}`);
  }

  async createCronJob(createCronJobDto: CreateCronJobDto) {
    const { chatId, time } = createCronJobDto;

    this.logger.log(`trying to create cron job with time: ${time} and chatId: ${chatId}`);

    const cronJobByChatId = await this.cronRepository.getCronJobByChatId(chatId);

    if (!cronJobByChatId) {
      const { raw } = await this.cronRepository.createCronJob(createCronJobDto);
      this.addCronJob(chatId, time);
      
      this.logger.log(`cron jobs successfully created with id: ${raw[0].id}`);
    } else {
      const { affected } = await this.cronRepository.updateCronJob(chatId, createCronJobDto);
      this.stopCronJob(cronJobByChatId.chatId.toString());
      this.addCronJob(chatId, time);

      this.logger.log(`${affected} cron jobs successfully updated`);
    }
  }

  async updateCronJob(id: CronEntity['id'], updateCronJobDto: UpdateCronJobDto) {
    this.logger.log('trying to update cron job');

    const cronJobByChatId = await this.cronRepository.getCronJobByChatId(id);

    if (!cronJobByChatId) {
      this.logger.error(`CronJob with id: ${id} not exist`);
      throw new HttpException(`CronJob with id: ${id} not exist`, HttpStatus.BAD_REQUEST);
    }

    const { affected } = await this.cronRepository.updateCronJob(id, updateCronJobDto);
    const { chatId, time } = updateCronJobDto;

    this.stopCronJob(cronJobByChatId.chatId.toString());
    this.addCronJob(chatId, time);
    this.logger.log(`${affected} cron jobs successfully updated`);
  }

  async onModuleInit() {
    this.stopAllCronJobs();
    const cronJobs = await this.getCronJobs();
    cronJobs.forEach(({ time, chatId }: CronEntity) => {
      this.addCronJob(chatId, time);
    });
  }
}
