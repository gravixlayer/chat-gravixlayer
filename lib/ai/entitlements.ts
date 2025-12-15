import type { UserType } from "@/app/(auth)/auth";
import type { ChatModel } from "./models";

type Entitlements = {
  maxMessagesPerDay: number;
  availableChatModelIds: ChatModel["id"][];
};

export const entitlementsByUserType: Record<UserType, Entitlements> = {
  /*
   * For users without an account
   */
  guest: {
    maxMessagesPerDay: 20,
    availableChatModelIds: ["qwen/qwen-2.5-vl-7b-instruct", "meta-llama/llama-3.2-1b-instruct", "meta-llama/llama-3.2-3b-instruct", "meta-llama/llama-3.1-8b-instruct"],
  },

  /*
   * For users with an account
   */
  regular: {
    maxMessagesPerDay: 100,
    availableChatModelIds: ["qwen/qwen-2.5-vl-7b-instruct", "meta-llama/llama-3.2-1b-instruct", "meta-llama/llama-3.2-3b-instruct", "meta-llama/llama-3.1-8b-instruct"],
  },

  /*
   * TODO: For users with an account and a paid membership
   */
};
