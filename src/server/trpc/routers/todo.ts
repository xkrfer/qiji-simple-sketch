import { zfd } from 'zod-form-data';

import { createTRPCRouter, protectedProcedure } from '../trpc';
const todoRouter = createTRPCRouter({
  list: protectedProcedure.query(async () => {
    return [
      {
        id: 3,
        title: 'Todo 1',
      },
      {
        id: 2,
      },
    ];
  }),
  upload: protectedProcedure
    .input(
      zfd.formData({
        file: zfd.file(),
      })
    )
    .mutation(async ({ input }) => {
      const { file } = input;
      return {
        name: file?.name,
        size: file?.size,
        type: file?.type,
        url: 'https://example.com/file.pdf',
      };
    }),
});

export default todoRouter;
