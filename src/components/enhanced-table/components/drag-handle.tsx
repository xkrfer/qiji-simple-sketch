import React from 'react';

import { GripVertical } from 'lucide-react';

import { classNames } from '../utils';

export interface DragHandleProps {
  className?: string;
  size?: 'small' | 'default' | 'large';
  disabled?: boolean;
  style?: React.CSSProperties;
}

export function DragHandle({
  className,
  size = 'default',
  disabled = false,
  style,
}: DragHandleProps) {
  const sizeMap = {
    small: 'h-3 w-3',
    default: 'h-4 w-4',
    large: 'h-5 w-5',
  };

  return (
    <div
      className={classNames(
        'inline-flex items-center justify-center p-1 rounded cursor-grab active:cursor-grabbing transition-colors',
        disabled
          ? 'text-gray-300 cursor-not-allowed'
          : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300',
        className
      )}
      style={style}
    >
      <GripVertical className={classNames(sizeMap[size])} />
    </div>
  );
}
