const MAX_GUEST_QUERIES = 10;

export function getGuestQueryCount(): number {
  if (typeof window === "undefined") {
    return 0;
  }
  return Number.parseInt(localStorage.getItem("guest_query_count") || "0", 10);
}

export function incrementGuestQueryCount(): number {
  if (typeof window === "undefined") {
    return 0;
  }

  const currentCount = getGuestQueryCount();
  const newCount = currentCount + 1;

  localStorage.setItem("guest_query_count", newCount.toString());

  // Dispatch custom event for same-tab updates
  window.dispatchEvent(new Event("queryCountUpdate"));

  return newCount;
}

export function isGuestRateLimited(): boolean {
  return getGuestQueryCount() >= MAX_GUEST_QUERIES;
}

export function hasUserApiKey(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return !!localStorage.getItem("user_gravixlayer_api_key");
}

export function getUserApiKey(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem("user_gravixlayer_api_key");
}

export function getRemainingQueries(): number {
  return Math.max(0, MAX_GUEST_QUERIES - getGuestQueryCount());
}
