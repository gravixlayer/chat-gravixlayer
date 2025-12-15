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
    availableChatModelIds: ["qwen-2.5-vl-7b", "llama-3.2-1b", "llama-3.2-3b", "llama-3.1-8b"],
  },

  /*
   * For users with an account
   */
  regular: {
    maxMessagesPerDay: 100,
    availableChatModelIds: ["qwen-2.5-vl-7b", "llama-3.2-1b", "llama-3.2-3b", "llama-3.1-8b"],
  },

  /*
   * TODO: For users with an account and a paid membership
   */
};
