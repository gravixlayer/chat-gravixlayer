import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

import { auth } from "@/app/(auth)/auth";
import { Chat } from "@/components/chat";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { getChatById, getMessagesByChatId } from "@/lib/db/queries";
import { convertToUIMessages } from "@/lib/utils";

// Loading component for better UX
function ChatLoading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-gray-900 border-b-2" />
    </div>
  );
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  // Parallel execution for better performance
  const [chat, session, cookieStore] = await Promise.all([
    getChatById({ id }),
    auth(),
    cookies(),
  ]);

  if (!session) {
    redirect("/api/auth/guest");
  }

  // If chat doesn't exist, create a new one with the provided ID
  if (!chat) {
    const chatModelFromCookie = cookieStore.get("chat-model");

    return (
      <Suspense fallback={<ChatLoading />}>
        <Chat
          autoResume={false}
          id={id}
          initialChatModel={chatModelFromCookie?.value || DEFAULT_CHAT_MODEL}
          initialLastContext={undefined}
          initialMessages={[]}
          initialVisibilityType="private"
          isReadonly={false}
        />
        <DataStreamHandler />
      </Suspense>
    );
  }

  if (chat.visibility === "private") {
    if (!session.user) {
      return notFound();
    }

    if (session.user.id !== chat.userId) {
      return notFound();
    }
  }

  // Parallel message loading for better performance
  const messagesFromDb = await getMessagesByChatId({ id });
  const uiMessages = convertToUIMessages(messagesFromDb);
  const chatModelFromCookie = cookieStore.get("chat-model");

  return (
    <Suspense fallback={<ChatLoading />}>
      <Chat
        autoResume={true}
        id={chat.id}
        initialChatModel={chatModelFromCookie?.value || DEFAULT_CHAT_MODEL}
        initialLastContext={chat.lastContext ?? undefined}
        initialMessages={uiMessages}
        initialVisibilityType={chat.visibility}
        isReadonly={session?.user?.id !== chat.userId}
      />
      <DataStreamHandler />
    </Suspense>
  );
}
