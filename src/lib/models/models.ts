import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";

export type ModelDefinition = {
  provider: "google" | "openai";
  key: string;
  name: string;
  description: string;
  getProvider: () => any;
  capabilities: Array<"web" | "reasoning" | "image" | "text">;
};

export const models: ModelDefinition[] = [
  {
    provider: "google",
    key: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    description:
      "Gemini 2.5 Flash is a powerful model that can handle complex tasks and provide accurate results.",
    getProvider: () => google("gemini-2.5-flash"),
    capabilities: ["text", "image", "web"],
  },
  {
    provider: "google",
    key: "gemini-2.0-flash-lite",
    name: "Gemini 2.0 Flash Lite",
    description:
      "Gemini 2.0 Flash Lite is a powerful model that can handle complex tasks and provide accurate results.",
    getProvider: () => google("gemini-2.0-flash-lite"),
    capabilities: ["text", "image"],
  },
  {
    provider: "openai",
    key: "gpt-4o-mini",
    name: "GPT-4o Mini",
    description:
      "GPT-4o Mini is a powerful model that can handle complex tasks and provide accurate results.",
    getProvider: () => openai("gpt-4o-mini"),
    capabilities: ["text"],
  },
];
