import type { ContextVariableMap as HonoContextVariableMap } from 'hono';

declare module 'hono' {
  interface ContextVariableMap extends HonoContextVariableMap {
    user: {
      id: number;
      name: string;
      email: string;
      phone: string;
    };
  }
}
