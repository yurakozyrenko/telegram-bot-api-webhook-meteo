import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';

import { CreateCronJobDto } from './dto/createCronJob.dto';
import { UpdateCronJobDto } from './dto/updateCronJob.dto';
import { CronEntity } from './entity/cron.entity';

@Injectable()
export class CronRepository {
  constructor(
    @InjectRepository(CronEntity)
    private readonly cronEntityRepository: Repository<CronEntity>,
  ) {}

  async getCronJobs(): Promise<[CronEntity[], number]> {
    return await this.cronEntityRepository.createQueryBuilder('cron').getManyAndCount();
  }

  async getCronJobByNameAndTime(chatId: number, time: string): Promise<CronEntity> {
    return await this.cronEntityRepository
      .createQueryBuilder('cron')
      .where('chatId = :chatId', { chatId })
      .where('time = :time', { time })
      .getOne();
  }

  async getCronJobById(id: number): Promise<CronEntity> {
    return await this.cronEntityRepository.createQueryBuilder('cron').where('id = :id', { id }).getOne();
  }

  async createCronJob(createCronJobDto: CreateCronJobDto): Promise<InsertResult> {
    return await this.cronEntityRepository
      .createQueryBuilder('cron')
      .insert()
      .into(CronEntity)
      .values(createCronJobDto)
      .execute();
  }

  async updateCronJob(id: number, updateCronJobDto: UpdateCronJobDto): Promise<UpdateResult> {
    return await this.cronEntityRepository
      .createQueryBuilder('cron')
      .update(CronEntity)
      .set(updateCronJobDto)
      .where('id = :id', { id })
      .execute();
  }

  async deleteCronJob(id: number): Promise<DeleteResult> {
    return await this.cronEntityRepository.createQueryBuilder('cron').delete().where('id = :id', { id }).execute();
  }
}
