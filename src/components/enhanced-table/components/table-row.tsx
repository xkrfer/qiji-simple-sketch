import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TableRow as UITableRow, TableCell } from '@/components/ui/table';
import { DragHandle } from './drag-handle';
import { ColumnConfig, RowEventHandlers, RowKey } from '../types';
import { getRowKey, getValueByDataIndex, classNames } from '../utils';

export interface EnhancedTableRowProps<T> {
  record: T;
  index: number;
  columns: ColumnConfig<T>[];
  rowKey?: keyof T | ((record: T) => RowKey);

  // 拖拽相关
  draggable?: boolean;
  isDragging?: boolean;

  // 选择相关
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (selected: boolean, nativeEvent: Event) => void;
  selectionType?: 'checkbox' | 'radio';
  checkboxProps?: { disabled?: boolean; name?: string };

  // 事件处理
  onRow?: RowEventHandlers;

  // 样式
  className?: string;
  size?: 'small' | 'default' | 'large';
}

export function EnhancedTableRow<T>({
  record,
  index,
  columns,
  rowKey,
  draggable = false,
  isDragging = false,
  selectable = false,
  selected = false,
  onSelect,
  selectionType = 'checkbox',
  checkboxProps = {},
  onRow,
  className,
  size = 'default',
}: EnhancedTableRowProps<T>) {
  const key = getRowKey(record, index, rowKey);

  // 拖拽功能
  const sortable = useSortable({
    id: key,
    disabled: !draggable,
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = sortable;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
  };

  // 处理选择
  const handleSelectionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onSelect?.(event.target.checked, event.nativeEvent);
  };

  const renderSelectionCell = () => {
    if (!selectable) return null;

    return (
      <TableCell className="w-12 text-center">
        <input
          type={selectionType}
          checked={selected}
          onChange={handleSelectionChange}
          disabled={checkboxProps.disabled}
          name={checkboxProps.name}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </TableCell>
    );
  };

  const renderDragHandleCell = () => {
    if (!draggable) return null;

    return (
      <TableCell className="w-12 text-center">
        <div {...attributes} {...listeners}>
          <DragHandle size={size} disabled={checkboxProps.disabled} />
        </div>
      </TableCell>
    );
  };

  const renderDataCells = () => {
    return columns.map((column) => {
      const value = getValueByDataIndex(record, column.dataIndex);
      const cellContent = column.render
        ? column.render(value, record, index)
        : value;

      return (
        <TableCell
          key={column.key}
          className={classNames(
            column.align === 'center' && 'text-center',
            column.align === 'right' && 'text-right',
            column.ellipsis && 'truncate max-w-xs',
            column.className
          )}
          style={{
            width: column.width,
            minWidth: column.minWidth,
            maxWidth: column.maxWidth,
          }}
        >
          {cellContent}
        </TableCell>
      );
    });
  };

  return (
    <UITableRow
      ref={setNodeRef}
      style={style}
      className={classNames(
        'transition-all duration-200',
        isDragging || isSortableDragging
          ? 'bg-gray-100 dark:bg-gray-700 ring-inset ring-2 ring-blue-400 dark:ring-blue-500'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800',
        className
      )}
      {...onRow}
    >
      {renderSelectionCell()}
      {renderDragHandleCell()}
      {renderDataCells()}
    </UITableRow>
  );
}
