import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import z from 'zod';

import { routes } from './routes';
import { logger } from './utils';

const app = new Hono({ strict: false });

routes(app);

/**
 * 除了 /api 以外的路由都走静态文件服务
 */
app.use('/*', serveStatic({ root: './dist/public' }));
app.use('/*', serveStatic({ path: './dist/public/index.html' }));

app.onError((error, c) => {
  if (error instanceof z.ZodError) {
    const errors = z.flattenError(error);
    return c.json({ error: errors, message: 'ZodError' }, 400);
  }

  if (error instanceof HTTPException) {
    return c.json({ message: error.message }, error.status);
  }

  logger.error(error);
  return c.json({ message: error.message || 'Network Error' }, 500);
});

export default app;
