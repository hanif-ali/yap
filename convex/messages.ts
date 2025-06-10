import { v } from "convex/values";
import { query } from "./_generated/server";

export const getForThread = query({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("threadId"), args.threadId))
      .collect();
  },
});
