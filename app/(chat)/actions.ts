"use server";

import { generateText, type UIMessage } from "ai";
import { cookies } from "next/headers";
import type { VisibilityType } from "@/components/visibility-selector";
import { getProvider } from "@/lib/ai/providers";
import {
  deleteMessagesByChatIdAfterTimestamp,
  getMessageById,
  updateChatVisiblityById,
} from "@/lib/db/queries";

export async function saveChatModelAsCookie(model: string) {
  const cookieStore = await cookies();
  cookieStore.set("chat-model", model);
}

export async function generateTitleFromUserMessage({
  message,
}: {
  message: UIMessage;
}) {
  const { text: title } = await generateText({
    model: getProvider().languageModel("title-model"),
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    prompt: JSON.stringify(message),
  });

  return title;
}

export async function generateTitleFromConversation({
  messages,
}: {
  messages: UIMessage[];
}) {
  const conversationText = messages
    .slice(0, 6) // Use first 6 messages for context
    .map((msg) => `${msg.role}: ${JSON.stringify(msg.parts)}`)
    .join("\n");

  const { text: title } = await generateText({
    model: getProvider().languageModel("title-model"),
    system: `\n
    - you will generate a short title based on the conversation context
    - ensure it is not more than 80 characters long
    - the title should capture the main topic or theme of the conversation
    - do not use quotes or colons
    - focus on the key subject matter being discussed`,
    prompt: conversationText,
  });

  return title;
}

export async function deleteTrailingMessages({ id }: { id: string }) {
  const [message] = await getMessageById({ id });

  await deleteMessagesByChatIdAfterTimestamp({
    chatId: message.chatId,
    timestamp: message.createdAt,
  });
}

export async function updateChatVisibility({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: VisibilityType;
}) {
  await updateChatVisiblityById({ chatId, visibility });
}
