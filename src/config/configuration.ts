export default (): any =>
  ({
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    WEBHOOK_HOST: process.env.WEBHOOK_HOST,
    PORT_WEBHOOK: process.env.PORT_WEBHOOK,
    LOG_LEVEL: process.env.LOG_LEVEL,
    API_PREFIX: '/api',
    API_VERSION: '/v1',
  }) as const;
