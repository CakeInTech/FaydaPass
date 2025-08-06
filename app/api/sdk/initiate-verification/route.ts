import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { apiKey, userEmail, redirectUrl, metadata } = await request.json();

    if (!apiKey || !userEmail) {
      return NextResponse.json(
        { error: "API key and user email are required" },
        { status: 400 }
      );
    }

    // First, validate the API key and get company info
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("api_key", apiKey)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    // Create verification record for this company
    const verificationId = `vp_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const { data: verification, error: verificationError } = await supabase
      .from("verification_records")
      .insert({
        user_id: profile.id, // This links to the company/developer
        user_email: userEmail,
        status: "pending",
        type: "KYC",
        user_data: {
          ...metadata,
          company_id: profile.id,
          company_name: profile.company_name || profile.name,
          redirect_url: redirectUrl,
          created_at: new Date().toISOString(),
        },
      })
      .select()
      .single();

    if (verificationError) {
      console.error("Verification creation error:", verificationError);
      return NextResponse.json(
        { error: "Failed to create verification record" },
        { status: 500 }
      );
    }

    // Log API usage
    await supabase.from("api_usage").insert({
      user_id: profile.id,
      endpoint: "/api/sdk/initiate-verification",
      method: "POST",
      status_code: 200,
      response_time: 0, // You can calculate this
    });

    return NextResponse.json({
      success: true,
      message: "Verification initiated successfully",
      data: {
        verificationId: verification.id,
        authUrl: `${
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        }/verify/${verification.id}`,
        status: verification.status,
        createdAt: verification.created_at,
        company: {
          id: profile.id,
          name: profile.company_name || profile.name,
          plan_type: profile.plan_type,
        },
      },
    });
  } catch (error) {
    console.error("SDK initiation error:", error);
    return NextResponse.json(
      {
        error: "Initiation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
