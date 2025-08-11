import { z } from 'zod';
import { zfd } from 'zod-form-data';

import { createTRPCRouter, protectedProcedure } from '../trpc';

// Mock数据存储
const tableData = [
  {
    id: '1',
    name: '用户管理系统',
    status: 'active' as const,
    priority: 'high' as const,
    order: 1,
    createdAt: new Date('2024-01-15'),
    description: '管理系统用户权限和角色分配',
  },
  {
    id: '2',
    name: '数据分析模块',
    status: 'pending' as const,
    priority: 'medium' as const,
    order: 2,
    createdAt: new Date('2024-01-14'),
    description: '提供业务数据统计和可视化功能',
  },
  {
    id: '3',
    name: '支付集成接口',
    status: 'inactive' as const,
    priority: 'high' as const,
    order: 3,
    createdAt: new Date('2024-01-13'),
    description: '集成第三方支付平台API',
  },
  {
    id: '4',
    name: '消息通知服务',
    status: 'active' as const,
    priority: 'low' as const,
    order: 4,
    createdAt: new Date('2024-01-12'),
    description: '发送邮件和短信通知功能',
  },
  {
    id: '5',
    name: '文件上传组件',
    status: 'pending' as const,
    priority: 'medium' as const,
    order: 5,
    createdAt: new Date('2024-01-11'),
    description: '支持多种格式文件上传和预览',
  },
];

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
  getTableData: protectedProcedure.query(async () => {
    // 按order字段排序返回数据
    return tableData.sort((a, b) => a.order - b.order);
  }),
  updateItemOrder: protectedProcedure
    .input(
      z.object({
        updates: z.array(
          z.object({
            id: z.string(),
            order: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const { updates } = input;

      // 更新每个项目的order值
      updates.forEach((update) => {
        const item = tableData.find((item) => item.id === update.id);
        if (item) {
          item.order = update.order;
        }
      });

      // 返回更新后的排序数据
      return tableData.sort((a, b) => a.order - b.order);
    }),
});

export default todoRouter;
