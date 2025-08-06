import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    // Check if API key exists in user_profiles
    const { data: profile, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("api_key", apiKey)
      .single();

    if (error || !profile) {
      return NextResponse.json(
        {
          error: "Invalid API key",
          valid: false,
          plan: "",
          permissions: [],
        },
        { status: 401 }
      );
    }

    // Return company/developer info
    return NextResponse.json({
      valid: true,
      plan: profile.plan_type,
      permissions: ["kyc_verify", "kyc_status", "kyc_list", "usage_stats"],
      company: {
        id: profile.id,
        name: profile.company_name || profile.name,
        email: profile.email,
        role: profile.role,
        plan_type: profile.plan_type,
      },
    });
  } catch (error) {
    console.error("API key validation error:", error);
    return NextResponse.json(
      {
        error: "Validation failed",
        valid: false,
        plan: "",
        permissions: [],
      },
      { status: 500 }
    );
  }
}
