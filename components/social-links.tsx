"use client";

import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";

// Custom X (Twitter) logo component
function XLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// Custom Discord logo component
function DiscordLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

// Custom YouTube logo component
function YouTubeLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const socialLinks = [
  {
    name: "Discord",
    url: "https://discord.com/invite/9GAZpeYB",
    icon: DiscordLogo,
    color: "hover:text-[#5865F2]",
  },
  {
    name: "GitHub",
    url: "https://github.com/gravixlayer",
    icon: GitHubLogoIcon,
    color: "hover:text-gray-900 dark:hover:text-white",
  },
  {
    name: "X",
    url: "https://x.com/GravixLayer",
    icon: XLogo,
    color: "hover:text-black dark:hover:text-white",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/gravixlayer/posts/?feedView=all",
    icon: LinkedInLogoIcon,
    color: "hover:text-[#0077B5]",
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@GravixLayer/videos",
    icon: YouTubeLogo,
    color: "hover:text-[#FF0000]",
  },
];

export function SocialLinks() {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-row gap-1.5">
      {socialLinks.map((link) => {
        const Icon = link.icon;
        return (
          <a
            className={`group flex size-8 items-center justify-center rounded-full border bg-background/80 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:shadow-md ${link.color}`}
            href={link.url}
            key={link.name}
            rel="noopener noreferrer"
            target="_blank"
            title={link.name}
          >
            <Icon className="size-4 text-muted-foreground transition-colors group-hover:text-current" />
          </a>
        );
      })}
    </div>
  );
}
