import { useState, useCallback } from 'react';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '../utils';
import { DraggableConfig, DragResult } from '../types';

export interface UseTableDraggingProps<T> {
  data: T[];
  onDataChange: (newData: T[]) => void;
  draggable?: boolean | DraggableConfig;
  onDragEnd?: (result: DragResult<T>) => void;
}

export function useTableDragging<T>({
  data,
  onDataChange,
  draggable,
  onDragEnd,
}: UseTableDraggingProps<T>) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const isEnabled =
    draggable === true ||
    (typeof draggable === 'object' && draggable.enabled !== false);
  const draggableConfig = typeof draggable === 'object' ? draggable : {};

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      if (!isEnabled) return;

      setActiveId(event.active.id as string);
      setIsDragging(true);

      draggableConfig.onDragStart?.(event);
    },
    [isEnabled, draggableConfig]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (!isEnabled) return;

      const { active, over } = event;

      setActiveId(null);
      setIsDragging(false);

      if (active.id !== over?.id) {
        const oldIndex = data.findIndex(
          (item: any) => (item.key || item.id) === active.id
        );
        const newIndex = data.findIndex(
          (item: any) => (item.key || item.id) === over?.id
        );

        if (oldIndex !== -1 && newIndex !== -1) {
          const newData = arrayMove(data, oldIndex, newIndex);

          const dragResult: DragResult<T> = {
            oldIndex,
            newIndex,
            item: data[oldIndex],
            items: newData,
          };

          onDataChange(newData);
          onDragEnd?.(dragResult);
          draggableConfig.onDragEnd?.(dragResult);
        }
      }
    },
    [isEnabled, data, onDataChange, onDragEnd, draggableConfig]
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setIsDragging(false);
  }, []);

  return {
    // 状态
    activeId,
    isDragging,
    isEnabled,

    // 事件处理器
    handleDragStart,
    handleDragEnd,
    handleDragCancel,

    // 配置
    draggableConfig,
  };
}
