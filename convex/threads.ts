import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createThread = mutation({
  args: {
    id: v.id("threads"),
    title: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("threads", {
      userId: args.userId,
      title: args.title,
    });
  },
});

export const getForCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      return [];
    }

    return await ctx.db
      .query("threads")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
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
      .filter((q) => q.eq(q.field("_id"), args.id))
      .first();
  },
});
