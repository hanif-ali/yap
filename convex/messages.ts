import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { generateMessageId } from "./utils";

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
      id: v.string(),
      threadId: v.string(),
      role: v.union(
        v.literal("user"),
        v.literal("assistant"),
        v.literal("system")
      ),
      content: v.string(),
      attachments: v.array(v.id("attachments")),
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
