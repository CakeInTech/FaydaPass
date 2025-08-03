import * as jose from "jose";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function signJwt(privateKeyJwk: any, claims: any) {
  const privateKey = await jose.importJWK(privateKeyJwk, "RS256");
  const jwt = await new jose.SignJWT(claims)
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .sign(privateKey);
  return jwt;
}

export async function POST(request: NextRequest) {
  try {
    const { code, code_verifier, client_id, redirect_uri } =
      await request.json();

    const tokenEndpoint =
      process.env.NEXT_PUBLIC_TOKEN_ENDPOINT ||
      "https://esignet.ida.fayda.et/v1/esignet/oauth/v2/token";
    const privateKeyStr = process.env.PRIVATE_KEY;

    if (!privateKeyStr) {
      throw new Error("PRIVATE_KEY environment variable is not set.");
    }

    const privateKeyJwk = JSON.parse(
      Buffer.from(privateKeyStr, "base64").toString("utf-8")
    );

    const claims = {
      iss: client_id,
      sub: client_id,
      aud: tokenEndpoint,
      exp: Math.floor(Date.now() / 1000) + 300, // 5 minutes expiration
      iat: Math.floor(Date.now() / 1000),
      jti: crypto.randomUUID(),
    };

    // Log the claims for debugging
    console.log("Generating client_assertion with claims:", claims);

    const clientAssertion = await signJwt(privateKeyJwk, claims);

    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      client_id: client_id,
      redirect_uri: redirect_uri,
      code_verifier: code_verifier,
      client_assertion_type:
        "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
      client_assertion: clientAssertion,
    });

    console.log("Sending request to token endpoint:", tokenEndpoint);
    console.log("Request body (form-urlencoded):", params.toString());

    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const responseBody = await response.json();

    if (!response.ok) {
      console.error("Token response body:", responseBody);
      return NextResponse.json(
        {
          error: responseBody.error || "Token exchange failed",
          error_description:
            responseBody.error_description || "Unknown error from provider",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(responseBody);
  } catch (error) {
    console.error("Internal server error in /api/token:", error);
    return NextResponse.json(
      {
        error: "internal_server_error",
        error_description:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
