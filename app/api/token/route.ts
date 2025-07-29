import { NextRequest, NextResponse } from "next/server";

async function createClientAssertion(
  clientId: string,
  tokenEndpoint: string,
  privateKeyJWK: string
): Promise<string> {
  const { SignJWT, importJWK } = await import("jose");
  let privateKey;
  try {
    const decoded = Buffer.from(privateKeyJWK, "base64").toString("utf-8");
    privateKey = JSON.parse(decoded);
  } catch (parseError) {
    throw new Error("Failed to parse private key JSON");
  }
  let key;
  try {
    key = await importJWK(privateKey, "RS256");
  } catch (importError) {
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
    exp: now + 15 * 60,
  };
  const header = {
    alg: "RS256",
    typ: "JWT",
    kid: privateKey.kid,
  };
  let jwt;
  try {
    jwt = await new SignJWT(payload).setProtectedHeader(header).sign(key);
  } catch (signError) {
    throw new Error(`Failed to sign JWT: ${signError.message}`);
  }
  return jwt;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, code_verifier, client_id, redirect_uri } = body;
    if (!code || !code_verifier || !client_id || !redirect_uri) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }
    if (
      !process.env.TOKEN_ENDPOINT ||
      !process.env.CLIENT_ASSERTION_TYPE ||
      !process.env.PRIVATE_KEY_BASE64
    ) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }
    let clientAssertion;
    try {
      clientAssertion = await createClientAssertion(
        client_id,
        process.env.TOKEN_ENDPOINT,
        process.env.PRIVATE_KEY_BASE64
      );
    } catch (jwtError) {
      return NextResponse.json(
        {
          error: "Failed to create client assertion",
          details: jwtError.message,
        },
        { status: 500 }
      );
    }
    const tokenParams = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id,
      redirect_uri,
      code_verifier,
      client_assertion_type: process.env.CLIENT_ASSERTION_TYPE,
      client_assertion: clientAssertion,
    });
    const tokenResponse = await fetch(process.env.TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        "User-Agent": "FaydaPass/1.0",
      },
      body: tokenParams.toString(),
    });
    const responseText = await tokenResponse.text();
    let tokenData;
    try {
      tokenData = JSON.parse(responseText);
    } catch (parseError) {
      return NextResponse.json(
        {
          error: "Invalid response format",
          raw_response: responseText,
          status: tokenResponse.status,
        },
        { status: 500 }
      );
    }
    if (!tokenResponse.ok) {
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
    return NextResponse.json(tokenData);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
