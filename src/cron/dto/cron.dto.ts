import { IsInt, IsString, Length } from 'class-validator';

import { CronEntity } from '../entity/cron.entity';

export class CronDto {
  @IsInt()
  id: CronEntity['id'];

  @IsString()
  @Length(3, 40)
  chatId: CronEntity['chatId'];

  @IsString()
  time: CronEntity['time'];
}
