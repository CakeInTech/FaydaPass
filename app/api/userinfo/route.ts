import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    console.log("=== USERINFO REQUEST START ===");

    const authHeader = request.headers.get("Authorization");
    console.log("Authorization header:", authHeader ? "Present" : "Missing");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("Missing or invalid authorization header");
      return NextResponse.json(
        { error: "Missing or invalid authorization header" },
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7);
    console.log("Access token (first 20 chars):", accessToken.substring(0, 20));

    const userinfoEndpoint = process.env.NEXT_PUBLIC_USERINFO_ENDPOINT;
    console.log("UserInfo endpoint:", userinfoEndpoint);

    if (!userinfoEndpoint) {
      console.error("USERINFO_ENDPOINT not configured");
      return NextResponse.json(
        { error: "UserInfo endpoint not configured" },
        { status: 500 }
      );
    }

    console.log("Making request to userinfo endpoint...");
    const response = await fetch(userinfoEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "User-Agent": "FaydaPass/1.0",
      },
    });

    console.log("UserInfo response status:", response.status);
    console.log(
      "UserInfo response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("UserInfo request failed:", errorText);

      let errorMessage = "Failed to fetch user information";
      try {
        const errorData = JSON.parse(errorText);
        errorMessage =
          errorData.error_description || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }

      return NextResponse.json(
        {
          error: errorMessage,
          status: response.status,
          raw_response: errorText,
        },
        { status: response.status }
      );
    }

    const responseText = await response.text();
    console.log("UserInfo response body:", responseText);

    try {
      // Try to parse as JSON first
      const jsonData = JSON.parse(responseText);
      console.log("✅ UserInfo parsed as JSON:", jsonData);
      return NextResponse.json(jsonData);
    } catch (jwtError) {
      console.log("Not JSON, trying as JWT...");

      // If not JSON, try to decode as JWT
      try {
        const parts = responseText.split(".");
        if (parts.length !== 3) {
          throw new Error("Invalid JWT format");
        }

        const payload = JSON.parse(
          Buffer.from(parts[1], "base64url").toString()
        );
        console.log("✅ UserInfo decoded from JWT:", payload);

        const processedUserInfo = {
          sub: payload.sub,
          name: payload.name || payload["name#en"] || payload["name#am"],
          email: payload.email,
          phone_number: payload.phone_number || payload.phone,
          picture: payload.picture,
          gender: payload.gender,
          birthdate: payload.birthdate,
          address: payload.address,
          name_en: payload["name#en"],
          name_am: payload["name#am"],
          fayda_id: payload.sub,
        };

        return NextResponse.json(processedUserInfo);
      } catch (decodeError) {
        console.error("Failed to decode userinfo response:", decodeError);
        return NextResponse.json(
          {
            error: "Failed to decode user information",
            raw_response: responseText,
          },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error("Unexpected error in userinfo:", error);
    return NextResponse.json(
      {
        error: "Internal server error during userinfo fetch",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
