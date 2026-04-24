import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This route is kept for backwards compatibility but uploads are now done
// directly from the browser to Supabase to bypass Vercel's 4.5MB body limit.
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "Use direct Supabase upload from browser" },
    { status: 410 },
  );
}
