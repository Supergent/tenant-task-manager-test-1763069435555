/**
 * Formatting helper functions
 *
 * Pure utility functions for formatting dates, priorities, and statuses.
 */

import { TaskPriority, TaskStatus } from "../db/tasks";

/**
 * Format priority for display
 */
export function formatPriority(priority: TaskPriority): string {
  const formats: Record<TaskPriority, string> = {
    low: "Low",
    medium: "Medium",
    high: "High",
  };
  return formats[priority];
}

/**
 * Format status for display
 */
export function formatStatus(status: TaskStatus): string {
  const formats: Record<TaskStatus, string> = {
    todo: "To Do",
    "in-progress": "In Progress",
    done: "Done",
  };
  return formats[status];
}

/**
 * Get priority color class
 */
export function getPriorityColor(priority: TaskPriority): string {
  const colors: Record<TaskPriority, string> = {
    low: "green",
    medium: "yellow",
    high: "red",
  };
  return colors[priority];
}

/**
 * Get status color class
 */
export function getStatusColor(status: TaskStatus): string {
  const colors: Record<TaskStatus, string> = {
    todo: "gray",
    "in-progress": "blue",
    done: "green",
  };
  return colors[status];
}

/**
 * Check if a task is overdue
 */
export function isOverdue(dueDate: number | undefined): boolean {
  if (!dueDate) return false;
  return dueDate < Date.now();
}

/**
 * Sort tasks by priority (high -> medium -> low)
 */
export function comparePriority(a: TaskPriority, b: TaskPriority): number {
  const priorityOrder: Record<TaskPriority, number> = {
    high: 3,
    medium: 2,
    low: 1,
  };
  return priorityOrder[b] - priorityOrder[a];
}
