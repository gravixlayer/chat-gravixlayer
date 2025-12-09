import { registerOTel } from "@vercel/otel";

export function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    registerOTel({ serviceName: "ai-chatbot" });
  }
}
