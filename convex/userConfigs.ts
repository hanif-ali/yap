import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUserConfig = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const config = await ctx.db
      .query("userConfigs")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .first();

    return config;
  },
});

export const updateUserConfig = mutation({
  args: {
    openRouterKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existingConfig = await ctx.db
      .query("userConfigs")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .first();

    if (!existingConfig) {
      throw new Error("User config not found");
    }

    return await ctx.db.patch(existingConfig._id, {
      ...args,
      updatedAt: Date.now(),
    });
  },
});

export const getOrCreateUserConfig = mutation({
  args: {
    anonId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity) {
      const existingConfig = await ctx.db
        .query("userConfigs")
        .filter((q) => q.eq(q.field("userId"), identity.subject))
        .first();
      console.log({ existingConfig });

      if (existingConfig) {
        return existingConfig;
      }

      const newUserConfig = await ctx.db.insert("userConfigs", {
        userId: identity.subject,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isAnonymous: false,
      });

      return await ctx.db.get(newUserConfig);
    }

    const existingConfig = await ctx.db
      .query("userConfigs")
      .filter((q) => q.eq(q.field("userId"), args.anonId))
      .first();

    if (existingConfig) {
      return existingConfig;
    }

    const newAnonUserConfig = await ctx.db.insert("userConfigs", {
      userId: args.anonId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isAnonymous: true,
    });

    return await ctx.db.get(newAnonUserConfig);
  },
});
