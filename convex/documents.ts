import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getDocumentById = query({
  args: {
    id: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.id) return null;

    return await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("id"), args.id))
      .first();
  },
});

export const saveDocument = mutation({
  args: {
    id: v.string(),
    title: v.string(),
    content: v.optional(v.string()),
    kind: v.union(
      v.literal("text"),
      v.literal("code"),
      v.literal("image"),
      v.literal("sheet")
    ),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("documents", {
      ...args,
      updatedAt: Date.now(),
    });
  },
});

export const updateDocument = mutation({
  args: {
    id: v.string(),
    title: v.string(),
    content: v.optional(v.string()),
    kind: v.union(
      v.literal("text"),
      v.literal("code"),
      v.literal("image"),
      v.literal("sheet")
    ),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("id"), args.id))
      .first();

    if (!document) {
      throw new Error("Document not found");
    }

    await ctx.db.patch(document._id, {
      ...args,
      updatedAt: Date.now(),
    });
  },
});
