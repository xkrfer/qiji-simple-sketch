import { clsx, type ClassValue } from 'clsx';
import copy from 'copy-to-clipboard';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseUrl() {
  return '';
}

export function copyText(text: string) {
  copy(text);
  toast.success('复制成功');
}

export function encodeBase64(text: string) {
  return btoa(text);
}
