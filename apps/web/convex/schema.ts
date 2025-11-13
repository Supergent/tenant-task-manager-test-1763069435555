import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/better-auth/convex";

/**
 * Database schema for the task management application
 *
 * Tables:
 * - tasks: User-specific tasks with title, description, due date, priority, and status
 * - authTables: Better Auth tables for user authentication
 */
export default defineSchema({
  ...authTables,

  tasks: defineTable({
    // Task fields
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.optional(v.number()), // Unix timestamp in milliseconds
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    ),
    status: v.union(
      v.literal("todo"),
      v.literal("in-progress"),
      v.literal("done")
    ),

    // User isolation - each task belongs to one user
    userId: v.string(),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    // Index by userId for efficient user-specific queries
    .index("by_user_id", ["userId"])
    // Compound index for filtering by user and status
    .index("by_user_and_status", ["userId", "status"])
    // Compound index for filtering by user and priority
    .index("by_user_and_priority", ["userId", "priority"])
    // Compound index for sorting by user and due date
    .index("by_user_and_due_date", ["userId", "dueDate"])
    // Compound index for created date sorting
    .index("by_user_and_created", ["userId", "createdAt"]),
});
