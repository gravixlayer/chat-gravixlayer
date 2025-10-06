"use client";

import Image from "next/image";
import Link from "next/link";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export function GravixLogo() {
  const { open } = useSidebar();
  const isMobile = useIsMobile();

  // Only show when sidebar is closed and not on mobile
  if (open || isMobile) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 z-30">
      <Link
        className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
        href="/"
      >
        <Image
          alt="Gravix Layer Logo"
          className="rounded transition-transform group-hover:scale-105"
          height={28}
          src="/images/gravixlayer-logo.png"
          style={{ width: "auto", height: "28px" }}
          width={28}
        />
        <span
          className="font-semibold text-lg"
          style={{ letterSpacing: "-0.05em" }}
        >
          Gravix<span style={{ color: "#4f46e4" }}> Layer</span>
        </span>
      </Link>
    </div>
  );
}
