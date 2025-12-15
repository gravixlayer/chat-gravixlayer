export const DEFAULT_CHAT_MODEL: string = "meta-llama/llama-3.2-1b-instruct";

export type ChatModel = {
  id: string;
  name: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  {
    id: "meta-llama/llama-3.2-1b-instruct",
    name: "Llama 3.2 1B",
    description: "Meta's Llama 3.2 1B compact model",
  },
  {
    id: "qwen/qwen-2.5-vl-7b-instruct",
    name: "Qwen 2.5 VL 7B",
    description: "Qwen 2.5 VL 7B model with vision capabilities",
  },
  {
    id: "meta-llama/llama-3.2-3b-instruct",
    name: "Llama 3.2 3B",
    description: "Meta's Llama 3.2 3B efficient model",
  },
  {
    id: "meta-llama/llama-3.1-8b-instruct",
    name: "Llama 3.1 8B",
    description: "Meta's Llama 3.1 8B instruction-tuned model",
  },
];
