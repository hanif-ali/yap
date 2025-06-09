import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const MessageStatusValidator = v.union(
  v.literal("waiting"),
  v.literal("thinking"),
  v.literal("streaming"),
  v.literal("done"),
  v.literal("error"),
  v.literal("error.rejected"),
  v.literal("deleted")
);

export default defineSchema({
  threads: defineTable({
    userId: v.string(),
    title: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    pinned: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_userId_and_updatedAt", ["userId", "updatedAt"])
    .index("by_user_and_pinned", ["userId", "pinned"])
    .searchIndex("search_title", {
      searchField: "title",
    }),

  messages: defineTable({
    threadId: v.string(),
    userId: v.string(),
    content: v.string(),
    status: MessageStatusValidator,
    updatedAt: v.optional(v.number()),
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system")
    ),
    createdAt: v.number(),
  })
    .index("by_threadId", ["threadId"])
    .index("by_thread_and_userId", ["threadId", "userId"])
    .index("by_user", ["userId"]),
});
