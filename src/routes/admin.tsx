import { useState, useEffect } from 'react';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { createFileRoute } from '@tanstack/react-router';
import { GripVertical, Circle, AlertCircle, CheckCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { api } from '@/trpc';

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
});

interface TableItem {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  priority: 'high' | 'medium' | 'low';
  order: number;
  createdAt: Date;
  description?: string;
}

function AdminLayout() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          🎛️ 管理员控制台
        </h1>
        <p className="text-muted-foreground">拖拽表格行来重新排序项目</p>
      </div>

      <DraggableTable />
    </div>
  );
}

function DraggableTable() {
  const [items, setItems] = useState<TableItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // 获取表格数据
  const { data, isLoading } = api.todo.getTableData.useQuery();

  // 同步数据到本地状态
  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

  // 配置拖拽传感器
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 处理拖拽开始
  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  // 处理拖拽结束
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          项目管理表格
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          共 {items.length} 个项目 • 拖拽行来重新排序（仅前端排序）
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-700">
                  <TableHead className="w-12 text-center">排序</TableHead>
                  <TableHead className="min-w-[200px]">项目名称</TableHead>
                  <TableHead className="min-w-[100px]">状态</TableHead>
                  <TableHead className="min-w-[80px]">优先级</TableHead>
                  <TableHead className="min-w-[120px] hidden sm:table-cell">
                    创建时间
                  </TableHead>
                  <TableHead className="min-w-[200px] hidden md:table-cell">
                    描述
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <SortableRow key={item.id} item={item} />
                ))}
              </TableBody>
            </Table>
          </div>
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <div className="opacity-95">
              <SortableRow item={items.find((item) => item.id === activeId)!} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function SortableRow({ item }: { item: TableItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`
        ${isDragging ? 'opacity-50 bg-blue-50 dark:bg-blue-900/20' : ''} 
        transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800
        border-gray-200 dark:border-gray-700
      `}
    >
      <TableCell className="text-center">
        <button
          {...attributes}
          {...listeners}
          className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing transition-colors"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TableCell>
      <TableCell className="font-medium text-gray-900 dark:text-gray-100">
        {item.name}
      </TableCell>
      <TableCell>
        <StatusBadge status={item.status} />
      </TableCell>
      <TableCell>
        <PriorityBadge priority={item.priority} />
      </TableCell>
      <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
        {item.createdAt.toLocaleDateString('zh-CN')}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground max-w-xs truncate hidden md:table-cell">
        {item.description}
      </TableCell>
    </TableRow>
  );
}

function StatusBadge({
  status,
}: {
  status: 'active' | 'inactive' | 'pending';
}) {
  const variants = {
    active: {
      icon: CheckCircle,
      label: '活跃',
      className:
        'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700',
    },
    inactive: {
      icon: Circle,
      label: '非活跃',
      className:
        'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
    },
    pending: {
      icon: AlertCircle,
      label: '待处理',
      className:
        'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700',
    },
  };

  const { icon: Icon, label, className } = variants[status];

  return (
    <Badge
      variant="outline"
      className={`${className} flex items-center gap-1 text-xs`}
    >
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}

function PriorityBadge({ priority }: { priority: 'high' | 'medium' | 'low' }) {
  const variants = {
    high: {
      label: '高',
      className:
        'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700',
    },
    medium: {
      label: '中',
      className:
        'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700',
    },
    low: {
      label: '低',
      className:
        'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
    },
  };

  const { label, className } = variants[priority];

  return (
    <Badge variant="outline" className={`${className} text-xs`}>
      {label}
    </Badge>
  );
}
