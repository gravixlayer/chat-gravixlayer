"use client";

import { useRouter } from "next/navigation";
import { memo, useEffect, useState } from "react";
import { SidebarToggle } from "@/components/sidebar-toggle";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "./icons";
import { useSidebar } from "./ui/sidebar";
import type { VisibilityType } from "./visibility-selector";

function PureChatHeader({
  chatId: _chatId,
  selectedVisibilityType: _selectedVisibilityType,
  isReadonly: _isReadonly,
}: {
  chatId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  // Unused parameters kept for compatibility
  const router = useRouter();
  const { open } = useSidebar();
  const [isClient, setIsClient] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setIsClient(true);
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // When sidebar is closed on desktop, show buttons below logo
  if (isClient && !open && windowWidth >= 768) {
    return (
      <>
        {/* Empty header to maintain layout */}
        <header className="sticky top-0 flex items-center gap-2 bg-background px-2 py-1.5 md:px-2">
          {/* Header is empty when sidebar is closed on desktop */}
        </header>

        {/* Floating buttons below logo */}
        <div className="fixed top-16 left-4 z-30 flex items-center gap-2">
          <SidebarToggle />
          <Button
            className="h-8 px-2"
            onClick={() => {
              router.push("/");
              router.refresh();
            }}
            variant="outline"
          >
            <PlusIcon />
            <span className="sr-only">New Chat</span>
          </Button>
        </div>
      </>
    );
  }

  // Normal header for when sidebar is open or on mobile
  return (
    <header className="sticky top-0 flex items-center gap-2 bg-background px-2 py-1.5 md:px-2">
      <SidebarToggle />

      {(!open || (isClient && windowWidth < 768)) && (
        <Button
          className="order-2 ml-auto h-8 px-2 md:order-1 md:ml-0 md:h-fit md:px-2"
          onClick={() => {
            router.push("/");
            router.refresh();
          }}
          variant="outline"
        >
          <PlusIcon />
          <span className="md:sr-only">New Chat</span>
        </Button>
      )}

      {/* Visibility selector removed - all chats are private by default */}
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return (
    prevProps.chatId === nextProps.chatId &&
    prevProps.selectedVisibilityType === nextProps.selectedVisibilityType &&
    prevProps.isReadonly === nextProps.isReadonly
  );
});
