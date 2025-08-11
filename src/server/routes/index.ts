import { Hono } from 'hono';
import { compress as CompressMiddleware } from 'hono/compress';

import { EMOJI_ICON } from '@/lib';

import {
  LoggerMiddleware,
  TrpcMiddleware,
  FaviconMiddleware,
} from '../middlewares';

import { appRoute } from './app.route';

export function routes(app: Hono) {
  app.use(CompressMiddleware());
  app.use(FaviconMiddleware(EMOJI_ICON));
  app.use('/api/*', LoggerMiddleware());
  app.use('/api/trpc/*', TrpcMiddleware());
  app.route('/api/*', appRoute);
}
