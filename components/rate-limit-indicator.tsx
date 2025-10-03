"use client";

import { AlertTriangleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const MAX_GUEST_QUERIES = 10;

export function RateLimitIndicator() {
  const [queryCount, setQueryCount] = useState(0);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set client-side flag
    setIsClient(true);

    // Initialize state on client side only
    // Check if user has API key
    const apiKey = localStorage.getItem("user_gravixlayer_api_key");
    setHasApiKey(!!apiKey);

    // Get current query count
    const count = Number.parseInt(
      localStorage.getItem("guest_query_count") || "0",
      10
    );
    setQueryCount(count);

    // Listen for query count updates
    const handleStorageChange = () => {
      const newCount = Number.parseInt(
        localStorage.getItem("guest_query_count") || "0",
        10
      );
      setQueryCount(newCount);

      const newApiKey = localStorage.getItem("user_gravixlayer_api_key");
      setHasApiKey(!!newApiKey);
    };

    window.addEventListener("storage", handleStorageChange);

    // Custom event for same-tab updates
    window.addEventListener("queryCountUpdate", handleStorageChange);
    window.addEventListener("apiKeyUpdate", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("queryCountUpdate", handleStorageChange);
      window.removeEventListener("apiKeyUpdate", handleStorageChange);
    };
  }, []);

  // Show skeleton while hydrating
  if (!isClient) {
    return (
      <div className="px-2 py-1">
        <Card className="border">
          <CardContent className="p-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-8 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="h-1.5 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Don't show if user has API key
  if (hasApiKey) {
    return null;
  }

  const remaining = Math.max(0, MAX_GUEST_QUERIES - queryCount);
  const percentage = (queryCount / MAX_GUEST_QUERIES) * 100;
  const isCritical = queryCount >= 7; // Red outline at 7+ tries
  const isNearLimit = remaining <= 3 && queryCount < 7;
  const isAtLimit = remaining === 0;

  return (
    <div className="px-2 py-1">
      <Card
        className={`${
          isAtLimit
            ? "border-destructive bg-destructive/5"
            : isCritical
              ? "border-destructive"
              : isNearLimit
                ? "border-yellow-500/50 bg-yellow-50/50"
                : "border-muted-foreground/20"
        }`}
      >
        <CardContent className="p-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {(isNearLimit || isCritical || isAtLimit) && (
                  <AlertTriangleIcon
                    className={`h-3 w-3 ${
                      isAtLimit || isCritical
                        ? "text-destructive"
                        : "text-yellow-600"
                    }`}
                  />
                )}
                <span className="font-medium text-xs">
                  {isAtLimit ? "Limit Reached" : "Free Usage"}
                </span>
              </div>
              <span className="text-muted-foreground text-xs">
                {queryCount}/{MAX_GUEST_QUERIES}
              </span>
            </div>
            <Progress
              className={`h-1.5 ${
                isAtLimit || isCritical
                  ? "[&>div]:bg-destructive"
                  : isNearLimit
                    ? "[&>div]:bg-yellow-500"
                    : "[&>div]:bg-primary"
              }`}
              value={percentage}
            />
            <div className="text-muted-foreground text-xs">
              {isAtLimit
                ? "Add API key to continue"
                : `${remaining} queries remaining`}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
