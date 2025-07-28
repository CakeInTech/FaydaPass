import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, code_verifier, client_id, redirect_uri } = body;

    // Dummy validation - in production, this would validate with the OAuth provider
    if (!code || !code_verifier || !client_id || !redirect_uri) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Dummy response - in production, this would exchange the code for tokens
    const dummyResponse = {
      access_token:
        "dummy_access_token_" + Math.random().toString(36).substring(7),
      token_type: "Bearer",
      expires_in: 3600,
      id_token: "dummy_id_token_" + Math.random().toString(36).substring(7),
      scope: "openid profile email",
    };

    return NextResponse.json(dummyResponse);
  } catch (error) {
    console.error("Token exchange error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
