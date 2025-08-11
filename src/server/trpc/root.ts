import todoRouter from './routers/todo';
import { createTRPCRouter } from './trpc';
export const appRouter = createTRPCRouter({
  todo: todoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
