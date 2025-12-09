import "server-only";

import type { ArtifactKind } from "@/components/artifact";
import type { VisibilityType } from "@/components/visibility-selector";
import { ChatSDKError } from "../errors";
import type { AppUsage } from "../usage";
import { generateUUID } from "../utils";
import type { Chat, DBMessage, Suggestion, User } from "./schema";
import { generateHashedPassword } from "./utils";

// Check if we should use Supabase
const useSupabase = !!(
  process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY
);

// Import Supabase queries if available (with global caching)
let supabaseQueries: any = null;

// Singleton pattern - initialize once and cache
if (useSupabase) {
  if (global.__supabase_initialized) {
    // Use cached module without logging
    supabaseQueries = require("./supabase-queries");
  } else {
    try {
      supabaseQueries = require("./supabase-queries");
      global.__supabase_initialized = true;
      // Only log once
      console.log("✅ Supabase initialized");
    } catch (error) {
      console.warn("⚠️ Supabase not available, using in-memory storage");
    }
  }
}

// Declare global type
declare global {
  var __supabase_initialized: boolean | undefined;
}

// ⚠️ WARNING: This in-memory storage is NOT suitable for production!
// Multiple users will share the same data, causing privacy issues and data leaks.
// For production, you MUST use a real database (PostgreSQL, MySQL, etc.)
// See PRODUCTION_SETUP.md for database setup instructions.

declare global {
  var __db_users: User[] | undefined;
  var __db_chats: Chat[] | undefined;
  var __db_messages: DBMessage[] | undefined;
  var __db_documents: any[] | undefined;
  var __db_suggestions: Suggestion[] | undefined;
  var __db_votes: any[] | undefined;
  var __db_streams: any[] | undefined;
}

if (process.env.NODE_ENV === "production") {
  console.error("🚨 CRITICAL: In-memory storage detected in production!");
  console.error(
    "This will cause data leaks between users. Set up a real database immediately."
  );
  console.error("See PRODUCTION_SETUP.md for instructions.");
}

// Initialize global storage (DEVELOPMENT ONLY)
globalThis.__db_users = globalThis.__db_users || [];
globalThis.__db_chats = globalThis.__db_chats || [];
globalThis.__db_messages = globalThis.__db_messages || [];
globalThis.__db_documents = globalThis.__db_documents || [];
globalThis.__db_suggestions = globalThis.__db_suggestions || [];
globalThis.__db_votes = globalThis.__db_votes || [];
globalThis.__db_streams = globalThis.__db_streams || [];

const users: User[] = globalThis.__db_users;
const chats: Chat[] = globalThis.__db_chats;
const messages: DBMessage[] = globalThis.__db_messages;
const documents: any[] = globalThis.__db_documents;
const suggestions: Suggestion[] = globalThis.__db_suggestions;
const votes: any[] = globalThis.__db_votes;
const streams: any[] = globalThis.__db_streams;

export async function getUser(email: string): Promise<User[]> {
  if (useSupabase && supabaseQueries) {
    return supabaseQueries.getUser(email);
  }

  try {
    return users.filter((user) => user.email === email);
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get user by email"
    );
  }
}

export async function createUser(email: string, password: string) {
  if (useSupabase && supabaseQueries) {
    const users = await supabaseQueries.createUser(email, password);
    return users[0]; // Return single user for compatibility
  }

  const hashedPassword = await generateHashedPassword(password);

  try {
    const newUser: User = {
      id: generateUUID(),
      email,
      password: hashedPassword,
    };
    users.push(newUser);
    return newUser;
  } catch (_error) {
    throw new ChatSDKError("bad_request:database", "Failed to create user");
  }
}

export async function createGuestUser() {
  if (useSupabase && supabaseQueries) {
    return supabaseQueries.createGuestUser();
  }

  // Simulate async operation for future database compatibility
  await Promise.resolve();
  const email = `guest-${Date.now()}`;
  const password = await generateHashedPassword(generateUUID());

  try {
    const newUser: User = {
      id: generateUUID(),
      email,
      password,
    };
    users.push(newUser);
    return [{ id: newUser.id, email: newUser.email }];
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to create guest user"
    );
  }
}

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
}) {
  if (useSupabase && supabaseQueries) {
    return supabaseQueries.saveChat({ id, userId, title, visibility });
  }

  try {
    const newChat: Chat = {
      id,
      createdAt: new Date(),
      userId,
      title,
      visibility,
      lastContext: null,
    };
    chats.push(newChat);
    return newChat;
  } catch (_error) {
    throw new ChatSDKError("bad_request:database", "Failed to save chat");
  }
}

