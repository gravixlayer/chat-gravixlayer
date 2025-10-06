// Preload critical modules to reduce cold start times
import { auth } from "@/app/(auth)/auth";
import { getChatById } from "@/lib/db/queries";

// Preload auth module
export const preloadAuth = () => auth;

// Preload database queries
export const preloadDatabase = () => getChatById;

// Preload critical components
export const preloadComponents = async () => {
  // Dynamically import heavy components
  const [{ Chat }, { SidebarHistory }, { MultimodalInput }] = await Promise.all(
    [
      import("@/components/chat"),
      import("@/components/sidebar-history"),
      import("@/components/multimodal-input"),
    ]
  );

  return { Chat, SidebarHistory, MultimodalInput };
};

// Initialize preloading
if (typeof window === "undefined") {
  // Server-side preloading
  preloadAuth();
  preloadDatabase();
}
