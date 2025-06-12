import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getMessagesForThread = query({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
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
      threadId: v.string(),
      role: v.union(
        v.literal("user"),
        v.literal("assistant"),
        v.literal("system")
      ),
      content: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    // todo fix auth
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) {
    // todo: proper error handling
    //   throw new Error("Unauthorized");
    // }

    return await ctx.db.insert("messages", {
      ...args.message,
      // userId: identity.subject,
      userId: "user_2yHSwopd8ipZW4Ndz7g2zFeLKzi",
      createdAt: Date.now(),
      status: "done",
    });
  },
});

export const updateMessage = mutation({
  args: {
    message: v.object({
      id: v.id("messages"),
      content: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.message.id, {
      content: args.message.content,
    });
  },
});
