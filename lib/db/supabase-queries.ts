import type { VisibilityType } from "@/components/visibility-selector";
import { ChatSDKError } from "@/lib/errors";
import { generateUUID } from "@/lib/utils";
import type { Chat, DBMessage, Suggestion, User } from "./schema";
import type { Database } from "./supabase";
import { supabase } from "./supabase";
import { generateHashedPassword } from "./utils";

type Tables = Database["public"]["Tables"];

// Cache to prevent repeated user existence checks
const userExistsCache = new Set<string>();

// Fast user creation with upsert - single database call
async function ensureUserExists(userId: string): Promise<void> {
  // Skip if we've already ensured this user exists
  if (userExistsCache.has(userId)) {
    return;
  }

  try {
    const email = userId.startsWith("guest-")
      ? `guest-${userId.slice(-8)}@temp.com`
      : `user-${userId.slice(-8)}@temp.com`;

    // Use upsert for single database call - much faster!
    await supabase.from("users").upsert(
      [
        {
          id: userId,
          email,
          password: null,
        },
      ],
      {
        onConflict: "id",
        ignoreDuplicates: true,
      }
    );

    // Cache the result to avoid repeated calls
    userExistsCache.add(userId);
  } catch (error) {
    // Ignore errors - user might already exist
    console.warn("User upsert warning (safe to ignore):", error);
  }
}

// User operations
export async function getUser(email: string): Promise<User[]> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error getting user:", error);
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get user by email"
    );
  }
}

export async function createUser(
  email: string,
  password: string
): Promise<User[]> {
  try {
    const hashedPassword = generateHashedPassword(password);
    const newUser = {
      id: generateUUID(),
      email,
      password: hashedPassword,
    };

    const { data, error } = await supabase
      .from("users")
      .insert([newUser])
      .select();

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error creating user:", error);
    throw new ChatSDKError("bad_request:database", "Failed to create user");
  }
}

export async function createGuestUser(): Promise<User[]> {
  try {
    const email = `guest-${Date.now()}`;
    const password = generateHashedPassword(generateUUID());
    const newUser = {
      id: generateUUID(),
      email,
      password,
    };

    const { data, error } = await supabase
      .from("users")
      .insert([newUser])
      .select();

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error creating guest user:", error);
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to create guest user"
    );
  }
}

// Chat operations
export async function saveChat({
  id,
  userId,
  title,
  visibility,
}: {
  id: string;
  userId: string;
  title: string;
  visibility: VisibilityType;
}): Promise<Chat> {
  try {
    // First, ensure the user exists in the database
    await ensureUserExists(userId);

    const newChat = {
      id,
      user_id: userId,
      title,
      visibility,
    };

    const { data, error } = await supabase
      .from("chats")
      .upsert([newChat], {
        onConflict: "id",
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      visibility: data.visibility as VisibilityType,
      createdAt: new Date(data.created_at),
      lastContext: data.last_context,
    };
  } catch (error) {
    console.error("Error saving chat:", error);
    throw new ChatSDKError("bad_request:database", "Failed to save chat");
  }
}

export async function deleteChatById({ id }: { id: string }): Promise<Chat> {
  try {
    const { data, error } = await supabase
      .from("chats")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      visibility: data.visibility as VisibilityType,
      createdAt: new Date(data.created_at),
      lastContext: data.last_context,
    };
  } catch (error) {
    console.error("Error deleting chat:", error);
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete chat by id"
    );
  }
}

export async function getChatsByUserId({
  id,
  limit,
  startingAfter,
  endingBefore,
}: {
  id: string;
  limit: number;
  startingAfter: string | null;
  endingBefore: string | null;
}): Promise<Chat[]> {
  try {
    let query = supabase
      .from("chats")
      .select("*")
      .eq("user_id", id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (startingAfter) {
      const { data: afterChat } = await supabase
        .from("chats")
        .select("created_at")
        .eq("id", startingAfter)
        .single();

      if (afterChat) {
        query = query.lt("created_at", afterChat.created_at);
      }
    }

    if (endingBefore) {
      const { data: beforeChat } = await supabase
        .from("chats")
        .select("created_at")
        .eq("id", endingBefore)
        .single();

      if (beforeChat) {
        query = query.gt("created_at", beforeChat.created_at);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map((chat) => ({
      id: chat.id,
      userId: chat.user_id,
      title: chat.title,
      visibility: chat.visibility as VisibilityType,
      createdAt: new Date(chat.created_at),
      lastContext: chat.last_context,
    }));
  } catch (error) {
    console.error("Error getting chats by user ID:", error);
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get chats by user id"
    );
  }
}

export async function getChatById({
  id,
}: {
  id: string;
}): Promise<Chat | null> {
  try {
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // Not found
      throw error;
    }

    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      visibility: data.visibility as VisibilityType,
      createdAt: new Date(data.created_at),
      lastContext: data.last_context,
    };
  } catch (error) {
    console.error("Error getting chat by ID:", error);
    throw new ChatSDKError("bad_request:database", "Failed to get chat by id");
  }
}

