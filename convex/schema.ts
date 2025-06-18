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
    id: v.string(),
    userId: v.string(),
    title: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    pinned: v.boolean(),
  })
    .index("by_thread_id", ["id"])
    .index("by_user", ["userId"])
    .index("by_userId_and_updatedAt", ["userId", "updatedAt"])
    .index("by_user_and_pinned", ["userId", "pinned"])
    .searchIndex("search_title", {
      searchField: "title",
    }),

  messages: defineTable({
    id: v.string(),
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
    attachments: v.array(
      v.object({
        id: v.string(),
        url: v.string(),
        contentType: v.string(),
      })
    ),
    parts: v.array(v.any()),
  })
    .index("by_message_id", ["id"])
    .index("by_threadId", ["threadId"])
    .index("by_thread_and_userId", ["threadId", "userId"])
    .index("by_user", ["userId"]),

  streams: defineTable({
    id: v.string(),
    threadId: v.string(),
    createdAt: v.number(),
  })
    .index("by_stream_id", ["id"])
    .index("by_threadId", ["threadId"])
    .index("by_thread_and_createdAt", ["threadId", "createdAt"]),

  attachments: defineTable({
    userId: v.string(),
    attachmentType: v.string(),
    fileName: v.string(),
    mimeType: v.string(),
    fileSize: v.number(),
    status: v.optional(v.union(v.literal("deleted"), v.literal("uploaded"))),
  }).index("by_userId", ["userId"]),

  documents: defineTable({
    id: v.string(),
    title: v.string(),
    content: v.optional(v.string()),
    kind: v.union(
      v.literal("text"),
      v.literal("code"),
      v.literal("image"),
      v.literal("sheet")
    ),
    userId: v.string(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  userConfigs: defineTable({
    // This is either clerk ID or anonymous ID (ehhhhhh, don't feel too good about this as it risks getting inconsistent with isAnonymous)
    userId: v.string(),
    fullName: v.string(),
    email: v.string(),
    isAnonymous: v.boolean(),
    openRouterKey: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),
});
