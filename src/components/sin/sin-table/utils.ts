import { SinTableColumnConfig } from './types';
import { SinResponsiveBreakpoint, getSinCurrentBreakpoint } from '../shared';

/**
 * 根据响应式配置过滤列
 */
export function getSinTableVisibleColumns<T>(
  columns: SinTableColumnConfig<T>[],
  screenSize: SinResponsiveBreakpoint = getSinCurrentBreakpoint()
): SinTableColumnConfig<T>[] {
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
 * 计算列的实际宽度
 */
export function getSinTableColumnWidth(
  column: SinTableColumnConfig,
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
