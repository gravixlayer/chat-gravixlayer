#!/usr/bin/env node

// PNPM-optimized development script
// Ensures optimal performance with pnpm dev

const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

console.log("🚀 Starting PNPM-optimized development...");

// Check if pnpm is available
function checkPnpm() {
  try {
    const result = spawn.sync("pnpm", ["--version"], { encoding: "utf8" });
    if (result.status === 0) {
      console.log(`✅ PNPM version: ${result.stdout.trim()}`);
      return true;
    }
  } catch (error) {
    console.error("❌ PNPM not found. Please install pnpm:");
    console.error("npm install -g pnpm");
    return false;
  }
}

// Optimize pnpm store
function optimizePnpmStore() {
  console.log("🧹 Optimizing PNPM store...");
  try {
    spawn.sync("pnpm", ["store", "prune"], { stdio: "inherit" });
    console.log("✅ PNPM store optimized");
  } catch (error) {
    console.warn("⚠️ Could not optimize PNPM store");
  }
}

// Clear Next.js cache
function clearNextCache() {
  console.log("🧹 Clearing Next.js cache...");
  const cacheDir = path.join(process.cwd(), ".next");
  if (fs.existsSync(cacheDir)) {
    fs.rmSync(cacheDir, { recursive: true, force: true });
    console.log("✅ Next.js cache cleared");
  }
}

// Main function
async function main() {
  if (!checkPnpm()) {
    process.exit(1);
  }

  // Optimize environment
  optimizePnpmStore();
  clearNextCache();

  console.log("🔄 Starting development server with PNPM...");

  // Start development server
  const devProcess = spawn("pnpm", ["dev"], {
    stdio: "inherit",
    shell: true,
  });

  // Handle process termination
  process.on("SIGINT", () => {
    console.log("\n🛑 Shutting down development server...");
    devProcess.kill("SIGINT");
    process.exit(0);
  });

  devProcess.on("exit", (code) => {
    console.log(`\n📊 Development server exited with code ${code}`);
    process.exit(code);
  });
}

if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Error starting development server:", error);
    process.exit(1);
  });
}

module.exports = { main, checkPnpm, optimizePnpmStore, clearNextCache };
