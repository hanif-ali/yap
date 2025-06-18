import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getMessagesForThread = query({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const thread = await ctx.db
      .query("threads")
      .filter((q) => q.eq(q.field("id"), args.threadId))
      .first();

    // not a new thread, not public, and not the owner
    if (thread && !thread.public && thread.userId !== identity?.subject) {
      throw new Error("Unauthorized");
    }

    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("threadId"), args.threadId))
      .filter((q) => q.neq(q.field("role"), "system"))
      .collect();
  },
});

export const saveMessage = mutation({
  args: {
    message: v.object({
      id: v.string(),
      userId: v.string(),
      threadId: v.string(),
      role: v.union(
        v.literal("user"),
        v.literal("assistant"),
        v.literal("system")
      ),
      content: v.string(),
      attachments: v.array(
        v.object({
          id: v.string(),
          url: v.string(),
          contentType: v.string(),
        })
      ),
      parts: v.array(v.any()),
      free: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    const thread = await ctx.db
      .query("threads")
      .filter((q) => q.eq(q.field("id"), args.message.threadId))
      .first();

    if (!thread || thread.userId !== args.message.userId) {
      throw new Error("Unauthorized");
    }

    // TODO don't allow saving messages to other users' threads

    return await ctx.db.insert("messages", {
      ...args.message,
      createdAt: Date.now(),
      status: "done",
    });
  },
});

export const updateMessage = mutation({
  args: {
    message: v.object({
      id: v.string(),
      content: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("id"), args.message.id))
      .first();

    if (!message) {
      throw new Error("Message not found");
    }

    return await ctx.db.patch(message._id, {
      content: args.message.content,
      updatedAt: Date.now(),
    });
  },
});

export const getMessageById = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("id"), args.id))
      .first();
  },
});

export const todaysMessagesCount = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Count messages since 12AM for the given userId
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.eq(q.field("role"), "user"))
      .filter((q) => q.gte(q.field("_creationTime"), midnight.getTime()))
      .filter((q) => q.eq(q.field("free"), true))
      .collect()
      .then((messages) => messages.length);
  },
});
