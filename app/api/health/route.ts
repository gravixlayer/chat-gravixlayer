import { NextResponse } from "next/server";

// Vercel Edge Runtime for fastest response
export const runtime = "edge";
export const preferredRegion = "auto";

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      runtime: "edge",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60",
      },
    }
  );
}
