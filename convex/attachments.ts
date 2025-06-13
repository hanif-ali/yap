import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createAttachment = mutation({
  args: {
    userId: v.string(),
    attachmentType: v.string(),
    fileName: v.string(),
    mimeType: v.string(),
    fileSize: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("attachments", args);
  },
});
