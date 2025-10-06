import type { LanguageModel } from "ai";

const createMockModel = (): LanguageModel => {
  return {
    specificationVersion: "v2",
    provider: "mock",
    modelId: "mock-model",
    defaultObjectGenerationMode: "tool",
    supportedUrls: [],
    supportsImageUrls: false,
    supportsStructuredOutputs: false,
    doGenerate: ({ messages }) => {
      // Get the last user message to determine response
      const lastMessage = messages.at(-1);
      const userText = lastMessage?.content?.[0]?.text || "";

      let responseText = "It's just green duh!"; // default

      if (userText.includes("Next.js") || userText.includes("advantages")) {
        responseText = "With Next.js, you can ship fast!";
      } else if (userText.includes("blue")) {
        responseText = "It's just blue duh!";
      }

      return Promise.resolve({
        rawCall: { rawPrompt: null, rawSettings: {} },
        finishReason: "stop",
        usage: { inputTokens: 10, outputTokens: 20, totalTokens: 30 },
        content: [{ type: "text", text: responseText }],
        warnings: [],
      });
    },
    doStream: ({ messages }) => {
      // Get the last user message to determine response
      const lastMessage = messages.at(-1);
      const userText = lastMessage?.content?.[0]?.text || "";

      let responseText = "It's just green duh!"; // default

      if (userText.includes("Next.js") || userText.includes("advantages")) {
        responseText = "With Next.js, you can ship fast!";
      } else if (userText.includes("blue")) {
        responseText = "It's just blue duh!";
      }

      return Promise.resolve({
        stream: new ReadableStream({
          start(controller) {
            controller.enqueue({
              type: "text-delta",
              textDelta: responseText,
            });
            controller.enqueue({
              type: "finish",
              finishReason: "stop",
              usage: { inputTokens: 10, outputTokens: 20, totalTokens: 30 },
            });
            controller.close();
          },
        }),
        rawCall: { rawPrompt: null, rawSettings: {} },
      });
    },
  } as unknown as LanguageModel;
};

export const chatModel = createMockModel();
export const reasoningModel = createMockModel();
export const titleModel = createMockModel();
export const artifactModel = createMockModel();
