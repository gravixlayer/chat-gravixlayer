"use client";

import { useEffect } from "react";
import { clearSessionStorage } from "@/lib/session-storage";

export function SessionCleanup() {
  useEffect(() => {
    // Clear session storage when the page is about to unload (tab close)
    const handleBeforeUnload = () => {
      clearSessionStorage();
    };

    // Clear session storage when the page becomes hidden (tab switch/close)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        clearSessionStorage();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null; // This component doesn't render anything
}
