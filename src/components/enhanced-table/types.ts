/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from 'react';

// 基础数据类型
export type RowKey = string | number;

// 响应式断点
export type ResponsiveBreakpoint = 'sm' | 'md' | 'lg' | 'xl';

// 拖拽结果
export interface DragResult<T = any> {
  oldIndex: number;
  newIndex: number;
  item: T;
  items: T[];
}

// 行事件处理器
export interface RowEventHandlers {
  onClick?: (event: React.MouseEvent) => void;
  onDoubleClick?: (event: React.MouseEvent) => void;
  onContextMenu?: (event: React.MouseEvent) => void;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
}

// 列配置
export interface ColumnConfig<T = any> {
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
  responsive?: ResponsiveBreakpoint[];

  // 样式
  align?: 'left' | 'center' | 'right';
  ellipsis?: boolean;
  className?: string;
}

// 拖拽配置
export interface DraggableConfig {
  enabled?: boolean;
  handle?: string; // CSS选择器
  disabled?: boolean;
  onDragStart?: (event: any) => void;
  onDragEnd?: (result: DragResult) => void;
}

// 行选择配置
export interface RowSelectionConfig<T = any> {
  type?: 'checkbox' | 'radio';
  selectedRowKeys?: RowKey[];
  defaultSelectedRowKeys?: RowKey[];
  onChange?: (selectedRowKeys: RowKey[], selectedRows: T[]) => void;
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
export interface PaginationConfig {
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
export interface ExpandableConfig<T = any> {
  expandedRowKeys?: RowKey[];
  defaultExpandedRowKeys?: RowKey[];
  expandedRowRender?: (
    record: T,
    index: number,
    indent: number,
    expanded: boolean
  ) => ReactNode;
  expandRowByClick?: boolean;
  expandIcon?: (props: any) => ReactNode;
  onExpand?: (expanded: boolean, record: T) => void;
  onExpandedRowsChange?: (expandedKeys: RowKey[]) => void;
}

// 滚动配置
export interface ScrollConfig {
  x?: number | string | true;
  y?: number | string;
  scrollToFirstRowOnChange?: boolean;
}

// 主组件Props
export interface EnhancedTableProps<T = any> {
  // 基础数据
  columns: ColumnConfig<T>[];
  dataSource: T[];
  rowKey?: keyof T | ((record: T) => RowKey);

  // 功能开关
  draggable?: boolean | DraggableConfig;
  rowSelection?: RowSelectionConfig<T>;
  pagination?: boolean | PaginationConfig;

  // 样式和布局
  size?: 'default' | 'small' | 'large';
  bordered?: boolean;
  loading?: boolean;
  className?: string;

  // 事件回调
  onChange?: (pagination: any, filters: any, sorter: any) => void;
  onRow?: (record: T, index: number) => RowEventHandlers;

  // 高级功能
  expandable?: ExpandableConfig<T>;
  scroll?: ScrollConfig;
  virtual?: boolean;

  // 空状态
  locale?: {
    emptyText?: ReactNode;
  };
}

// 内部状态类型
export interface TableState<T = any> {
  data: T[];
  selectedRowKeys: RowKey[];
  expandedRowKeys: RowKey[];
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
