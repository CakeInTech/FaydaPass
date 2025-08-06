import { NextRequest, NextResponse } from "next/server";
import { FaydaPass } from "@/lib/faydapass-sdk";

export async function POST(request: NextRequest) {
  try {
    const { apiKey, verificationId } = await request.json();

    if (!apiKey || !verificationId) {
      return NextResponse.json(
        { error: "API key and verification ID are required" },
        { status: 400 }
      );
    }

    // Create SDK instance
    const faydapass = new FaydaPass({
      apiKey,
      baseUrl:
        process.env.NEXT_PUBLIC_FAYDAPASS_API_URL ||
        "https://api.faydapass.com",
    });

    // Test verification status check
    const result = await faydapass.getVerificationStatus(verificationId);

    return NextResponse.json({
      success: true,
      message: "Verification status check completed",
      data: result,
    });
  } catch (error) {
    console.error("SDK status check error:", error);
    return NextResponse.json(
      {
        error: "Status check failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
