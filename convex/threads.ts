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
