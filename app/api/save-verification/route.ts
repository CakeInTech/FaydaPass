import { saveVerification } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Saving verification data:", body);

    const {
      user_email,
      status,
      type = "KYC",
      match_score,
      liveness_score,
      result_code,
      reason,
      api_provider = "fayda",
      metadata = {}
    } = body;

    // Validate required fields
    if (!user_email || !status) {
      return NextResponse.json(
        { error: "Missing required fields: user_email and status" },
        { status: 400 }
      );
    }

    // Save verification data
    const verification = await saveVerification({
      user_email,
      status,
      type,
      match_score,
      liveness_score,
      result_code,
      reason,
      api_provider,
      metadata
    });

    if (!verification) {
      return NextResponse.json(
        { error: "Failed to save verification data" },
        { status: 500 }
      );
    }

    console.log("✅ Verification saved successfully:", verification.id);
    return NextResponse.json({ 
      success: true, 
      verification_id: verification.id 
    });

  } catch (error) {
    console.error("Error saving verification:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
} 