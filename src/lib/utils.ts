import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number) {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");

  return `${hrs}:${mins}:${secs}`;
}

export function formatDuration(ms: number): string {
  const totalSecs = Math.floor(ms / 1000);
  const hrs = Math.floor(totalSecs / 3600)
    .toString()
    .padStart(2, "0");
  const mins = Math.floor((totalSecs % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const secs = (totalSecs % 60).toString().padStart(2, "0");

  return `${hrs}:${mins}:${secs}`;
}
