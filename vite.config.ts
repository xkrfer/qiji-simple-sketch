import { config } from '@dotenvx/dotenvx';
import devServer from '@hono/vite-dev-server';
import adapter from '@hono/vite-dev-server/node';
import tailwindcss from '@tailwindcss/vite';
import tanStackRouterVite from '@tanstack/router-plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { sri } from 'vite-plugin-sri3';
import tsconfigPaths from 'vite-tsconfig-paths';

import { tsupBuild } from './build';
import { parseEnv } from './src/server/env';

// validate env vars before starting
config({ quiet: true });
const e = parseEnv(process.env);

export default defineConfig(() => {
  return {
    server: {
      port: e.PORT,
    },
    build: {
      // minify: false,
      outDir: 'dist/public',
      copyPublicDir: true,
      chunkSizeWarningLimit: 500, // 降低警告限制，鼓励更小的包
      rollupOptions: {
        output: {
          manualChunks: {
            // React 生态系统
            'react-vendor': ['react', 'react-dom'],

            // TanStack 生态系统
            tanstack: ['@tanstack/react-query', '@tanstack/react-router'],

            // tRPC 客户端 (移除 @trpc/server，因为客户端不需要)
            trpc: ['@trpc/client', '@trpc/react-query'],

            // UI 和动画库
            'ui-libs': ['sonner', 'framer-motion'],

            // 状态管理
            state: ['jotai'],

            // 工具库
            utils: [
              'clsx',
              'tailwind-merge',
              'copy-to-clipboard',
              'dayjs',
              'nanoid',
              'radash',
              'superjson',
            ],

            // 验证和表单
            validation: ['zod', 'zod-form-data'],
          },
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        },
      },
    },
    plugins: [
      tsconfigPaths(),
      tailwindcss(),
      tanStackRouterVite(),
      viteReact({
        babel: {
          plugins: [['babel-plugin-react-compiler', {}]],
        },
      }),
      createHtmlPlugin({
        minify: true,
        entry: 'src/root.tsx',
        inject: {
          data: {
            title: 'Hono + TanStack Router + TRPC',
          },
        },
      }),
      sri(),
      devServer({
        entry: 'src/server/app.ts',
        adapter,
        env() {
          const result = config({
            quiet: true,
            override: true,
            // debug: true,
          });
          if (result.error) {
            throw result.error;
          }
          return result.parsed!;
        },
        exclude: [
          /^(?!\/(favicon|api|trpc)).*/, // exclude all routes that are not /api or /trpc or favicon
        ],
      }),
      tsupBuild({
        entry: ['src/server/serve-node.ts'],
        minify: false,
        format: 'esm',
        target: 'node16',
        silent: true,
        treeshake: true,
        cjsInterop: true,
        env: {
          //@ts-expect-error does actually support boolean
          DEV: false,
          //@ts-expect-error does actually support boolean
          PROD: true,
          //@ts-expect-error does actually support boolean
          SSR: false,
          NODE_ENV: 'production',
        },
        outDir: 'dist',
        async onSuccess() {
          console.log('Server build complete');
        },
      }),
    ],
  };
});
