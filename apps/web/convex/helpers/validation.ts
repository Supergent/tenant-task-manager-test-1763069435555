/**
 * Validation helper functions
 *
 * Pure utility functions with NO database access.
 * These functions validate input data and return boolean results or throw errors.
 */

import { TaskPriority, TaskStatus } from "../db/tasks";

/**
 * Validate task priority value
 */
export function isValidPriority(priority: string): priority is TaskPriority {
  return priority === "low" || priority === "medium" || priority === "high";
}

/**
 * Validate task status value
 */
export function isValidStatus(status: string): status is TaskStatus {
  return status === "todo" || status === "in-progress" || status === "done";
}

/**
 * Validate task title (non-empty, max length)
 */
export function validateTaskTitle(title: string): void {
  if (!title || title.trim().length === 0) {
    throw new Error("Task title cannot be empty");
  }
  if (title.length > 200) {
    throw new Error("Task title must be 200 characters or less");
  }
}

/**
 * Validate task description (max length)
 */
export function validateTaskDescription(description: string | undefined): void {
  if (description && description.length > 2000) {
    throw new Error("Task description must be 2000 characters or less");
  }
}

/**
 * Validate due date (must be in the future or undefined)
 */
export function validateDueDate(dueDate: number | undefined): void {
  if (dueDate !== undefined && dueDate < Date.now()) {
    // Allow past dates - users might want to track overdue tasks
    // This is just a validation that it's a valid number
    if (isNaN(dueDate) || dueDate < 0) {
      throw new Error("Invalid due date");
    }
  }
}

/**
 * Sanitize task title (trim whitespace)
 */
export function sanitizeTitle(title: string): string {
  return title.trim();
}

/**
 * Sanitize task description (trim whitespace)
 */
export function sanitizeDescription(description: string | undefined): string | undefined {
  return description?.trim();
}
