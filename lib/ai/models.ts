export const DEFAULT_CHAT_MODEL: string = "chat-model";

export type ChatModel = {
  id: string;
  name: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  {
    id: "chat-model",
    name: "Llama 3.1 8B",
    description: "Meta's Llama 3.1 8B model via Gravixlayer API",
  },
  {
    id: "chat-model-reasoning",
    name: "Llama 3.1 8B (Reasoning)",
    description:
      "Meta's Llama 3.1 8B with chain-of-thought reasoning via Gravixlayer API",
  },
];
