import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createStream = mutation({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("streams", {
      threadId: args.threadId,
      createdAt: Date.now(),
    });
  },
});
