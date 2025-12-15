export const DEFAULT_CHAT_MODEL: string = "llama-3.2-1b";

export type ChatModel = {
  id: string;
  name: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  {
    id: "llama-3.2-1b",
    name: "Llama 3.2 1B",
    description: "Meta's Llama 3.2 1B compact model",
  },
  {
    id: "qwen-2.5-vl-7b",
    name: "Qwen 2.5 VL 7B",
    description: "Qwen 2.5 VL 7B model with vision capabilities",
  },
  {
    id: "llama-3.2-3b",
    name: "Llama 3.2 3B",
    description: "Meta's Llama 3.2 3B efficient model",
  },
  {
    id: "llama-3.1-8b",
    name: "Llama 3.1 8B",
    description: "Meta's Llama 3.1 8B instruction-tuned model",
  },
];
