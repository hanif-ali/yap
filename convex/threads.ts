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
    const identity = await ctx.auth.getUserIdentity();

    const user = await ctx.db
      .query("userConfigs")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    if (identity && user.isAnonymous) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.insert("threads", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      pinned: false,
      public: user.isAnonymous,
    });
  },
});

export const getForCurrentUser = query({
  args: { anonId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    // for signed out users
    if (identity === null) {
      return await ctx.db
        .query("threads")
        .filter((q) => q.eq(q.field("userId"), args.anonId))
        .filter((q) => q.eq(q.field("public"), true))
        .collect();
    }

    // for signed in users
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
    const identity = await ctx.auth.getUserIdentity();

    const thread = await ctx.db
      .query("threads")
      .filter((q) => q.eq(q.field("id"), args.id))
      .first();

    // Private threads can only be accessed by the user who creted them
    if (thread && !thread.public && thread.userId !== identity?.subject) {
      return null;
    }

    return thread;
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

export const setThreadVisibility = mutation({
  args: {
    id: v.string(),
    public: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const thread = await ctx.db
      .query("threads")
      .filter((q) => q.eq(q.field("id"), args.id))
      .first();

    if (!thread || !identity || thread.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(thread._id, {
      public: args.public,
    });

    return thread;
  },
});
