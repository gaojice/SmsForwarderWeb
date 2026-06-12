import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(timestamp: number | string): string {
  const date = new Date(typeof timestamp === "string" ? Number(timestamp) : timestamp);
  if (isNaN(date.getTime())) return String(timestamp);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatRelativeTime(timestamp: number | string): string {
  const date = new Date(typeof timestamp === "string" ? Number(timestamp) : timestamp);
  if (isNaN(date.getTime())) return String(timestamp);
  const now = Date.now();
  const diff = now - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return formatDate(timestamp);
}

export function formatDuration(seconds: number): string {
  if (seconds <= 0) return "0s";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

export function formatSmsCount(content: string): { count: number; total: number } {
  if (content.length <= 70) return { count: 1, total: 70 - content.length };
  const remaining = 390 - content.length;
  const extra = Math.ceil((content.length - 70) / 64);
  return { count: 1 + extra, total: remaining };
}
