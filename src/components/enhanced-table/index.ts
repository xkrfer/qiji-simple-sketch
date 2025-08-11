// 主组件
export { EnhancedTable } from './enhanced-table';

// 子组件
export { EnhancedTableRow } from './components/table-row';
export { DragHandle } from './components/drag-handle';

// Hooks
export { useTableDragging } from './hooks/use-table-dragging';
export { useTableSelection } from './hooks/use-table-selection';

// 类型
export type {
  EnhancedTableProps,
  ColumnConfig,
  DraggableConfig,
  RowSelectionConfig,
  PaginationConfig,
  ExpandableConfig,
  ScrollConfig,
  TableState,
  DragResult,
  RowEventHandlers,
  RowKey,
  ResponsiveBreakpoint,
} from './types';

// 工具函数
export {
  getRowKey,
  getVisibleColumns,
  getValueByDataIndex,
  getColumnWidth,
  arrayMove,
  classNames,
  getCurrentBreakpoint,
  isMobile,
  debounce,
  throttle,
} from './utils';
