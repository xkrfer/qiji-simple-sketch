/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from 'react';

// Sin组件系列通用类型

// 基础数据类型
export type SinRowKey = string | number;

// 响应式断点
export type SinResponsiveBreakpoint = 'sm' | 'md' | 'lg' | 'xl';

// 组件尺寸
export type SinComponentSize = 'small' | 'default' | 'large';

// 主题模式
export type SinThemeMode = 'light' | 'dark' | 'system';

// 行事件处理器
export interface SinRowEventHandlers {
  onClick?: (event: React.MouseEvent) => void;
  onDoubleClick?: (event: React.MouseEvent) => void;
  onContextMenu?: (event: React.MouseEvent) => void;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
}

// 国际化配置
export interface SinLocaleConfig {
  emptyText?: ReactNode;
  loading?: ReactNode;
  error?: ReactNode;
  retry?: ReactNode;
}

// 通用组件Props基类
export interface SinBaseComponentProps {
  className?: string;
  size?: SinComponentSize;
  loading?: boolean;
  disabled?: boolean;
  locale?: SinLocaleConfig;
}

// 数据源基类
export interface SinDataSourceItem {
  key?: SinRowKey;
  id?: SinRowKey;
  [key: string]: any;
}
