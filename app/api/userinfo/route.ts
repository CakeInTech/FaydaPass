import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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
    console.log("Full access token:", accessToken);

    // Try to decode the JWT to see what's inside
    try {
      const tokenParts = accessToken.split(".");
      if (tokenParts.length === 3) {
        const payload = JSON.parse(
          Buffer.from(tokenParts[1], "base64url").toString()
        );
        console.log("Access token payload:", payload);
      }
    } catch (decodeError) {
      console.log(
        "Could not decode access token as JWT:",
        decodeError instanceof Error
          ? decodeError.message
          : "Unknown decode error"
      );
    }

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
    console.log("Request headers being sent:", {
      Authorization: `Bearer ${accessToken.substring(0, 20)}...`,
      Accept: "application/json",
      "User-Agent": "FaydaPass/1.0",
    });

    // Try different approaches to fix the 401 error
    const attempts: RequestInit[] = [
      // Attempt 1: POST request (some OIDC providers require POST)
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `access_token=${encodeURIComponent(accessToken)}`,
      },
      // Attempt 2: GET with minimal headers
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      // Attempt 3: GET with different Accept header
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/jwt",
        },
      },
      // Attempt 4: Original approach
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    ];

    for (let i = 0; i < attempts.length; i++) {
      const attempt = attempts[i];
      console.log(`\n=== ATTEMPT ${i + 1} ===`);
      console.log("Method:", attempt.method);
      console.log("Headers:", attempt.headers);
      if (attempt.body) console.log("Body:", attempt.body);

      try {
        const response = await fetch(userinfoEndpoint, attempt);

        console.log(`Attempt ${i + 1} response status:`, response.status);
        console.log(
          `Attempt ${i + 1} response headers:`,
          Object.fromEntries(response.headers.entries())
        );

        if (response.ok) {
          const responseText = await response.text();
          console.log("✅ SUCCESS with attempt 2!");
          console.log("Response body:", responseText.substring(0, 200) + "...");

          try {
            // Try to parse as JSON first
            const jsonData = JSON.parse(responseText);
            console.log("✅ UserInfo parsed as JSON:", jsonData);

            // Save to verifications table
            if (supabase) {
              try {
                const verificationData: Partial<Verification> = {
                  user_email: jsonData.email || "unknown",
                  status: "success",
                  fayda_id: jsonData.sub,
                  api_provider: "OIDC Provider",
                  user_data: jsonData,
                };
                const { error: insertError } = await supabase
                  .from("verifications")
                  .insert(verificationData);

                if (insertError) {
                  console.error(
                    "Supabase insert error (JSON):",
                    insertError.message
                  );
                } else {
                  console.log("✅ Verification saved to database (JSON).");
                }
              } catch (dbError) {
                console.error("Error saving to Supabase (JSON):", dbError);
              }
            } else {
              console.warn("Supabase client not initialized. Skipping DB save.");
            }

            return NextResponse.json(jsonData);
          } catch (jwtError) {
            console.log("Not JSON, trying as JWT...");

            // If not JSON, try to decode as JWT
            try {
              const parts = responseText.split(".");
              if (parts.length !== 3) throw new Error("Invalid JWT structure");
              const payload = JSON.parse(
                Buffer.from(parts[1], "base64url").toString()
              );
              console.log("✅ UserInfo decoded from JWT:", payload);

              const processedUserInfo = {
                sub: payload.sub,
                name: payload.name,
                email: payload.email,
                phone_number: payload.phone_number,
                picture: payload.picture,
                gender: payload.gender,
                birthdate: payload.birthdate,
                address: payload.address,
                name_en: payload["name#en"],
                name_am: payload["name#am"],
                fayda_id: payload.sub,
              };

              // Save to verifications table
              if (supabase) {
                try {
                  const verificationData: Partial<Verification> = {
                    user_email: processedUserInfo.email || "unknown",
                    status: "success",
                    fayda_id: processedUserInfo.fayda_id,
                    api_provider: "OIDC Provider",
                    user_data: payload,
                  };
                  const { error: insertError } = await supabase
                    .from("verifications")
                    .insert(verificationData);

                  if (insertError) {
                    console.error(
                      "Supabase insert error (JWT):",
                      insertError.message
                    );
                  } else {
                    console.log("✅ Verification saved to database (JWT).");
                  }
                } catch (dbError) {
                  console.error("Error saving to Supabase (JWT):", dbError);
                }
              } else {
                console.warn(
                  "Supabase client not initialized. Skipping DB save."
                );
              }

              return NextResponse.json(processedUserInfo);
            } catch (decodeError) {
              console.error("Failed to decode userinfo response:", decodeError);
              // Continue to next attempt
            }
          }
        } else {
          const errorText = await response.text();
          console.log(`Attempt ${i + 1} failed with:`, errorText);
          // Continue to next attempt
        }
      } catch (fetchError) {
        console.error(`Attempt ${i + 1} fetch error:`, fetchError);
        // Continue to next attempt
      }
    }

    // If all attempts failed, return the last error
    console.error("❌ ALL ATTEMPTS FAILED");
    return NextResponse.json(
      {
        error: "All userinfo request attempts failed",
        details:
          "Tried POST with form data, GET with minimal headers, GET with JWT accept, and GET with JSON headers",
      },
      { status: 401 }
    );
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
