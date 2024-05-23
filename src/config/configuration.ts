import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config();

export default (): any =>
  ({
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    WEBHOOK_HOST: process.env.WEBHOOK_HOST,
    PORT_WEBHOOK: process.env.PORT_WEBHOOK,
    LOG_LEVEL: process.env.LOG_LEVEL,
    API_PREFIX: '/api',
    API_VERSION: '/v1',
    POSTGRES_DB_SETTINGS: {
      type: process.env.DB_TYPE,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: process.env.DB_SYNCHRONIZE,
      namingStrategy: new SnakeNamingStrategy(),
    },
  }) as const;
