// JWT utilities for client assertion with proper RSA signing
import crypto from "crypto";

interface JWTHeader {
  alg: string;
  typ: string;
  kid?: string;
}

interface JWTPayload {
  iss: string;
  sub: string;
  aud: string;
  iat: number;
  exp: number;
}

// Base64 decode the private key
function getPrivateKey(): string {
  const privateKeyB64 = process.env.PRIVATE_KEY_BASE64_B64;
  try {
    const decodedKey = Buffer.from(privateKeyB64, "base64").toString("utf-8");
    const jwk = JSON.parse(decodedKey);

    // Convert JWK to PEM format for Node.js crypto
    const keyObject = crypto.createPrivateKey({
      key: jwk,
      format: "jwk",
    });

    return keyObject.export({
      type: "pkcs8",
      format: "pem",
    }) as string;
  } catch (error) {
    console.error("Error processing private key:", error);
    throw new Error("Failed to process private key");
  }
}

export function createClientAssertion(
  clientId: string,
  tokenEndpoint: string
): string {
  const header: JWTHeader = {
    alg: "RS256",
    typ: "JWT",
    kid: "0b194df4-7149-4146-97c5-78fdf0d4fb1d", // From the JWK
  };

  const now = Math.floor(Date.now() / 1000);
  const payload: JWTPayload = {
    iss: clientId,
    sub: clientId,
    aud: tokenEndpoint,
    iat: now,
    exp: now + 300, // 5 minutes
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString(
    "base64url"
  );
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url"
  );

  const signingInput = `${encodedHeader}.${encodedPayload}`;

  try {
    const privateKey = getPrivateKey();
    const signature = crypto.sign(
      "RSA-SHA256",
      Buffer.from(signingInput),
      privateKey
    );
    const encodedSignature = signature.toString("base64url");

    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
  } catch (error) {
    console.error("JWT signing error:", error);
    throw new Error("Failed to create client assertion");
  }
}

export function decodeJWT(token: string): any {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT format");
    }

    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
    return payload;
  } catch (error) {
    console.error("JWT decode error:", error);
    throw new Error("Failed to decode JWT");
  }
}
