import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { generateThreadId } from "./utils";

export const createThread = mutation({
  args: {
    id: v.string(),
    title: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("threads", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      pinned: false,
    });
  },
});

export const getForCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      return null;
    }

    return await ctx.db
      .query("threads")
      .filter((q) => q.eq(q.field("userId"), identity?.subject))
      .collect();
  },
});

export const getThreadById = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("threads")
      .filter((q) => q.eq(q.field("id"), args.id))
      .first();
  },
});

export const deleteAllThreadsForUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const threadsToDelete = await ctx.db
      .query("threads")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .collect();

    // Delete associated messages first
    for (const thread of threadsToDelete) {
      const messages = await ctx.db
        .query("messages")
        .filter((q) => q.eq(q.field("threadId"), thread.id))
        .collect();
      
      for (const message of messages) {
        await ctx.db.delete(message._id);
      }

      // Delete associated streams
      const streams = await ctx.db
        .query("streams")
        .filter((q) => q.eq(q.field("threadId"), thread.id))
        .collect();
      
      for (const stream of streams) {
        await ctx.db.delete(stream._id);
      }
    }

    // Delete threads
    for (const thread of threadsToDelete) {
      await ctx.db.delete(thread._id);
    }

    return threadsToDelete.length;
  },
});
