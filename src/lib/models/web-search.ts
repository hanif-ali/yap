import { tool } from "ai";
import { z } from "zod";

import Exa from "exa-js";

// little hacky but it's fine
const SEARCH_ENABLED = Boolean(process.env.EXA_API_KEY);
const exa = SEARCH_ENABLED ? new Exa(process.env.EXA_API_KEY) : null;

export const webSearch = tool({
  description: "Search the web for up-to-date information",
  parameters: z.object({
    query: z.string().min(1).max(100).describe("The search query"),
  }),
  execute: async ({ query }) => {
    if (!exa) {
      return [];
    }

    const { results } = await exa.searchAndContents(query, {
      livecrawl: "always",
      numResults: 10,
    });
    return results.map((result) => ({
      title: result.title,
      url: result.url,
      content: result.text.slice(0, 1000), // take just the first 1000 characters
      publishedDate: result.publishedDate,
    }));
  },
});
