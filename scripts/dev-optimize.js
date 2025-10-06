#!/usr/bin/env node

// Development optimization script
// Run this to pre-warm the Next.js cache

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 Optimizing development environment...");

// Pre-compile critical routes
const criticalRoutes = [
  "/",
  "/chat/test-id",
  "/api/auth/session",
  "/api/history",
];

async function preWarmRoutes() {
  console.log("📦 Pre-warming critical routes...");

  for (const route of criticalRoutes) {
    try {
      const response = await fetch(`http://localhost:3000${route}`, {
        method: "GET",
        headers: { "User-Agent": "dev-optimizer" },
      });
      console.log(`✅ Pre-warmed: ${route} (${response.status})`);
    } catch (error) {
      console.log(`⚠️ Could not pre-warm: ${route}`);
    }
  }
}

// Clear Next.js cache
function clearCache() {
  console.log("🧹 Clearing Next.js cache...");
  const cacheDir = path.join(process.cwd(), ".next");
  if (fs.existsSync(cacheDir)) {
    fs.rmSync(cacheDir, { recursive: true, force: true });
    console.log("✅ Cache cleared");
  }
}

// Main optimization function
async function optimize() {
  clearCache();

  console.log("🔄 Starting Next.js in development mode...");
  // Detect package manager and use appropriate command
  const packageManager = process.env.npm_config_user_agent?.includes("pnpm")
    ? "pnpm"
    : "npm";
  console.log(`📦 Using package manager: ${packageManager}`);
  const nextProcess = spawn(packageManager, ["run", "dev"], {
    stdio: "inherit",
    shell: true,
  });

  // Wait for server to start
  setTimeout(async () => {
    await preWarmRoutes();
    console.log("🎉 Development environment optimized!");
  }, 5000);

  process.on("SIGINT", () => {
    nextProcess.kill();
    process.exit();
  });
}

if (require.main === module) {
  optimize();
}

module.exports = { optimize, preWarmRoutes, clearCache };
