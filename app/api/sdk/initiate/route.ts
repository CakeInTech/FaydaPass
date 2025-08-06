import { NextRequest, NextResponse } from "next/server";
import { FaydaPass } from "@/lib/faydapass-sdk";

export async function POST(request: NextRequest) {
  try {
    const { apiKey, userEmail, redirectUrl } = await request.json();

    if (!apiKey || !userEmail) {
      return NextResponse.json(
        { error: "API key and user email are required" },
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

    // Test verification initiation
    const result = await faydapass.initiateVerification({
      userEmail,
      redirectUrl,
      metadata: {
        source: "sdk_test",
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Verification initiation completed",
      data: result,
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
