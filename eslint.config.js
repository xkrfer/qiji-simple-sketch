import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      prettier,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      import: importPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-empty-object-type': 'off',
      'import/order': [
        'warn',
        {
          groups: [
            'builtin', // 1. 内置模块 (fs, path)
            'external', // 2. 外部依赖 (react, hono)
            'internal', // 3. 内部路径别名 (@/components)
            'parent', // 4. 父级目录 (../)
            'sibling', // 5. 同级目录 (./)
            'index', // 6. index 文件 (./index)
            'object', // 7. 对象导入 (import { a } from './a')
            'type', // 8. 类型导入 (import type)
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always', // 每个组之间强制换行
          alphabetize: {
            order: 'asc', // 按升序排序
            caseInsensitive: true, // 忽略大小写
          },
        },
      ],
    },
    // 新增: 为 import 插件提供解析器设置
    settings: {
      'import/resolver': {
        typescript: {},
        node: true,
      },
    },
  }
);