// Message operations
export async function saveMessages({
  messages: newMessages,
}: {
  messages: DBMessage[];
}): Promise<DBMessage[]> {
  try {
    const messagesToInsert = newMessages.map((msg) => ({
      id: msg.id,
      chat_id: msg.chatId,
      role: msg.role,
      parts: msg.parts,
      attachments: msg.attachments || [],
    }));

    const { data, error } = await supabase
      .from("messages")
      .insert(messagesToInsert)
      .select();

    if (error) throw error;

    return (data || []).map((msg) => ({
      id: msg.id,
      chatId: msg.chat_id,
      role: msg.role as "user" | "assistant",
      parts: msg.parts,
      attachments: msg.attachments,
      createdAt: new Date(msg.created_at),
    }));
  } catch (error) {
    console.error("Error saving messages:", error);
    throw new ChatSDKError("bad_request:database", "Failed to save messages");
  }
}

export async function getMessagesByChatId({
  id,
}: {
  id: string;
}): Promise<DBMessage[]> {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", id)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return (data || []).map((msg) => ({
      id: msg.id,
      chatId: msg.chat_id,
      role: msg.role as "user" | "assistant",
      parts: msg.parts,
      attachments: msg.attachments,
      createdAt: new Date(msg.created_at),
    }));
  } catch (error) {
    console.error("Error getting messages by chat ID:", error);
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get messages by chat id"
    );
  }
}

export async function getMessageCountByUserId({
  id,
  differenceInHours,
}: {
  id: string;
  differenceInHours: number;
}): Promise<number> {
  try {
    const hoursAgo = new Date(Date.now() - differenceInHours * 60 * 60 * 1000);

    // First get the chat IDs for the user
    const { data: userChats, error: chatsError } = await supabase
      .from("chats")
      .select("id")
      .eq("user_id", id);

    if (chatsError) throw chatsError;

    const chatIds = userChats?.map((chat) => chat.id) || [];

    const { count, error } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("role", "user")
      .gte("created_at", hoursAgo.toISOString())
      .in("chat_id", chatIds);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error("Error getting message count:", error);
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get message count by user id"
    );
  }
}

// Vote operations
export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: "up" | "down";
}): Promise<void> {
  try {
    const { error } = await supabase.from("votes").upsert(
      {
        chat_id: chatId,
        message_id: messageId,
        type,
      },
      {
        onConflict: "message_id",
      }
    );

    if (error) throw error;
  } catch (error) {
    console.error("Error voting message:", error);
    throw new ChatSDKError("bad_request:database", "Failed to vote message");
  }
}

export async function getVotesByChatId({ id }: { id: string }) {
  try {
    const { data, error } = await supabase
      .from("votes")
      .select("*")
      .eq("chat_id", id);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error getting votes by chat ID:", error);
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get votes by chat id"
    );
  }
}

// Stream operations
export async function createStreamId({
  streamId,
  chatId,
}: {
  streamId: string;
  chatId: string;
}): Promise<void> {
  try {
    const { error } = await supabase.from("streams").insert([
      {
        id: streamId,
        chat_id: chatId,
      },
    ]);

    if (error) throw error;
  } catch (error) {
    console.error("Error creating stream ID:", error);
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to create stream id"
    );
  }
}

export async function getStreamIdsByChatId({ chatId }: { chatId: string }) {
  try {
    const { data, error } = await supabase
      .from("streams")
      .select("*")
      .eq("chat_id", chatId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error getting stream IDs by chat ID:", error);
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get stream ids by chat id"
    );
  }
}

// Update chat operations
export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: VisibilityType;
}): Promise<void> {
  try {
    const { error } = await supabase
      .from("chats")
      .update({ visibility })
      .eq("id", chatId);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating chat visibility:", error);
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to update chat visibility"
    );
  }
}

export async function updateChatLastContextById({
  chatId,
  context,
}: {
  chatId: string;
  context: any;
}): Promise<void> {
  try {
    const { error } = await supabase
      .from("chats")
      .update({ last_context: context })
      .eq("id", chatId);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating chat last context:", error);
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to update chat last context"
    );
  }
}

export async function updateChatTitleById({
  chatId,
  title,
}: {
  chatId: string;
  title: string;
}): Promise<void> {
  try {
    const { error } = await supabase
      .from("chats")
      .update({ title })
      .eq("id", chatId);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating chat title:", error);
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to update chat title"
    );
  }
}

// Document operations (simplified for now)
export async function saveDocument({
  id,
  title,
  kind,
  content,
  userId,
}: {
  id: string;
  title: string;
  kind: string;
  content: string;
  userId: string;
}) {
  try {
    const { data, error } = await supabase
      .from("documents")
      .insert([
        {
          id,
          title,
          kind,
          content,
          user_id: userId,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving document:", error);
    throw new ChatSDKError("bad_request:database", "Failed to save document");
  }
}

// Additional functions can be implemented as needed...
// For now, let's implement the essential ones for chat functionality
