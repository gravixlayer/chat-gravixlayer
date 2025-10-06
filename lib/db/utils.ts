import { generateId } from "ai";

export async function generateHashedPassword(password: string) {
  // Use Web Crypto API for Edge Runtime compatibility
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

export async function generateDummyPassword() {
  const password = generateId();
  const hashedPassword = await generateHashedPassword(password);

  return hashedPassword;
}
