import { ColumnConfig, RowKey } from './types';

/**
 * 生成行的唯一key
 */
export function getRowKey<T>(
  record: T,
  index: number,
  rowKey?: keyof T | ((record: T) => RowKey)
): RowKey {
  if (typeof rowKey === 'function') {
    return rowKey(record);
  }
  if (typeof rowKey === 'string') {
    return (record as Record<string, unknown>)[rowKey as string] as RowKey;
  }
  const recordObj = record as Record<string, unknown>;
  if (recordObj['key'] !== undefined) {
    return recordObj['key'] as RowKey;
  }
  if (recordObj['id'] !== undefined) {
    return recordObj['id'] as RowKey;
  }
  return index;
}

/**
 * 根据响应式配置过滤列
 */
export function getVisibleColumns<T>(
  columns: ColumnConfig<T>[],
  screenSize: 'sm' | 'md' | 'lg' | 'xl' = 'xl'
): ColumnConfig<T>[] {
  const sizeOrder = ['sm', 'md', 'lg', 'xl'];
  const currentSizeIndex = sizeOrder.indexOf(screenSize);

  return columns.filter((column) => {
    if (!column.responsive || column.responsive.length === 0) {
      return true;
    }

    // 检查当前屏幕尺寸是否满足列的响应式要求
    return column.responsive.some((breakpoint) => {
      const breakpointIndex = sizeOrder.indexOf(breakpoint);
      return currentSizeIndex >= breakpointIndex;
    });
  });
}

/**
 * 从记录中获取指定字段的值
 */
export function getValueByDataIndex<T>(
  record: T,
  dataIndex?: keyof T
): unknown {
  if (!dataIndex) return undefined;
  return (record as Record<string, unknown>)[dataIndex as string];
}

/**
 * 计算列的实际宽度
 */
export function getColumnWidth(
  column: ColumnConfig,
  tableWidth: number,
  totalColumns: number
): number | string {
  if (column.width) {
    return column.width;
  }

  // 如果没有指定宽度，平均分配剩余空间
  const fixedWidthColumns = 0; // 这里可以计算固定宽度列的总宽度
  const remainingWidth = tableWidth - fixedWidthColumns;
  const flexColumns = totalColumns; // 这里可以计算非固定宽度列的数量

  return remainingWidth / flexColumns;
}

/**
 * 深度克隆对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as unknown as T;
  }

  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }

  return obj;
}

/**
 * 数组移动元素
 */
export function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const newArray = [...array];
  const item = newArray.splice(from, 1)[0];
  if (item !== undefined) {
    newArray.splice(to, 0, item);
  }
  return newArray;
}

/**
 * 生成CSS类名
 */
export function classNames(
  ...classes: (string | undefined | null | boolean)[]
): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * 检查是否为移动设备
 */
export function isMobile(): boolean {
  return window.innerWidth < 768;
}

/**
 * 获取当前屏幕断点
 */
export function getCurrentBreakpoint(): 'sm' | 'md' | 'lg' | 'xl' {
  const width = window.innerWidth;
  if (width < 640) return 'sm';
  if (width < 768) return 'md';
  if (width < 1024) return 'lg';
  return 'xl';
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
