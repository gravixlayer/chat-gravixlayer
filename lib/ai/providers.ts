import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { isTestEnvironment } from "../constants";

// Function to create Gravixlayer provider with dynamic API key
function createGravixlayerProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "gravixlayer",
    apiKey,
    baseURL: "https://api.gravixlayer.com/v1/inference",
  });
}

// Default provider using server API key.
// In production we should NOT silently fall back to a fake/test API key —
// that leads to opaque runtime failures (503). If the env var is missing,
// leave the default provider undefined so callers can surface a clearer
// error earlier.
let defaultGravixlayer: ReturnType<typeof createOpenAICompatible> | undefined;
if (process.env.GRAVIXLAYER_API_KEY) {
  defaultGravixlayer = createGravixlayerProvider(process.env.GRAVIXLAYER_API_KEY);
} else {
  // During tests we may want a fallback; `isTestEnvironment` handling below
  // will take care of returning mocks. For local development, leaving this
  // undefined will cause the route to return a descriptive error.
  defaultGravixlayer = undefined;
}

// Function to get provider with user's API key or default
export function getProvider(userApiKey?: string) {
  const gravixlayer = userApiKey
    ? createGravixlayerProvider(userApiKey)
    : defaultGravixlayer;

  if (isTestEnvironment) {
    const {
      artifactModel,
      chatModel,
      reasoningModel,
      titleModel,
    } = require("./models.mock");
    return customProvider({
      languageModels: {
        "chat-model": chatModel,
        "chat-model-reasoning": reasoningModel,
        "title-model": titleModel,
        "artifact-model": artifactModel,
      },
    });
  }

  // If we don't have a gravixlayer provider (no server key and no user key),
  // return null so callers can return a clear `bad_request:api` response.
  if (!gravixlayer) {
    return null as any;
  }

  return customProvider({
    languageModels: {
      "qwen-2.5-vl-7b": gravixlayer("qwen/qwen-2.5-vl-7b-instruct"),
      "gemma-3-12b": gravixlayer("google/gemma-3-12b-it"),
      "llama-3.2-1b": gravixlayer("meta-llama/llama-3.2-1b-instruct"),
      "llama-3.2-3b": gravixlayer("meta-llama/llama-3.2-3b-instruct"),
      "llama-3.1-8b": gravixlayer("meta-llama/llama-3.1-8b-instruct"),
      "title-model": gravixlayer("meta-llama/llama-3.1-8b-instruct"),
      "artifact-model": gravixlayer("meta-llama/llama-3.1-8b-instruct"),
    },
  });
}

// Default provider for backward compatibility. `getProvider` can return
// `null` when no server key is configured; expose a small client-safe
// stub so client code that imports `myProvider` won't crash at runtime.
export const myProvider =
  getProvider() || { languageModel: (id: string) => null };
