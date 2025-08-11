import { logger } from '../utils';

import type { MiddlewareHandler } from 'hono';

export const LoggerMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    c.res.headers.set('X-Powered-By', 'Hono');
    const start = Date.now();
    await next();
    const end = Date.now();
    const duration = end - start;
    logger.debug(
      `${humanizeMethod(c.req.method)} - ${c.req.path} ${humanizeTime(duration)}`
    );
  };
};

function humanizeTime(delta: number) {
  if (delta < 1000) {
    return `\x1b[32m[${delta}ms]\x1b[0m`; // 绿色显示毫秒
  } else {
    return `\x1b[33m[${Math.round(delta / 1000)}s]\x1b[0m`; // 黄色显示秒
  }
}

function humanizeMethod(method: string) {
  if (method === 'GET') {
    return `\x1b[32m[${method}]\x1b[0m`; // 绿色显示GET
  } else if (method === 'POST') {
    return `\x1b[33m[${method}]\x1b[0m`; // 黄色显示POST
  } else if (method === 'PUT') {
    return `\x1b[34m[${method}]\x1b[0m`; // 蓝色显示PUT
  } else if (method === 'DELETE') {
    return `\x1b[35m[${method}]\x1b[0m`; // 紫色显示DELETE
  } else if (method === 'PATCH') {
    return `\x1b[36m[${method}]\x1b[0m`; // 青色显示PATCH
  } else {
    return `\x1b[37m[${method}]\x1b[0m`; // 白色显示其他方法
  }
}
