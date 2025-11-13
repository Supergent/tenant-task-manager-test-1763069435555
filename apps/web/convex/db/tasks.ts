/**
 * Database layer for tasks table
 *
 * This is the ONLY file that should use ctx.db for tasks operations.
 * All other layers should import from this file.
 */

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in-progress" | "done";

export interface CreateTaskArgs {
  title: string;
  description?: string;
  dueDate?: number;
  priority: TaskPriority;
  status: TaskStatus;
  userId: string;
}

export interface UpdateTaskArgs {
  title?: string;
  description?: string;
  dueDate?: number;
  priority?: TaskPriority;
  status?: TaskStatus;
}

/**
 * Create a new task
 */
export async function createTask(ctx: MutationCtx, args: CreateTaskArgs) {
  const now = Date.now();
  return await ctx.db.insert("tasks", {
    ...args,
    createdAt: now,
    updatedAt: now,
  });
}

/**
 * Get a task by ID
 */
export async function getTaskById(ctx: QueryCtx, taskId: Id<"tasks">) {
  return await ctx.db.get(taskId);
}

/**
 * Get all tasks for a specific user
 */
export async function getTasksByUserId(ctx: QueryCtx, userId: string) {
  return await ctx.db
    .query("tasks")
    .withIndex("by_user_id", (q) => q.eq("userId", userId))
    .order("desc")
    .collect();
}

/**
 * Get tasks by user and status
 */
export async function getTasksByUserAndStatus(
  ctx: QueryCtx,
  userId: string,
  status: TaskStatus
) {
  return await ctx.db
    .query("tasks")
    .withIndex("by_user_and_status", (q) =>
      q.eq("userId", userId).eq("status", status)
    )
    .order("desc")
    .collect();
}

/**
 * Get tasks by user and priority
 */
export async function getTasksByUserAndPriority(
  ctx: QueryCtx,
  userId: string,
  priority: TaskPriority
) {
  return await ctx.db
    .query("tasks")
    .withIndex("by_user_and_priority", (q) =>
      q.eq("userId", userId).eq("priority", priority)
    )
    .order("desc")
    .collect();
}

/**
 * Get tasks by user, sorted by due date
 */
export async function getTasksByUserSortedByDueDate(
  ctx: QueryCtx,
  userId: string
) {
  return await ctx.db
    .query("tasks")
    .withIndex("by_user_and_due_date", (q) => q.eq("userId", userId))
    .order("asc")
    .collect();
}

/**
 * Update a task
 */
export async function updateTask(
  ctx: MutationCtx,
  taskId: Id<"tasks">,
  updates: UpdateTaskArgs
) {
  await ctx.db.patch(taskId, {
    ...updates,
    updatedAt: Date.now(),
  });
}

/**
 * Delete a task
 */
export async function deleteTask(ctx: MutationCtx, taskId: Id<"tasks">) {
  await ctx.db.delete(taskId);
}

/**
 * Mark a task as complete (set status to "done")
 */
export async function markTaskComplete(ctx: MutationCtx, taskId: Id<"tasks">) {
  await ctx.db.patch(taskId, {
    status: "done",
    updatedAt: Date.now(),
  });
}
