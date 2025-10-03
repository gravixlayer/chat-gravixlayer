"use client";

import { useEffect, useState } from "react";

const MAX_GUEST_QUERIES = 10;

export function useRateLimit() {
  const [queryCount, setQueryCount] = useState(0);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize state
    const updateState = () => {
      const count = Number.parseInt(
        localStorage.getItem("guest_query_count") || "0",
        10
      );
      const apiKey = localStorage.getItem("user_gravixlayer_api_key");

      setQueryCount(count);
      setHasApiKey(!!apiKey);
      setIsLoading(false);
    };

    updateState();

    // Listen for changes
    const handleStorageChange = () => {
      updateState();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("queryCountUpdate", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("queryCountUpdate", handleStorageChange);
    };
  }, []);

  const remaining = Math.max(0, MAX_GUEST_QUERIES - queryCount);
  const isRateLimited = !hasApiKey && remaining === 0;
  const isNearLimit = !hasApiKey && remaining <= 3;

  return {
    queryCount,
    remaining,
    hasApiKey,
    isRateLimited,
    isNearLimit,
    isLoading,
    maxQueries: MAX_GUEST_QUERIES,
  };
}
