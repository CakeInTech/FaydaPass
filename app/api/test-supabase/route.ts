import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        error: "Missing environment variables",
        supabaseUrl: !!supabaseUrl,
        supabaseServiceKey: !!supabaseServiceKey,
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Test basic connection
    const { data, error } = await supabaseAdmin
      .from("user_profiles")
      .select("count")
      .limit(1);

    if (error) {
      return NextResponse.json({
        error: "Database connection failed",
        details: error.message,
        code: error.code,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      data: data,
    });
  } catch (error) {
    return NextResponse.json({
      error: "Exception occurred",
      message: error.message,
    });
  }
}
