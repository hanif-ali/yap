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
  tools: boolean;
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
    inputCapabilities: ["text", "image"],
    enabled: true,
    byok: false,
    reasoning: false,
    tools: true,
  },
  {
    provider: "google",
    key: "gemini-2.5-pro-preview-03-25",
    name: "Gemini 2.5 Pro",
    shortName: "Gemini 2.5 Pro",
    description: "Gemini 2.5 Pro is a powerful model for advanced tasks.",
    inputCapabilities: ["text", "image"],
    enabled: true,
    byok: false,
    reasoning: false,
    tools: true,
  },
  {
    provider: "google",
    key: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    shortName: "Gemini 2.0 Flash",
    description:
      "Gemini 2.0 Flash is a fast, efficient model for a variety of tasks.",
    inputCapabilities: ["text", "image"],
    enabled: true,
    byok: false,
    reasoning: false,
    tools: true,
  },
  {
    provider: "google",
    key: "gemini-2.0-flash-lite",
    name: "Gemini 2.0 Flash Lite",
    shortName: "Gemini 2.0 Flash Lite",
    description:
      "Gemini 2.0 Flash Lite is a lightweight model for quick tasks.",
    inputCapabilities: ["text", "image"],
    enabled: true,
    byok: false,
    reasoning: false,
    tools: true,
  },
  {
    provider: "x-ai",
    key: "grok-3",
    name: "Grok 3",
    shortName: "Grok 3",
    description:
      "Grok 3 is a model for advanced reasoning and text generation.",
    inputCapabilities: ["text"],
    enabled: true,
    byok: false,
    reasoning: true,
    tools: true,
  },
  {
    provider: "x-ai",
    key: "grok-3-mini",
    name: "Grok 3 Mini",
    shortName: "Grok 3 Mini",
    description: "Grok 3 Mini is a compact version for quick tasks.",
    inputCapabilities: ["text"],
    enabled: true,
    byok: false,
    reasoning: false,
    tools: true,
  },
];

export const openRouterModelDefinitions: ModelDefinition[] =
  openRouterModels.map((model) => ({
    ...model,
    inputCapabilities: model.inputCapabilities as Array<
      "text" | "file" | "image"
    >,
  }));

export const modelDefinitions = freeModelDefinitions.concat(
  openRouterModelDefinitions
);

const modelProviders = {
  google: (modelKey: string) => google(modelKey),
  xai: (modelKey: string) => xai(modelKey),
  openrouter: (apiKey: string) => createOpenRouter({ apiKey }),
};

export const getModelDefinition = (modelKey: string) => {
  return modelDefinitions.find((model) => model.key === modelKey);
};

export const getModelInstance = (
  modelDefinition: ModelDefinition,
  userConfig: Doc<"userConfigs">
) => {
  if (modelDefinition.byok) {
    if (!userConfig.openRouterKey) {
      throw new Error("OpenRouter key not found");
    }
    const openrouter = createOpenRouter({ apiKey: userConfig.openRouterKey });
    return openrouter(modelDefinition.key);
  }

  return modelProviders[
    modelDefinition.provider as keyof typeof modelProviders
  ](modelDefinition.key);
};

export const modelKeys = freeModelDefinitions
  .map((model) => model.key)
  .concat(openRouterModelDefinitions.map((model) => model.key));
