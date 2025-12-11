import { NextResponse } from "next/server";
import { auth, signIn } from "@/app/(auth)/auth";

// Use Node.js runtime for auth operations
export const preferredRegion = "auto";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const redirectUrl = searchParams.get("redirectUrl") || "/";

  const session = await auth();

  if (session) {
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return signIn("guest", { redirect: true, redirectTo: redirectUrl });
}
