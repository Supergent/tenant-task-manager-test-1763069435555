/**
 * Task endpoints with business logic and authentication
 *
 * This layer composes database operations and enforces business rules.
 * NEVER use ctx.db directly - always import from ../db
 */

import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { requireAuth } from "../auth";
import * as Tasks from "../db/tasks";
import {
  validateTaskTitle,
  validateTaskDescription,
  validateDueDate,
  sanitizeTitle,
  sanitizeDescription,
} from "../helpers/validation";

/**
 * Create a new task
 */
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    status: v.optional(
      v.union(
        v.literal("todo"),
        v.literal("in-progress"),
        v.literal("done")
      )
    ),
  },
  handler: async (ctx, args) => {
    // Authenticate user
    const userId = await requireAuth(ctx);

    // Validate and sanitize input
    const title = sanitizeTitle(args.title);
    const description = sanitizeDescription(args.description);

    validateTaskTitle(title);
    validateTaskDescription(description);
    validateDueDate(args.dueDate);

    // Create task
    const taskId = await Tasks.createTask(ctx, {
      title,
      description,
      dueDate: args.dueDate,
      priority: args.priority,
      status: args.status ?? "todo", // Default to "todo"
      userId,
    });

    return taskId;
  },
});

/**
 * Get all tasks for the current user
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    return await Tasks.getTasksByUserId(ctx, userId);
  },
});

/**
 * Get tasks filtered by status
 */
export const listByStatus = query({
  args: {
    status: v.union(
      v.literal("todo"),
      v.literal("in-progress"),
      v.literal("done")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    return await Tasks.getTasksByUserAndStatus(ctx, userId, args.status);
  },
});

/**
 * Get tasks filtered by priority
 */
export const listByPriority = query({
  args: {
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    return await Tasks.getTasksByUserAndPriority(ctx, userId, args.priority);
  },
});

/**
 * Get tasks sorted by due date
 */
export const listByDueDate = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    return await Tasks.getTasksByUserSortedByDueDate(ctx, userId);
  },
});

/**
 * Get a single task by ID
 */
export const get = query({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    // Get task
    const task = await Tasks.getTaskById(ctx, args.taskId);

    // Check if task exists
    if (!task) {
      throw new Error("Task not found");
    }

    // Verify ownership
    if (task.userId !== userId) {
      throw new Error("Unauthorized: You can only view your own tasks");
    }

    return task;
  },
});

/**
 * Update a task
 */
export const update = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    priority: v.optional(
      v.union(v.literal("low"), v.literal("medium"), v.literal("high"))
    ),
    status: v.optional(
      v.union(
        v.literal("todo"),
        v.literal("in-progress"),
        v.literal("done")
      )
    ),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    // Get task to verify ownership
    const task = await Tasks.getTaskById(ctx, args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }
    if (task.userId !== userId) {
      throw new Error("Unauthorized: You can only update your own tasks");
    }

    // Prepare updates
    const updates: Tasks.UpdateTaskArgs = {};

    if (args.title !== undefined) {
      const title = sanitizeTitle(args.title);
      validateTaskTitle(title);
      updates.title = title;
    }

    if (args.description !== undefined) {
      const description = sanitizeDescription(args.description);
      validateTaskDescription(description);
      updates.description = description;
    }

    if (args.dueDate !== undefined) {
      validateDueDate(args.dueDate);
      updates.dueDate = args.dueDate;
    }

    if (args.priority !== undefined) {
      updates.priority = args.priority;
    }

    if (args.status !== undefined) {
      updates.status = args.status;
    }

    // Update task
    await Tasks.updateTask(ctx, args.taskId, updates);
  },
});

/**
 * Mark a task as complete
 */
export const markComplete = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    // Get task to verify ownership
    const task = await Tasks.getTaskById(ctx, args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }
    if (task.userId !== userId) {
      throw new Error("Unauthorized: You can only update your own tasks");
    }

    // Mark as complete
    await Tasks.markTaskComplete(ctx, args.taskId);
  },
});

/**
 * Delete a task
 */
export const remove = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    // Get task to verify ownership
    const task = await Tasks.getTaskById(ctx, args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }
    if (task.userId !== userId) {
      throw new Error("Unauthorized: You can only delete your own tasks");
    }

    // Delete task
    await Tasks.deleteTask(ctx, args.taskId);
  },
});
