import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { generateStreamId } from "./utils";

export const createStream = mutation({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    const streamId = generateStreamId();
    return await ctx.db.insert("streams", {
      id: streamId,
      threadId: args.threadId,
      createdAt: Date.now(),
    });
  },
});

export const getStreamById = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("streams")
      .filter((q) => q.eq(q.field("id"), args.id))
      .first();
  },
});

export const getStreamsForThread = query({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("streams")
      .filter((q) => q.eq(q.field("threadId"), args.threadId))
      .collect();
  },
});
