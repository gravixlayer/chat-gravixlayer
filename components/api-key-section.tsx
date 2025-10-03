"use client";

import { ExternalLinkIcon, KeyIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ApiKeySection() {
  const [apiKey, setApiKey] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set client-side flag
    setIsClient(true);

    // Load saved API key from localStorage
    const savedKey = localStorage.getItem("user_gravixlayer_api_key");
    if (savedKey) {
      setApiKey(savedKey);
      setIsSaved(true);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("user_gravixlayer_api_key", apiKey.trim());
      setIsSaved(true);
      setIsExpanded(false);
      // Dispatch event to update other components
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("apiKeyUpdate"));
      }
    }
  };

  const handleRemoveApiKey = () => {
    localStorage.removeItem("user_gravixlayer_api_key");
    setApiKey("");
    setIsSaved(false);
    // Dispatch event to update other components
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("apiKeyUpdate"));
    }
  };

  // Show skeleton while hydrating
  if (!isClient) {
    return (
      <div className="px-2 py-2">
        <Card className="border-dashed">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="h-6 w-12 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-2 py-2">
      <Card className="border-muted-foreground/20 border-dashed">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyIcon className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm">API Key</CardTitle>
            </div>
            {!isExpanded && (
              <Button
                className="h-6 px-2 text-xs"
                onClick={() => setIsExpanded(true)}
                size="sm"
                variant="ghost"
              >
                {isSaved ? "Change" : "Add"}
              </Button>
            )}
          </div>
          {!isExpanded && (
            <CardDescription className="text-xs">
              {isSaved
                ? "Using your API key • Unlimited queries"
                : "Add your API key for unlimited usage"}
            </CardDescription>
          )}
        </CardHeader>

        {isExpanded && (
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div>
                <Label className="text-xs" htmlFor="api-key">
                  Gravix Layer API Key
                </Label>
                <Input
                  className="mt-1 h-8 text-xs"
                  id="api-key"
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key..."
                  type="password"
                  value={apiKey}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  className="h-7 px-3 text-xs"
                  disabled={!apiKey.trim()}
                  onClick={handleSaveApiKey}
                  size="sm"
                >
                  Save
                </Button>
                <Button
                  className="h-7 px-3 text-xs"
                  onClick={() => setIsExpanded(false)}
                  size="sm"
                  variant="outline"
                >
                  Cancel
                </Button>
                {isSaved && (
                  <Button
                    className="h-7 px-3 text-xs"
                    onClick={handleRemoveApiKey}
                    size="sm"
                    variant="destructive"
                  >
                    Remove
                  </Button>
                )}
              </div>

              <a
                className="inline-flex items-center justify-center gap-1 rounded-md border border-muted-foreground/30 border-dashed bg-muted/50 px-3 py-2 text-muted-foreground text-xs transition-colors hover:border-muted-foreground/50 hover:bg-muted hover:text-foreground"
                href="https://platform.gravixlayer.com"
                rel="noopener noreferrer"
                target="_blank"
              >
                <ExternalLinkIcon className="h-3 w-3" />
                Get API Key
              </a>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
