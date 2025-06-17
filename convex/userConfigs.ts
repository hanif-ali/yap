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

export const createUserConfig = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if config already exists
    const existingConfig = await ctx.db
      .query("userConfigs")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .first();

    if (existingConfig) {
      return existingConfig;
    }

    const configId = await ctx.db.insert("userConfigs", {
      userId: identity.subject,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return await ctx.db.get(configId);
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

    if (existingConfig) {
      return await ctx.db.patch(existingConfig._id, {
        ...args,
        updatedAt: Date.now(),
      });
    } else {
      return await ctx.db.insert("userConfigs", {
        userId: identity.subject,
        ...args,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});

export const deleteOpenRouterKey = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existingConfig = await ctx.db
      .query("userConfigs")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .first();

    if (existingConfig) {
      return await ctx.db.patch(existingConfig._id, {
        openRouterKey: undefined,
        updatedAt: Date.now(),
      });
    }
  },
}); 