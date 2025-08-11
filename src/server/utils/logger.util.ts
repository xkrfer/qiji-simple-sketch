import pino from 'pino';
import PinoPretty from 'pino-pretty';

import { env } from '../env';

export const logger = pino(
  {
    level: env().LOG_LEVEL,
    enabled: true,
    messageKey: 'message',
  },
  PinoPretty({
    colorize: true,
    translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
    ignore: 'pid,hostname',
  })
);
