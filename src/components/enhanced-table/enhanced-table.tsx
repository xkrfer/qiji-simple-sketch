import { useState, useEffect, useMemo } from 'react';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { EnhancedTableRow } from './components/table-row';
import { useTableDragging } from './hooks/use-table-dragging';
import { useTableSelection } from './hooks/use-table-selection';
import { EnhancedTableProps, ColumnConfig } from './types';
import {
  getRowKey,
  getVisibleColumns,
  getCurrentBreakpoint,
  classNames,
} from './utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function EnhancedTable<T extends Record<string, any>>({
  columns,
  dataSource,
  rowKey,
  draggable = false,
  rowSelection,
  pagination = false,
  size = 'default',
  loading = false,
  className,
  onChange,
  onRow,
  locale,
}: EnhancedTableProps<T>) {
  const [data, setData] = useState<T[]>(dataSource);
  const [breakpoint, setBreakpoint] = useState(getCurrentBreakpoint());

  // 响应式处理
  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getCurrentBreakpoint());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 同步外部数据
  useEffect(() => {
    setData(dataSource);
  }, [dataSource]);

  // 拖拽功能
  const dragging = useTableDragging({
    data,
    onDataChange: setData,
    draggable,
    onDragEnd: () => {
      // 可以在这里触发 onChange 回调
      onChange?.(pagination, {}, {});
    },
  });

  // 选择功能
  const selection = useTableSelection({
    data,
    rowSelection,
    rowKey,
  });

  // 拖拽传感器配置
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 计算可见列
  const visibleColumns = useMemo(() => {
    return getVisibleColumns(columns, breakpoint);
  }, [columns, breakpoint]);

  // 添加选择列和拖拽列
  const finalColumns = useMemo(() => {
    const cols: ColumnConfig<T>[] = [];

    // 选择列
    if (selection.isEnabled) {
      cols.push({
        key: '__selection__',
        title:
          selection.selectionType === 'checkbox' &&
          !rowSelection?.hideSelectAll ? (
            <input
              type="checkbox"
              checked={selection.isAllSelected}
              ref={(input) => {
                if (input) input.indeterminate = selection.isIndeterminate;
              }}
              onChange={(e) => selection.handleSelectAll(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          ) : (
            ''
          ),
        width: 48,
      });
    }

    // 拖拽列
    if (dragging.isEnabled) {
      cols.push({
        key: '__drag__',
        title: '排序',
        width: 48,
      });
    }

    return [...cols, ...visibleColumns];
  }, [visibleColumns, selection, dragging, rowSelection]);

  // 渲染表头
  const renderTableHeader = () => (
    <TableHeader>
      <TableRow className="border-gray-200 dark:border-gray-700">
        {finalColumns.map((column) => (
          <TableHead
            key={column.key}
            className={classNames(
              column.align === 'center' && 'text-center',
              column.align === 'right' && 'text-right',
              column.className
            )}
            style={{
              width: column.width,
              minWidth: column.minWidth,
              maxWidth: column.maxWidth,
            }}
          >
            {column.title}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );

  // 渲染表格行
  const renderTableRows = () => {
    if (loading) {
      return (
        <TableRow>
          <td colSpan={finalColumns.length} className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </td>
        </TableRow>
      );
    }

    if (data.length === 0) {
      return (
        <TableRow>
          <td
            colSpan={finalColumns.length}
            className="text-center py-8 text-gray-500"
          >
            {locale?.emptyText || '暂无数据'}
          </td>
        </TableRow>
      );
    }

    return data.map((record, index) => {
      const key = getRowKey(record, index, rowKey);
      const isSelected = selection.isRowSelected(record, index);
      const checkboxProps = selection.getRowCheckboxProps(record);
      const rowEventHandlers = onRow?.(record, index);

      return (
        <EnhancedTableRow
          key={key}
          record={record}
          index={index}
          columns={visibleColumns}
          rowKey={rowKey}
          draggable={dragging.isEnabled}
          isDragging={dragging.activeId === key}
          selectable={selection.isEnabled}
          selected={isSelected}
          onSelect={(selected, nativeEvent) =>
            selection.handleSelectRow(record, index, selected, nativeEvent)
          }
          selectionType={selection.selectionType}
          checkboxProps={checkboxProps}
          onRow={rowEventHandlers}
          size={size}
        />
      );
    });
  };

  // 渲染拖拽覆盖层
  const renderDragOverlay = () => {
    if (!dragging.activeId) return null;

    const activeRecord = data.find(
      (record, index) => getRowKey(record, index, rowKey) === dragging.activeId
    );

    if (!activeRecord) return null;

    return (
      <div style={{ opacity: 0 }} className="w-full">
        <Table>
          <TableHeader>
            <TableRow className="invisible">
              {finalColumns.map((column) => (
                <TableHead key={column.key} style={{ width: column.width }}>
                  {column.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <EnhancedTableRow
              record={activeRecord}
              index={0}
              columns={visibleColumns}
              rowKey={rowKey}
              draggable={false}
              size={size}
            />
          </TableBody>
        </Table>
      </div>
    );
  };

  const tableContent = (
    <div
      className={classNames(
        'relative bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden',
        className
      )}
    >
      <div className="overflow-x-auto">
        <Table>
          {renderTableHeader()}
          <TableBody>{renderTableRows()}</TableBody>
        </Table>
      </div>
    </div>
  );

  // 如果启用拖拽，包裹DndContext
  if (dragging.isEnabled) {
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={dragging.handleDragStart}
        onDragEnd={dragging.handleDragEnd}
        onDragCancel={dragging.handleDragCancel}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={data.map((record, index) => getRowKey(record, index, rowKey))}
          strategy={verticalListSortingStrategy}
        >
          {tableContent}
        </SortableContext>
        <DragOverlay>{renderDragOverlay()}</DragOverlay>
      </DndContext>
    );
  }

  return tableContent;
}
