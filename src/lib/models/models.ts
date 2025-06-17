import { google } from "@ai-sdk/google";
import { xai } from "@ai-sdk/xai";
import openRouterModels from "./open-router-models.json";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { Doc } from "../../../convex/_generated/dataModel";

export type ModelDefinition = {
  provider: string;
  key: string;
  name: string;
  shortName: string;
  description: string;
  inputCapabilities: Array<"text" | "file" | "image">;
  reasoning: boolean;
  getModelInstance: (userConfig: Doc<"userConfigs">) => any;
  enabled: boolean;
  byok: boolean;
};

export const freeModelDefinitions: ModelDefinition[] = [
  {
    provider: "google",
    key: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    shortName: "Gemini 2.5 Flash",
    description:
      "Gemini 2.5 Flash is a powerful model that can handle complex tasks and provide accurate results.",
    getModelInstance: () => google("gemini-2.5-flash"),
    inputCapabilities: ["text", "image"],
    enabled: true,
    byok: false,
    reasoning: false,
  },
  {
    provider: "google",
    key: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    shortName: "Gemini 2.5 Pro",
    description: "Gemini 2.5 Pro is a powerful model for advanced tasks.",
    getModelInstance: () => google("gemini-2.5-pro"),
    inputCapabilities: ["text", "image"],
    enabled: true,
    byok: false,
    reasoning: false,
  },
  {
    provider: "google",
    key: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    shortName: "Gemini 2.0 Flash",
    description:
      "Gemini 2.0 Flash is a fast, efficient model for a variety of tasks.",
    getModelInstance: () => google("gemini-2.0-flash"),
    inputCapabilities: ["text", "image"],
    enabled: true,
    byok: false,
    reasoning: false,
  },
  {
    provider: "google",
    key: "gemini-2.0-flash-lite",
    name: "Gemini 2.0 Flash Lite",
    shortName: "Gemini 2.0 Flash Lite",
    description:
      "Gemini 2.0 Flash Lite is a lightweight model for quick tasks.",
    getModelInstance: () => google("gemini-2.0-flash-lite"),
    inputCapabilities: ["text", "image"],
    enabled: true,
    byok: false,
    reasoning: false,
  },
  {
    provider: "google",
    key: "gemini-2.5-flash-thinking",
    name: "Gemini 2.5 Flash (Thinking)",
    shortName: "Gemini 2.5 Flash (Thinking)",
    description:
      "Gemini 2.5 Flash (Thinking) is optimized for reasoning tasks.",
    getModelInstance: () => google("gemini-2.5-flash-thinking"),
    inputCapabilities: ["text"],
    enabled: true,
    byok: false,
    reasoning: true,
  },
  {
    provider: "xai",
    key: "grok-3",
    name: "Grok 3",
    shortName: "Grok 3",
    description:
      "Grok 3 is a model for advanced reasoning and text generation.",
    getModelInstance: () => xai("grok-3"),
    inputCapabilities: ["text"],
    enabled: true,
    byok: false,
    reasoning: true,
  },
  {
    provider: "xai",
    key: "grok-3-mini",
    name: "Grok 3 Mini",
    shortName: "Grok 3 Mini",
    description: "Grok 3 Mini is a compact version for quick tasks.",
    getModelInstance: () => xai("grok-3-mini"),
    inputCapabilities: ["text"],
    enabled: true,
    byok: false,
    reasoning: false,
  },
];

export const openRouterModelDefinitions: ModelDefinition[] =
  openRouterModels.map((model) => {
    return {
      ...model,
      inputCapabilities: model.inputCapabilities as Array<
        "text" | "file" | "image"
      >,
      getModelInstance: (userConfig: Doc<"userConfigs">) => {
        if (!userConfig.openRouterKey) {
          throw new Error("OpenRouter key not found");
        }
        return createOpenRouter({ apiKey: userConfig.openRouterKey });
      },
    };
  });

export const modelDefinitions = freeModelDefinitions.concat(
  openRouterModelDefinitions
);

export const getModelInstance = (
  modelKey: string,
  userConfig: Doc<"userConfigs">
) => {
  const model =
    freeModelDefinitions.find((model) => model.key === modelKey) ||
    openRouterModelDefinitions.find((model) => model.key === modelKey);

  if (!model) {
    throw new Error(`Model ${modelKey} not found`);
  }

  return model.getModelInstance(userConfig);
};

export const modelKeys = freeModelDefinitions
  .map((model) => model.key)
  .concat(openRouterModelDefinitions.map((model) => model.key));
