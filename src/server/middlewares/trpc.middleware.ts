import { trpcServer } from '@hono/trpc-server';

import { appRouter } from '../trpc';

import type { MiddlewareHandler } from 'hono';

export const TrpcMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    return trpcServer({
      endpoint: '/api/trpc',
      router: appRouter,
      createContext: async (_, c) => {
        return {
          headers: c.req.header(),
        };
      },
    })(c, next);
  };
};
