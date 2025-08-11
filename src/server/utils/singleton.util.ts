/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from './logger.util';

const singleton = Symbol.for('singleton');

// 创建一个通用的 useService 函数，用于创建单例服务
export function getSingleton<T>(
  ctor: (new () => T) & {
    [singleton]?: T;
  }
): T {
  // 如果服务尚未创建，则创建一个新的服务实例
  if (!ctor[singleton]) {
    const instance = new ctor();

    // 为实例的所有方法添加日志切片
    const methodNames = Object.getOwnPropertyNames(
      Object.getPrototypeOf(instance)
    ).filter(
      (name) =>
        name !== 'constructor' && typeof (instance as any)[name] === 'function'
    );

    methodNames.forEach((methodName) => {
      const originalMethod = (instance as any)[methodName];
      (instance as any)[methodName] = function (...args: any[]) {
        try {
          const result = originalMethod.apply(this, args);
          if (result instanceof Promise) {
            return result
              .then((res) => {
                return res;
              })
              .catch((error) => {
                logger.error(
                  `方法 ${
                    ctor.name
                  }.${methodName} 异步执行失败，错误: ${JSON.stringify(error)}`
                );
                throw error;
              });
          } else {
            return result;
          }
        } catch (error) {
          logger.error(
            `方法 ${
              ctor.name
            }.${methodName} 同步执行失败，错误: ${JSON.stringify(error)}`
          );
          throw error;
        }
      };
    });

    ctor[singleton] = instance;
  }

  // 返回服务实例
  return ctor[singleton];
}
