import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { groq } from "@ai-sdk/groq";
import { deepseek } from "@ai-sdk/deepseek";
import { fireworks } from "@ai-sdk/fireworks";
import { mistral } from "@ai-sdk/mistral";
import { cohere } from "@ai-sdk/cohere";
import { deepinfra } from "@ai-sdk/deepinfra";
import { togetherai } from "@ai-sdk/togetherai";
import { xai } from "@ai-sdk/xai";

export type ModelDefinition = {
  provider:
    | "google"
    | "openai"
    | "anthropic"
    | "groq"
    | "deepseek"
    | "fireworks"
    | "mistral"
    | "cohere"
    | "deepinfra"
    | "togetherai"
    | "xai"
    | "qwen";

  key: string;
  name: string;
  description: string;
  getModelInstance: () => any;
  capabilities: Array<"web" | "reasoning" | "image" | "text">;
  allowed: boolean;
};

export const models: ModelDefinition[] = [
  // Google models (allowed)
  {
    provider: "google",
    key: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    description:
      "Gemini 2.5 Flash is a powerful model that can handle complex tasks and provide accurate results.",
    getModelInstance: () => google("gemini-2.5-flash"),
    capabilities: ["text", "image", "web"],
    allowed: true,
  },
  {
    provider: "google",
    key: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    description: "Gemini 2.5 Pro is a powerful model for advanced tasks.",
    getModelInstance: () => google("gemini-2.5-pro"),
    capabilities: ["text", "image", "web"],
    allowed: true,
  },
  {
    provider: "google",
    key: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    description:
      "Gemini 2.0 Flash is a fast, efficient model for a variety of tasks.",
    getModelInstance: () => google("gemini-2.0-flash"),
    capabilities: ["text", "image"],
    allowed: true,
  },
  {
    provider: "google",
    key: "gemini-2.0-flash-lite",
    name: "Gemini 2.0 Flash Lite",
    description:
      "Gemini 2.0 Flash Lite is a lightweight model for quick tasks.",
    getModelInstance: () => google("gemini-2.0-flash-lite"),
    capabilities: ["text", "image"],
    allowed: true,
  },
  {
    provider: "google",
    key: "gemini-2.5-flash-thinking",
    name: "Gemini 2.5 Flash (Thinking)",
    description:
      "Gemini 2.5 Flash (Thinking) is optimized for reasoning tasks.",
    getModelInstance: () => google("gemini-2.5-flash-thinking"),
    capabilities: ["text", "reasoning", "web"],
    allowed: true,
  },
  // OpenAI models (allowed)
  {
    provider: "openai",
    key: "gpt-4o-mini",
    name: "GPT-4o Mini",
    description:
      "GPT-4o Mini is a powerful model that can handle complex tasks and provide accurate results.",
    getModelInstance: () => openai("gpt-4o-mini"),
    capabilities: ["text"],
    allowed: true,
  },
  {
    provider: "openai",
    key: "gpt-4o",
    name: "GPT-4o",
    description:
      "GPT-4o is OpenAI's flagship model for advanced reasoning and text generation.",
    getModelInstance: () => openai("gpt-4o"),
    capabilities: ["text", "reasoning"],
    allowed: true,
  },
  {
    provider: "openai",
    key: "gpt-4.1",
    name: "GPT 4.1",
    description:
      "GPT 4.1 is the next generation OpenAI model for text and reasoning.",
    getModelInstance: () => openai("gpt-4.1"),
    capabilities: ["text", "reasoning"],
    allowed: true,
  },
  {
    provider: "openai",
    key: "gpt-4.1-mini",
    name: "GPT 4.1 Mini",
    description: "GPT 4.1 Mini is a smaller, efficient version of GPT 4.1.",
    getModelInstance: () => openai("gpt-4.1-mini"),
    capabilities: ["text"],
    allowed: true,
  },
  {
    provider: "openai",
    key: "gpt-4.1-nano",
    name: "GPT 4.1 Nano",
    description:
      "GPT 4.1 Nano is an ultra-lightweight version for fast responses.",
    getModelInstance: () => openai("gpt-4.1-nano"),
    capabilities: ["text"],
    allowed: true,
  },
  {
    provider: "openai",
    key: "gpt-4.5",
    name: "GPT 4.5",
    description: "GPT 4.5 is the latest OpenAI model for advanced tasks.",
    getModelInstance: () => openai("gpt-4.5"),
    capabilities: ["text", "reasoning"],
    allowed: true,
  },
  // Anthropic models (unallowed)
  {
    provider: "anthropic",
    key: "claude-4-sonnet",
    name: "Claude 4 Sonnet",
    description: "Claude 4 Sonnet is an advanced reasoning model.",
    getModelInstance: () => anthropic("claude-4-sonnet"),
    capabilities: ["text", "reasoning"],
    allowed: false,
  },
  {
    provider: "anthropic",
    key: "claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    description: "Claude 3.5 Sonnet is a high-performance reasoning model.",
    getModelInstance: () => anthropic("claude-3.5-sonnet"),
    capabilities: ["text", "reasoning"],
    allowed: false,
  },
  {
    provider: "anthropic",
    key: "claude-3.7-sonnet",
    name: "Claude 3.7 Sonnet",
    description: "Claude 3.7 Sonnet is a next-gen reasoning model.",
    getModelInstance: () => anthropic("claude-3.7-sonnet"),
    capabilities: ["text", "reasoning"],
    allowed: false,
  },
  {
    provider: "anthropic",
    key: "claude-3.7-sonnet-reasoning",
    name: "Claude 3.7 Sonnet (Reasoning)",
    description:
      "Claude 3.7 Sonnet (Reasoning) is optimized for complex reasoning.",
    getModelInstance: () => anthropic("claude-3.7-sonnet-reasoning"),
    capabilities: ["text", "reasoning"],
    allowed: false,
  },
  {
    provider: "anthropic",
    key: "claude-4-opus",
    name: "Claude 4 Opus",
    description: "Claude 4 Opus is a top-tier model for advanced tasks.",
    getModelInstance: () => anthropic("claude-4-opus"),
    capabilities: ["text", "reasoning"],
    allowed: false,
  },
  // Groq models (unallowed)
  {
    provider: "",
    key: "qwen-qwq-32b",
    name: "Qwen qwq-32b",
    description: "Qwen qwq-32b is a large model for advanced tasks.",
    getModelInstance: () => groq("qwen-qwq-32b"),
    capabilities: ["text"],
    allowed: false,
  },
  {
    provider: "groq",
    key: "qwen-2.5-32b",
    name: "Qwen 2.5 32b",
    description: "Qwen 2.5 32b is a next-gen model for text and reasoning.",
    getModelInstance: () => groq("qwen-2.5-32b"),
    capabilities: ["text", "reasoning"],
    allowed: false,
  },
  // DeepSeek models (unallowed)
  {
    provider: "deepseek",
    key: "deepseek-v3-fireworks",
    name: "DeepSeek v3 (Fireworks)",
    description: "DeepSeek v3 (Fireworks) is optimized for performance.",
    getModelInstance: () => deepseek("deepseek-v3-fireworks"),
    capabilities: ["text"],
    allowed: false,
  },
  {
    provider: "deepseek",
    key: "deepseek-v3-0324",
    name: "DeepSeek v3 (0324)",
    description: "DeepSeek v3 (0324) is a recent version for advanced tasks.",
    getModelInstance: () => deepseek("deepseek-v3-0324"),
    capabilities: ["text"],
    allowed: false,
  },
  {
    provider: "deepseek",
    key: "deepseek-r1-openrouter",
    name: "DeepSeek R1 (OpenRouter)",
    description: "DeepSeek R1 (OpenRouter) is optimized for open routing.",
    getModelInstance: () => deepseek("deepseek-r1-openrouter"),
    capabilities: ["text"],
    allowed: false,
  },
  {
    provider: "deepseek",
    key: "deepseek-r1-0528",
    name: "DeepSeek R1 (0528)",
    description: "DeepSeek R1 (0528) is a recent update for DeepSeek R1.",
    getModelInstance: () => deepseek("deepseek-r1-0528"),
    capabilities: ["text"],
    allowed: false,
  },
  {
    provider: "deepseek",
    key: "deepseek-r1-qwen-distilled",
    name: "DeepSeek R1 (Qwen Distilled)",
    description: "DeepSeek R1 (Qwen Distilled) is optimized for Qwen tasks.",
    getModelInstance: () => deepseek("deepseek-r1-qwen-distilled"),
    capabilities: ["text"],
    allowed: false,
  },
  {
    provider: "deepseek",
    key: "deepseek-r1-llama-distilled",
    name: "DeepSeek R1 (Llama Distilled)",
    description: "DeepSeek R1 (Llama Distilled) is optimized for efficiency.",
    getModelInstance: () => deepseek("deepseek-r1-llama-distilled"),
    capabilities: ["text"],
    allowed: false,
  },
  // Fireworks models (unallowed)
  {
    provider: "fireworks",
    key: "gpt-imagegen",
    name: "GPT ImageGen",
    description: "GPT ImageGen is designed for image generation tasks.",
    getModelInstance: () => fireworks("gpt-imagegen"),
    capabilities: ["image"],
    allowed: false,
  },
  // Mistral models (unallowed)
  {
    provider: "mistral",
    key: "o4-mini",
    name: "o4 mini",
    description: "o4 mini is a compact model for efficient text generation.",
    getModelInstance: () => mistral("o4-mini"),
    capabilities: ["text"],
    allowed: false,
  },
  {
    provider: "mistral",
    key: "o3-mini",
    name: "o3 mini",
    description: "o3 mini is a lightweight model for quick tasks.",
    getModelInstance: () => mistral("o3-mini"),
    capabilities: ["text"],
    allowed: false,
  },
  {
    provider: "mistral",
    key: "o3",
    name: "o3",
    description: "o3 is a general-purpose model for text generation.",
    getModelInstance: () => mistral("o3"),
    capabilities: ["text"],
    allowed: false,
  },
  {
    provider: "mistral",
    key: "o3-pro",
    name: "o3 Pro",
    description: "o3 Pro is a professional-grade model for advanced tasks.",
    getModelInstance: () => mistral("o3-pro"),
    capabilities: ["text", "reasoning"],
    allowed: false,
  },
  // Cohere models (unallowed, placeholder)
  // Add Cohere models here if needed
  // Llama models (Meta, via DeepInfra)
  {
    provider: "deepinfra",
    key: "llama-4-scout",
    name: "Llama 4 Scout",
    description: "Llama 4 Scout is a fast, efficient model for text tasks.",
    getModelInstance: () => deepinfra("meta-llama/Llama-4-Scout"),
    capabilities: ["text"],
    allowed: false,
  },
  {
    provider: "deepinfra",
    key: "llama-4-maverick",
    name: "Llama 4 Maverick",
    description: "Llama 4 Maverick is a robust model for a variety of tasks.",
    getModelInstance: () => deepinfra("meta-llama/Llama-4-Maverick"),
    capabilities: ["text"],
    allowed: false,
  },
  // xAI Grok models (unallowed)
  {
    provider: "xai",
    key: "grok-3",
    name: "Grok 3",
    description:
      "Grok 3 is a model for advanced reasoning and text generation.",
    getModelInstance: () => xai("grok-3"),
    capabilities: ["text", "reasoning"],
    allowed: false,
  },
  {
    provider: "xai",
    key: "grok-3-mini",
    name: "Grok 3 Mini",
    description: "Grok 3 Mini is a compact version for quick tasks.",
    getModelInstance: () => xai("grok-3-mini"),
    capabilities: ["text"],
    allowed: true,
  },
];

export const getModelInstance = (modelKey: string) => {
  const model = models.find((model) => model.key === modelKey);
  if (!model) {
    throw new Error(`Model ${modelKey} not found`);
  }
  return model.getModelInstance();
};

export const modelKeys = models.map((model) => model.key);
