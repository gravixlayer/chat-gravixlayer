export const DEFAULT_CHAT_MODEL: string = "chat-model";

export type ChatModel = {
  id: string;
  name: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  {
    id: "chat-model",
    name: "Llama 3.2 1B",
    description: "Meta's Llama 3.2 1B model via Gravixlayer API",
  },
  {
    id: "chat-model-reasoning",
    name: "Qwen 3 0.6B (Reasoning)",
    description:
      "Qwen 3 0.6B with chain-of-thought reasoning via Gravixlayer API",
  },
];