export async function deleteChatById({ id }: { id: string }) {
  // Simulate async operation for future database compatibility
  await Promise.resolve();
  try {
    // Remove related votes, messages, and streams
    const voteIndex = votes.findIndex((v) => v.chatId === id);
    if (voteIndex !== -1) {
      votes.splice(voteIndex, 1);
    }

    const messageIndexes = messages
      .map((m, i) => (m.chatId === id ? i : -1))
      .filter((i) => i !== -1);
    for (const i of messageIndexes.reverse()) {
      messages.splice(i, 1);
    }

    const streamIndexes = streams
      .map((s, i) => (s.chatId === id ? i : -1))
      .filter((i) => i !== -1);
    for (const i of streamIndexes.reverse()) {
      streams.splice(i, 1);
    }

    const chatIndex = chats.findIndex((c) => c.id === id);
    if (chatIndex !== -1) {
      const deletedChat = chats[chatIndex];
      chats.splice(chatIndex, 1);
      return deletedChat;
    }
    return null;
  } catch (_error) {
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
}) {
  // Simulate async operation for future database compatibility
  await Promise.resolve();
  try {
    const userChats = chats.filter((c) => c.userId === id);
    userChats.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    let filteredChats: Chat[] = [];

    if (startingAfter) {
      const selectedChat = chats.find((c) => c.id === startingAfter);
      if (!selectedChat) {
        throw new ChatSDKError(
          "not_found:database",
          `Chat with id ${startingAfter} not found`
        );
      }
      filteredChats = userChats.filter(
        (c) => c.createdAt > selectedChat.createdAt
      );
    } else if (endingBefore) {
      const selectedChat = chats.find((c) => c.id === endingBefore);
      if (!selectedChat) {
        throw new ChatSDKError(
          "not_found:database",
          `Chat with id ${endingBefore} not found`
        );
      }
      filteredChats = userChats.filter(
        (c) => c.createdAt < selectedChat.createdAt
      );
    } else {
      filteredChats = userChats;
    }

    const hasMore = filteredChats.length > limit;

    return {
      chats: hasMore ? filteredChats.slice(0, limit) : filteredChats,
      hasMore,
    };
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get chats by user id"
    );
  }
}

export function getChatById({ id }: { id: string }) {
  try {
    const selectedChat = chats.find((c) => c.id === id);
    return selectedChat || null;
  } catch (_error) {
    throw new ChatSDKError("bad_request:database", "Failed to get chat by id");
  }
}

export async function saveMessages({
  messages: newMessages,
}: {
  messages: DBMessage[];
}) {
  // Simulate async operation for future database compatibility
  await Promise.resolve();
  try {
    messages.push(...newMessages);
    return newMessages;
  } catch (_error) {
    throw new ChatSDKError("bad_request:database", "Failed to save messages");
  }
}

export function getMessagesByChatId({ id }: { id: string }) {
  try {
    return messages
      .filter((m) => m.chatId === id)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get messages by chat id"
    );
  }
}

export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: "up" | "down";
}) {
  // Simulate async operation for future database compatibility
  await Promise.resolve();
  try {
    const existingVoteIndex = votes.findIndex((v) => v.messageId === messageId);

    if (existingVoteIndex !== -1) {
      votes[existingVoteIndex].isUpvoted = type === "up";
      return votes[existingVoteIndex];
    }

    const newVote = {
      chatId,
      messageId,
      isUpvoted: type === "up",
    };
    votes.push(newVote);
    return newVote;
  } catch (_error) {
    throw new ChatSDKError("bad_request:database", "Failed to vote message");
  }
}

export function getVotesByChatId({ id }: { id: string }) {
  try {
    return votes.filter((v) => v.chatId === id);
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get votes by chat id"
    );
  }
}

export async function saveDocument({
  id,
  title,
  kind,
  content,
  userId,
}: {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userId: string;
}) {
  // Simulate async operation for future database compatibility
  await Promise.resolve();
  try {
    const newDocument = {
      id,
      title,
      kind,
      content,
      userId,
      createdAt: new Date(),
    };
    documents.push(newDocument);
    return [newDocument];
  } catch (_error) {
    throw new ChatSDKError("bad_request:database", "Failed to save document");
  }
}

export async function getDocumentsById({ id }: { id: string }) {
  // Simulate async operation for future database compatibility
  await Promise.resolve();
  try {
    return documents
      .filter((d) => d.id === id)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get documents by id"
    );
  }
}

