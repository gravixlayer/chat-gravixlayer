// Session-based storage utilities
// Data is cleared when the browser tab is closed

export function getSessionStorage<T>(key: string): T | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setSessionStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn("SessionStorage error:", error);
  }
}

export function removeSessionStorage(key: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.warn("SessionStorage error:", error);
  }
}

export function clearSessionStorage(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    sessionStorage.clear();
  } catch (error) {
    console.warn("SessionStorage error:", error);
  }
}

// Chat-specific session storage helpers
export function getSessionChatTitles(): Record<string, string> {
  return getSessionStorage<Record<string, string>>("chat-titles") || {};
}

export function setSessionChatTitle(chatId: string, title: string): void {
  const titles = getSessionChatTitles();
  titles[chatId] = title;
  setSessionStorage("chat-titles", titles);
}

export function getSessionChatTitle(chatId: string): string | null {
  const titles = getSessionChatTitles();
  return titles[chatId] || null;
}
