import { NextRequest, NextResponse } from "next/server";
import { FaydaPass } from "@/lib/faydapass-sdk";

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
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

    // Test API key validation
    const result = await faydapass.validateApiKey();

    return NextResponse.json({
      success: true,
      message: "API key validation completed",
      data: result,
    });
  } catch (error) {
    console.error("SDK validation error:", error);
    return NextResponse.json(
      {
        error: "Validation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
