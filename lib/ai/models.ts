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
    name: " Qwen-2.5 7b",
    description:
      "Qwen-2.5 7b with chain-of-thought reasoning via Gravixlayer API",
  },
];
