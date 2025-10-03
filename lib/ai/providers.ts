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

// Default provider using server API key
const defaultGravixlayer = createGravixlayerProvider(
  process.env.GRAVIXLAYER_API_KEY || ""
);

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

  return customProvider({
    languageModels: {
      "chat-model": gravixlayer("meta-llama/llama-3.1-8b-instruct"),
      "chat-model-reasoning": wrapLanguageModel({
        model: gravixlayer("meta-llama/llama-3.1-8b-instruct"),
        middleware: extractReasoningMiddleware({ tagName: "think" }),
      }),
      "title-model": gravixlayer("meta-llama/llama-3.1-8b-instruct"),
      "artifact-model": gravixlayer("meta-llama/llama-3.1-8b-instruct"),
    },
  });
}

// Default provider for backward compatibility
export const myProvider = getProvider();
