import { PickType } from '@nestjs/mapped-types';

import { CronDto } from './cron.dto';

export class UpdateCronJobDto extends PickType(CronDto, ['chatId', 'time']) {}
