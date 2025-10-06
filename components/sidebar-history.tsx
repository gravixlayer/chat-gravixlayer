"use client";

import type { User } from "next-auth";
import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";

export function SidebarHistory({ user: _ }: { user: User | undefined }) {
  return (
    <SidebarGroup>
      <SidebarGroupContent />
    </SidebarGroup>
  );
}
