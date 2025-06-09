import { query } from "./_generated/server";

export const getForCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      return [];
    }

    return await ctx.db
      .query("threads")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .collect();
  },
});
