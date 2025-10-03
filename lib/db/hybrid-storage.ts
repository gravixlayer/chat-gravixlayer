// Hybrid storage: Free database + client-side caching
// Uses Supabase free tier + localStorage for optimal performance

import type { Chat, DBMessage, User } from "./schema";

// Check if we have database connection
const hasDatabase =
  !!process.env.POSTGRES_URL &&
  process.env.POSTGRES_URL !== "your_postgres_url_here";

export class HybridStorage {
  // Cache data locally for faster access
  private cache = new Map<string, any>();

  async getChats(userId: string): Promise<Chat[]> {
    const cacheKey = `chats-${userId}`;

    // Try cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Try localStorage
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const data = JSON.parse(cached);
        this.cache.set(cacheKey, data);
        return data;
      }
    }

    // If no database, return empty
    if (!hasDatabase) {
      return [];
    }

    // TODO: Fetch from database when available
    return [];
  }

  async saveChat(chat: Chat): Promise<void> {
    const cacheKey = `chats-${chat.userId}`;

    // Update cache
    const chats = await this.getChats(chat.userId);
    const updatedChats = [...chats.filter((c) => c.id !== chat.id), chat];
    this.cache.set(cacheKey, updatedChats);

    // Update localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(cacheKey, JSON.stringify(updatedChats));
    }

    // TODO: Save to database when available
    if (hasDatabase) {
      // Database save logic here
    }
  }

  async getMessages(chatId: string): Promise<DBMessage[]> {
    const cacheKey = `messages-${chatId}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const data = JSON.parse(cached);
        this.cache.set(cacheKey, data);
        return data;
      }
    }

    return [];
  }

  async saveMessages(messages: DBMessage[]): Promise<void> {
    if (messages.length === 0) return;

    const chatId = messages[0].chatId;
    const cacheKey = `messages-${chatId}`;

    const existing = await this.getMessages(chatId);
    const updated = [...existing, ...messages];

    this.cache.set(cacheKey, updated);

    if (typeof window !== "undefined") {
      localStorage.setItem(cacheKey, JSON.stringify(updated));
    }
  }
}

export const hybridStorage = new HybridStorage();
