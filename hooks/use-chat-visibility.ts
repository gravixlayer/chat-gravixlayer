"use client";

import { useMemo } from "react";
import type { VisibilityType } from "@/components/visibility-selector";

export function useChatVisibility({
  chatId: _chatId,
  initialVisibilityType: _initialVisibilityType,
}: {
  chatId: string;
  initialVisibilityType: VisibilityType;
}) {
  // Unused parameters kept for compatibility

  const visibilityType = useMemo(() => {
    // Always return "private" - visibility selector is hidden
    return "private" as VisibilityType;
  }, []);

  const setVisibilityType = (_updatedVisibilityType: VisibilityType) => {
    // Do nothing - visibility is always private and cannot be changed
    console.log("Visibility change blocked - all chats are private");
  };

  return { visibilityType, setVisibilityType };
}
