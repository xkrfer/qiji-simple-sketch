import { SinRowKey, SinResponsiveBreakpoint } from './types';

/**
 * 生成行的唯一key
 */
export function getSinRowKey<T>(
  record: T,
  index: number,
  rowKey?: keyof T | ((record: T) => SinRowKey)
): SinRowKey {
  if (typeof rowKey === 'function') {
    return rowKey(record);
  }
  if (typeof rowKey === 'string') {
    return (record as Record<string, unknown>)[rowKey as string] as SinRowKey;
  }
  const recordObj = record as Record<string, unknown>;
  if (recordObj['key'] !== undefined) {
    return recordObj['key'] as SinRowKey;
  }
  if (recordObj['id'] !== undefined) {
    return recordObj['id'] as SinRowKey;
  }
  return index;
}

/**
 * 从记录中获取指定字段的值
 */
export function getSinValueByDataIndex<T>(
  record: T,
  dataIndex?: keyof T
): unknown {
  if (!dataIndex) return undefined;
  return (record as Record<string, unknown>)[dataIndex as string];
}

/**
 * 数组移动元素
 */
export function sinArrayMove<T>(array: T[], from: number, to: number): T[] {
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
export function sinClassNames(
  ...classes: (string | undefined | null | boolean)[]
): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * 获取当前屏幕断点
 */
export function getSinCurrentBreakpoint(): SinResponsiveBreakpoint {
  const width = window.innerWidth;
  if (width < 640) return 'sm';
  if (width < 768) return 'md';
  if (width < 1024) return 'lg';
  return 'xl';
}

/**
 * 检查是否为移动设备
 */
export function isSinMobile(): boolean {
  return window.innerWidth < 768;
}

/**
 * 防抖函数
 */
export function sinDebounce<T extends (...args: unknown[]) => unknown>(
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
export function sinThrottle<T extends (...args: unknown[]) => unknown>(
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

/**
 * 深度克隆对象
 */
export function sinDeepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof Array) {
    return obj.map((item) => sinDeepClone(item)) as unknown as T;
  }

  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = sinDeepClone(obj[key]);
      }
    }
    return clonedObj;
  }

  return obj;
}
