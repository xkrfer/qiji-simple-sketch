import { useState, useCallback, useMemo } from 'react';

import { SinRowKey, getSinRowKey } from '../../shared';
import { SinTableRowSelectionConfig } from '../types';

export interface UseSinTableSelectionProps<T> {
  data: T[];
  rowSelection?: SinTableRowSelectionConfig<T>;
  rowKey?: keyof T | ((record: T) => SinRowKey);
}

export function useSinTableSelection<T>({
  data,
  rowSelection,
  rowKey,
}: UseSinTableSelectionProps<T>) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<SinRowKey[]>(
    rowSelection?.selectedRowKeys || rowSelection?.defaultSelectedRowKeys || []
  );

  const isEnabled = !!rowSelection;
  const selectionType = rowSelection?.type || 'checkbox';

  // 获取当前选中的行数据
  const selectedRows = useMemo(() => {
    if (!isEnabled) return [];

    return data.filter((record, index) => {
      const key = getSinRowKey(record, index, rowKey);
      return selectedRowKeys.includes(key);
    });
  }, [data, selectedRowKeys, rowKey, isEnabled]);

  // 全选状态
  const isAllSelected = useMemo(() => {
    if (!isEnabled || data.length === 0) return false;

    const allKeys = data.map((record, index) =>
      getSinRowKey(record, index, rowKey)
    );
    return allKeys.every((key) => selectedRowKeys.includes(key));
  }, [data, selectedRowKeys, rowKey, isEnabled]);

  // 部分选中状态
  const isIndeterminate = useMemo(() => {
    if (!isEnabled || selectedRowKeys.length === 0) return false;
    return selectedRowKeys.length > 0 && !isAllSelected;
  }, [selectedRowKeys.length, isAllSelected, isEnabled]);

  // 处理单行选择
  const handleSelectRow = useCallback(
    (record: T, index: number, selected: boolean, nativeEvent: Event) => {
      if (!isEnabled) return;

      const key = getSinRowKey(record, index, rowKey);
      let newSelectedRowKeys: SinRowKey[];

      if (selectionType === 'radio') {
        // 单选模式
        newSelectedRowKeys = selected ? [key] : [];
      } else {
        // 多选模式
        if (selected) {
          newSelectedRowKeys = [...selectedRowKeys, key];
        } else {
          newSelectedRowKeys = selectedRowKeys.filter((k) => k !== key);
        }
      }

      setSelectedRowKeys(newSelectedRowKeys);

      const newSelectedRows = data.filter((record, index) => {
        const key = getSinRowKey(record, index, rowKey);
        return newSelectedRowKeys.includes(key);
      });

      // 触发回调
      rowSelection?.onChange?.(newSelectedRowKeys, newSelectedRows);
      rowSelection?.onSelect?.(record, selected, newSelectedRows, nativeEvent);
    },
    [data, selectedRowKeys, rowSelection, rowKey, selectionType, isEnabled]
  );

  // 处理全选
  const handleSelectAll = useCallback(
    (selected: boolean) => {
      if (!isEnabled) return;

      let newSelectedRowKeys: SinRowKey[];
      let changeRows: T[];

      if (selected) {
        // 全选
        const allKeys = data.map((record, index) =>
          getSinRowKey(record, index, rowKey)
        );
        newSelectedRowKeys = [...new Set([...selectedRowKeys, ...allKeys])];
        changeRows = data.filter((record, index) => {
          const key = getSinRowKey(record, index, rowKey);
          return !selectedRowKeys.includes(key);
        });
      } else {
        // 取消全选
        const allKeys = data.map((record, index) =>
          getSinRowKey(record, index, rowKey)
        );
        newSelectedRowKeys = selectedRowKeys.filter(
          (key) => !allKeys.includes(key)
        );
        changeRows = data.filter((record, index) => {
          const key = getSinRowKey(record, index, rowKey);
          return selectedRowKeys.includes(key);
        });
      }

      setSelectedRowKeys(newSelectedRowKeys);

      const newSelectedRows = data.filter((record, index) => {
        const key = getSinRowKey(record, index, rowKey);
        return newSelectedRowKeys.includes(key);
      });

      // 触发回调
      rowSelection?.onChange?.(newSelectedRowKeys, newSelectedRows);
      rowSelection?.onSelectAll?.(selected, newSelectedRows, changeRows);
    },
    [data, selectedRowKeys, rowSelection, rowKey, isEnabled]
  );

  // 检查行是否被选中
  const isRowSelected = useCallback(
    (record: T, index: number) => {
      if (!isEnabled) return false;
      const key = getSinRowKey(record, index, rowKey);
      return selectedRowKeys.includes(key);
    },
    [selectedRowKeys, rowKey, isEnabled]
  );

  // 获取行的checkbox属性
  const getRowCheckboxProps = useCallback(
    (record: T) => {
      if (!isEnabled) return {};
      return rowSelection?.getCheckboxProps?.(record) || {};
    },
    [rowSelection, isEnabled]
  );

  // 清空选择
  const clearSelection = useCallback(() => {
    if (!isEnabled) return;
    setSelectedRowKeys([]);
    rowSelection?.onChange?.([], []);
  }, [rowSelection, isEnabled]);

  // 设置选中的行
  const setSelection = useCallback(
    (keys: SinRowKey[]) => {
      if (!isEnabled) return;
      setSelectedRowKeys(keys);

      const newSelectedRows = data.filter((record, index) => {
        const key = getSinRowKey(record, index, rowKey);
        return keys.includes(key);
      });

      rowSelection?.onChange?.(keys, newSelectedRows);
    },
    [data, rowSelection, rowKey, isEnabled]
  );

  return {
    // 状态
    selectedRowKeys,
    selectedRows,
    isAllSelected,
    isIndeterminate,
    isEnabled,
    selectionType,

    // 方法
    handleSelectRow,
    handleSelectAll,
    isRowSelected,
    getRowCheckboxProps,
    clearSelection,
    setSelection,

    // 配置
    rowSelection,
  };
}
