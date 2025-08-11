import { useState, useEffect } from 'react';

import { createFileRoute } from '@tanstack/react-router';
import { Circle, AlertCircle, CheckCircle } from 'lucide-react';

import { SinTable, SinTableColumnConfig } from '@/components/sin';
import { Badge } from '@/components/ui/badge';
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

  // 获取表格数据
  const { data, isLoading } = api.todo.getTableData.useQuery();

  // 同步数据到本地状态
  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

  // 定义表格列配置
  const columns: SinTableColumnConfig<TableItem>[] = [
    {
      key: 'name',
      title: '项目名称',
      dataIndex: 'name',
      minWidth: 200,
      render: (value) => (
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {value}
        </span>
      ),
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      minWidth: 100,
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'priority',
      title: '优先级',
      dataIndex: 'priority',
      minWidth: 80,
      render: (value) => <PriorityBadge priority={value} />,
    },
    {
      key: 'createdAt',
      title: '创建时间',
      dataIndex: 'createdAt',
      minWidth: 120,
      responsive: ['sm'],
      render: (value: Date) => (
        <span className="text-sm text-muted-foreground">
          {value.toLocaleDateString('zh-CN')}
        </span>
      ),
    },
    {
      key: 'description',
      title: '描述',
      dataIndex: 'description',
      minWidth: 200,
      responsive: ['md'],
      render: (value) => (
        <span className="text-sm text-muted-foreground max-w-xs truncate">
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          项目管理表格
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          共 {items.length} 个项目 • 拖拽行来重新排序（仅前端排序）
        </p>
      </div>

      <SinTable
        columns={columns}
        dataSource={items}
        rowKey="id"
        draggable={true}
        loading={isLoading}
        locale={{
          emptyText: '暂无数据',
        }}
      />
    </div>
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
