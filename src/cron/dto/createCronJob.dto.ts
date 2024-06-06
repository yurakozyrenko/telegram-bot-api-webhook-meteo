import { PickType } from '@nestjs/mapped-types';

import { CronDto } from './cron.dto';

export class CreateCronJobDto extends PickType(CronDto, ['chatId', 'time']) {}
