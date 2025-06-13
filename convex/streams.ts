import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { generateStreamId } from "./utils";

export const createStream = mutation({
  args: {
    id: v.string(),
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("streams", {
      id: args.id,
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

export const getStreamIdsByThreadId = query({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    const streams = await ctx.db
      .query("streams")
      .filter((q) => q.eq(q.field("threadId"), args.threadId))
      .collect();
    return streams.map((stream) => stream.id);
  },
});
