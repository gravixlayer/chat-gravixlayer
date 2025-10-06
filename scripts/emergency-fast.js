#!/usr/bin/env node

// Emergency fast development mode
// Disables all optimizations for maximum speed

const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

console.log("🚨 EMERGENCY FAST MODE - Disabling all optimizations...");

// Create minimal next.config.ts
const minimalConfig = `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Absolutely minimal config for maximum speed
  experimental: {
    ppr: false,
  },
  compress: false,
  generateEtags: false,
  poweredByHeader: false,
};

export default nextConfig;`;

// Backup current config
const configPath = path.join(process.cwd(), "next.config.ts");
const backupPath = path.join(process.cwd(), "next.config.ts.backup");

if (fs.existsSync(configPath)) {
  fs.copyFileSync(configPath, backupPath);
  console.log("📦 Backed up next.config.ts");
}

// Write minimal config
fs.writeFileSync(configPath, minimalConfig);
console.log("⚡ Applied minimal configuration");

// Clear cache
const cacheDir = path.join(process.cwd(), ".next");
if (fs.existsSync(cacheDir)) {
  fs.rmSync(cacheDir, { recursive: true, force: true });
  console.log("🧹 Cleared Next.js cache");
}

console.log("🚀 Starting emergency fast mode...");

// Start development server
const devProcess = spawn("next", ["dev", "--port", "3000"], {
  stdio: "inherit",
  shell: true,
});

// Handle process termination
process.on("SIGINT", () => {
  console.log("\n🔄 Restoring original configuration...");

  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, configPath);
    fs.unlinkSync(backupPath);
    console.log("✅ Configuration restored");
  }

  devProcess.kill("SIGINT");
  process.exit(0);
});

devProcess.on("exit", (code) => {
  console.log(`\n📊 Development server exited with code ${code}`);

  // Restore config on exit
  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, configPath);
    fs.unlinkSync(backupPath);
    console.log("✅ Configuration restored");
  }

  process.exit(code);
});
