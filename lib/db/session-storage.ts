// Session-based in-memory storage (better than global, but still not production-ready)
import type { Chat, DBMessage, Suggestion, User } from "./schema";

// Store data per session/user ID
const sessionData = new Map<
  string,
  {
    users: User[];
    chats: Chat[];
    messages: DBMessage[];
    documents: any[];
    suggestions: Suggestion[];
    votes: any[];
    streams: any[];
  }
>();

export function getSessionData(userId: string) {
  if (!sessionData.has(userId)) {
    sessionData.set(userId, {
      users: [],
      chats: [],
      messages: [],
      documents: [],
      suggestions: [],
      votes: [],
      streams: [],
    });
  }
  return sessionData.get(userId)!;
}

export function clearOldSessions() {
  // Clean up sessions older than 24 hours
  // This is a basic cleanup - in production you'd want more sophisticated logic
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

  for (const [userId, data] of sessionData.entries()) {
    const hasRecentActivity = data.chats.some(
      (chat) => chat.createdAt.getTime() > oneDayAgo
    );

    if (!hasRecentActivity) {
      sessionData.delete(userId);
    }
  }
}

// Clean up old sessions every hour
setInterval(clearOldSessions, 60 * 60 * 1000);
