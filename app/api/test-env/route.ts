import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return NextResponse.json({
    supabaseUrl: supabaseUrl ? "Set" : "Missing",
    supabaseServiceKey: supabaseServiceKey ? "Set" : "Missing",
    envCheck: {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseServiceKey,
      urlLength: supabaseUrl?.length || 0,
      keyLength: supabaseServiceKey?.length || 0,
    },
  });
}
