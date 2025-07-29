import { NextRequest, NextResponse } from "next/server";

async function createClientAssertion(
  clientId: string,
  tokenEndpoint: string,
  privateKeyJWK: string
): Promise<string> {
  const { SignJWT, importJWK } = await import("jose");

  let privateKey;
  try {
    // Decode the base64 encoded JWK
    const decoded = Buffer.from(privateKeyJWK, "base64").toString("utf-8");
    privateKey = JSON.parse(decoded);
    console.log("Private key parsed successfully, kid:", privateKey.kid);
  } catch (parseError) {
    console.error("Failed to parse private key:", parseError);
    throw new Error("Failed to parse private key JSON");
  }

  let key;
  try {
    key = await importJWK(privateKey, "RS256");
    console.log("JWK imported successfully");
  } catch (importError) {
    console.error("Failed to import JWK:", importError);
    throw new Error(`Failed to import JWK: ${importError.message}`);
  }

  const now = Math.floor(Date.now() / 1000);
  const jti = `${clientId}-${now}-${Math.random().toString(36).substring(2)}`;

  const payload = {
    iss: clientId,
    sub: clientId,
    aud: tokenEndpoint,
    jti,
    iat: now,
    exp: now + 15 * 60, // 15 minutes as per Fayda documentation
  };

  const header = {
    alg: "RS256",
    typ: "JWT",
    kid: privateKey.kid,
  };

  console.log("JWT payload:", payload);
  console.log("JWT header:", header);

  let jwt;
  try {
    jwt = await new SignJWT(payload).setProtectedHeader(header).sign(key);
    console.log("JWT signed successfully");
  } catch (signError) {
    console.error("Failed to sign JWT:", signError);
    throw new Error(`Failed to sign JWT: ${signError.message}`);
  }

  return jwt;
}

export async function POST(request: NextRequest) {
  try {
    console.log("=== TOKEN EXCHANGE START ===");

    const body = await request.json();
    console.log("Request body:", body);

    const { code, code_verifier, client_id, redirect_uri } = body;

    // Validate required parameters
    if (!code || !code_verifier || !client_id || !redirect_uri) {
      console.error("Missing required parameters:", {
        code: !!code,
        code_verifier: !!code_verifier,
        client_id: !!client_id,
        redirect_uri: !!redirect_uri,
      });
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Check environment variables
    const tokenEndpoint = process.env.TOKEN_ENDPOINT;
    const clientAssertionType = process.env.CLIENT_ASSERTION_TYPE;
    const privateKeyBase64 = process.env.PRIVATE_KEY; // Changed from PRIVATE_KEY_BASE64

    console.log("Environment check:", {
      tokenEndpoint: !!tokenEndpoint,
      clientAssertionType: !!clientAssertionType,
      privateKeyBase64: !!privateKeyBase64,
    });

    if (!tokenEndpoint || !clientAssertionType || !privateKeyBase64) {
      console.error("Missing environment variables");
      return NextResponse.json(
        { error: "Server configuration error - missing environment variables" },
        { status: 500 }
      );
    }

    // Create client assertion JWT
    let clientAssertion;
    try {
      console.log("Creating client assertion...");
      clientAssertion = await createClientAssertion(
        client_id,
        tokenEndpoint,
        privateKeyBase64
      );
      console.log("Client assertion created successfully");
    } catch (jwtError) {
      console.error("JWT creation error:", jwtError);
      return NextResponse.json(
        {
          error: "Failed to create client assertion",
          details: jwtError.message,
        },
        { status: 500 }
      );
    }

    // Prepare token request parameters
    const tokenParams = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id,
      redirect_uri,
      code_verifier,
      client_assertion_type: clientAssertionType,
      client_assertion: clientAssertion,
    });

    console.log(
      "Token request parameters:",
      Object.fromEntries(tokenParams.entries())
    );

    // Make token request to Fayda
    console.log("Making request to token endpoint:", tokenEndpoint);
    const tokenResponse = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        "User-Agent": "FaydaPass/1.0",
      },
      body: tokenParams.toString(),
    });

    console.log("Token response status:", tokenResponse.status);
    console.log(
      "Token response headers:",
      Object.fromEntries(tokenResponse.headers.entries())
    );

    const responseText = await tokenResponse.text();
    console.log("Token response body:", responseText);

    let tokenData;
    try {
      tokenData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse token response:", parseError);
      return NextResponse.json(
        {
          error: "Invalid response format from token endpoint",
          raw_response: responseText,
          status: tokenResponse.status,
        },
        { status: 500 }
      );
    }

    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", tokenData);
      return NextResponse.json(
        {
          error: tokenData.error || "Token exchange failed",
          error_description: tokenData.error_description || "Unknown error",
          status: tokenResponse.status,
          details: tokenData,
          raw_response: responseText,
        },
        { status: tokenResponse.status }
      );
    }

    console.log("✅ Token exchange successful");
    return NextResponse.json(tokenData);
  } catch (error) {
    console.error("Unexpected error in token exchange:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
