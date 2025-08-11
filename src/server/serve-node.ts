import { serve } from '@hono/node-server';

import { EMOJI_ICON } from '@/lib';

import app from './app';
import { env } from './env';
import { logger } from './utils';

const e = env();

serve({ fetch: app.fetch, port: e.PORT }, ({ port }) => {
  logger.info(`${EMOJI_ICON} Server running at http://localhost:${port}`);
});
