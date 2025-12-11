"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "next-auth";
import { ApiKeySection } from "@/components/api-key-section";
import { PlusIcon } from "@/components/icons";
import { RateLimitIndicator } from "@/components/rate-limit-indicator";
// Test components removed
// Test button removed
import { SidebarHistory } from "@/components/sidebar-history";
import { SidebarUserNav } from "@/components/sidebar-user-nav";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function AppSidebar({ user }: { user: User | undefined }) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row items-center justify-between">
            <Link
              className="flex flex-row items-center gap-3"
              href="/"
              onClick={() => {
                setOpenMobile(false);
              }}
            >
              <span className="flex cursor-pointer items-center gap-3 rounded-md px-2 font-semibold text-xl hover:bg-muted">
                <Image
                  alt="Gravix Layer Logo"
                  className="rounded"
                  height={24}
                  src="/images/gravixlayer-logo.png"
                  style={{ width: "auto", height: "24px" }}
                  width={22}
                  unoptimized
                />
                <span style={{ letterSpacing: "-0.05em" }}>
                  Gravix<span style={{ color: "#4f46e4" }}> Layer</span>
                </span>
              </span>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="h-8 p-1 md:h-fit md:p-2"
                  onClick={() => {
                    setOpenMobile(false);
                    router.push("/");
                    router.refresh();
                  }}
                  type="button"
                  variant="ghost"
                >
                  <PlusIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent align="end" className="hidden md:block">
                New Chat
              </TooltipContent>
            </Tooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <RateLimitIndicator />
        <ApiKeySection />
        {/* Rate limit indicator will hide automatically when API key is added */}
        <SidebarHistory user={user} />
      </SidebarContent>
      <SidebarFooter>{user && <SidebarUserNav user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