export async function getDocumentById({ id }: { id: string }) {
  // Simulate async operation for future database compatibility
  await Promise.resolve();
  try {
    const docs = documents
      .filter((d) => d.id === id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return docs[0] || null;
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get document by id"
    );
  }
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  // Simulate async operation for future database compatibility
  await Promise.resolve();
  try {
    // Remove related suggestions
    const suggestionIndexes = suggestions
      .map((s, i) =>
        s.documentId === id && s.documentCreatedAt > timestamp ? i : -1
      )
      .filter((i) => i !== -1);
    for (const i of suggestionIndexes.reverse()) {
      suggestions.splice(i, 1);
    }

    // Remove documents
    const docIndexes = documents
      .map((d, i) => (d.id === id && d.createdAt > timestamp ? i : -1))
      .filter((i) => i !== -1);
    const deletedDocs = docIndexes.map((i) => documents[i]);
    for (const i of docIndexes.reverse()) {
      documents.splice(i, 1);
    }

    return deletedDocs;
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete documents by id after timestamp"
    );
  }
}

export async function saveSuggestions({
  suggestions: newSuggestions,
}: {
  suggestions: Suggestion[];
}) {
  // Simulate async operation for future database compatibility
  await Promise.resolve();
  try {
    suggestions.push(...newSuggestions);
    return newSuggestions;
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to save suggestions"
    );
  }
}

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  // Simulate async operation for future database compatibility
  await Promise.resolve();
  try {
    return suggestions.filter((s) => s.documentId === documentId);
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get suggestions by document id"
    );
  }
}

export async function getMessageById({ id }: { id: string }) {
  // Simulate async operation for future database compatibility
  await Promise.resolve();
  try {
    return messages.filter((m) => m.id === id);
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get message by id"
    );
  }
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  // Simulate async operation for future database compatibility
  await Promise.resolve();
  try {
    const messagesToDelete = messages.filter(
      (m) => m.chatId === chatId && m.createdAt >= timestamp
    );

    const messageIds = messagesToDelete.map((m) => m.id);

    if (messageIds.length > 0) {
      // Remove related votes
      const voteIndexes = votes
        .map((v, i) =>
          v.chatId === chatId && messageIds.includes(v.messageId) ? i : -1
        )
        .filter((i) => i !== -1);
      for (const i of voteIndexes.reverse()) {
        votes.splice(i, 1);
      }

      // Remove messages
      const messageIndexes = messages
        .map((m, i) =>
          m.chatId === chatId && messageIds.includes(m.id) ? i : -1
        )
        .filter((i) => i !== -1);
      for (const i of messageIndexes.reverse()) {
        messages.splice(i, 1);
      }
    }
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete messages by chat id after timestamp"
    );
  }
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: "private" | "public";
}) {
  // Simulate async operation for future database compatibility
  await Promise.resolve();
  try {
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      chat.visibility = visibility;
    }
    return chat;
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to update chat visibility by id"
    );
  }
}

export async function updateChatTitleById({
  chatId,
  title,
}: {
  chatId: string;
  title: string;
}) {
  if (useSupabase && supabaseQueries) {
    return supabaseQueries.updateChatTitleById({ chatId, title });
  }

  // Simulate async operation for future database compatibility
  await Promise.resolve();
  try {
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      chat.title = title;
    }
    return chat;
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to update chat title by id"
    );
  }
}

export async function updateChatLastContextById({
  chatId,
  context,
}: {
  chatId: string;
  // Store merged server-enriched usage object
  context: AppUsage;
}) {
  // Simulate async operation for future database compatibility
  await Promise.resolve();
  try {
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      (chat as any).lastContext = context;
    }
    return chat;
  } catch (error) {
    console.warn("Failed to update lastContext for chat", chatId, error);
    return;
  }
}

export async function getMessageCountByUserId({
  id,
  differenceInHours,
}: {
  id: string;
  differenceInHours: number;
}) {
  // Simulate async operation for future database compatibility
  await Promise.resolve();
  try {
    const twentyFourHoursAgo = new Date(
      Date.now() - differenceInHours * 60 * 60 * 1000
    );

    const userChats = chats.filter((c) => c.userId === id);
    const userChatIds = userChats.map((c) => c.id);

    const count = messages.filter(
      (m) =>
        userChatIds.includes(m.chatId) &&
        m.createdAt >= twentyFourHoursAgo &&
        m.role === "user"
    ).length;

    return count;
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get message count by user id"
    );
  }
}

export async function createStreamId({
  streamId,
  chatId,
}: {
  streamId: string;
  chatId: string;
}) {
  // Simulate async operation for future database compatibility
  await Promise.resolve();
  try {
    streams.push({ id: streamId, chatId, createdAt: new Date() });
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to create stream id"
    );
  }
}

export async function getStreamIdsByChatId({ chatId }: { chatId: string }) {
  // Simulate async operation for future database compatibility
  await Promise.resolve();
  try {
    return streams
      .filter((s) => s.chatId === chatId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .map((s) => s.id);
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get stream ids by chat id"
    );
  }
}
