/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from 'react';

import {
  SinRowKey,
  SinResponsiveBreakpoint,
  SinComponentSize,
  SinRowEventHandlers,
  SinBaseComponentProps,
} from '../shared';

// 拖拽结果
export interface SinTableDragResult<T = any> {
  oldIndex: number;
  newIndex: number;
  item: T;
  items: T[];
}

// 列配置
export interface SinTableColumnConfig<T = any> {
  key: string;
  title: ReactNode;
  dataIndex?: keyof T;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;

  // 渲染
  render?: (value: any, record: T, index: number) => ReactNode;

  // 功能
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  fixed?: 'left' | 'right';

  // 响应式
  responsive?: SinResponsiveBreakpoint[];

  // 样式
  align?: 'left' | 'center' | 'right';
  ellipsis?: boolean;
  className?: string;
}

// 拖拽配置
export interface SinTableDraggableConfig {
  enabled?: boolean;
  handle?: string; // CSS选择器
  disabled?: boolean;
  onDragStart?: (event: any) => void;
  onDragEnd?: (result: SinTableDragResult) => void;
}

// 行选择配置
export interface SinTableRowSelectionConfig<T = any> {
  type?: 'checkbox' | 'radio';
  selectedRowKeys?: SinRowKey[];
  defaultSelectedRowKeys?: SinRowKey[];
  onChange?: (selectedRowKeys: SinRowKey[], selectedRows: T[]) => void;
  onSelect?: (
    record: T,
    selected: boolean,
    selectedRows: T[],
    nativeEvent: Event
  ) => void;
  onSelectAll?: (selected: boolean, selectedRows: T[], changeRows: T[]) => void;
  getCheckboxProps?: (record: T) => { disabled?: boolean; name?: string };
  hideSelectAll?: boolean;
  preserveSelectedRowKeys?: boolean;
}

// 分页配置
export interface SinTablePaginationConfig {
  current?: number;
  pageSize?: number;
  total?: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => ReactNode;
  onChange?: (page: number, pageSize: number) => void;
  onShowSizeChange?: (current: number, size: number) => void;
}

// 可展开配置
export interface SinTableExpandableConfig<T = any> {
  expandedRowKeys?: SinRowKey[];
  defaultExpandedRowKeys?: SinRowKey[];
  expandedRowRender?: (
    record: T,
    index: number,
    indent: number,
    expanded: boolean
  ) => ReactNode;
  expandRowByClick?: boolean;
  expandIcon?: (props: any) => ReactNode;
  onExpand?: (expanded: boolean, record: T) => void;
  onExpandedRowsChange?: (expandedKeys: SinRowKey[]) => void;
}

// 滚动配置
export interface SinTableScrollConfig {
  x?: number | string | true;
  y?: number | string;
  scrollToFirstRowOnChange?: boolean;
}

// 主组件Props
export interface SinTableProps<T = any> extends SinBaseComponentProps {
  // 基础数据
  columns: SinTableColumnConfig<T>[];
  dataSource: T[];
  rowKey?: keyof T | ((record: T) => SinRowKey);

  // 功能开关
  draggable?: boolean | SinTableDraggableConfig;
  rowSelection?: SinTableRowSelectionConfig<T>;
  pagination?: boolean | SinTablePaginationConfig;

  // 样式和布局
  bordered?: boolean;

  // 事件回调
  onChange?: (pagination: any, filters: any, sorter: any) => void;
  onRow?: (record: T, index: number) => SinRowEventHandlers;

  // 高级功能
  expandable?: SinTableExpandableConfig<T>;
  scroll?: SinTableScrollConfig;
  virtual?: boolean;
}

// 内部状态类型
export interface SinTableState<T = any> {
  data: T[];
  selectedRowKeys: SinRowKey[];
  expandedRowKeys: SinRowKey[];
  sortInfo: {
    columnKey?: string;
    order?: 'ascend' | 'descend';
  };
  filters: Record<string, any>;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
}
