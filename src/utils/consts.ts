import * as dotenv from 'dotenv';

dotenv.config();

const { CRON_TIME } = process.env;

export const cronTimezone = 'Europe/Moscow';

export const cronTime = CRON_TIME;
