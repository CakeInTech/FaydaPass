import { NextRequest, NextResponse } from "next/server";
import { decodeJWT } from "@/lib/jwt";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization header" },
        { status: 401 }
      );
    }
    const accessToken = authHeader.substring(7);
    const userinfoEndpoint = process.env.USERINFO_ENDPOINT!;
    const response = await fetch(userinfoEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Failed to fetch user information";
      try {
        const errorData = JSON.parse(errorText);
        errorMessage =
          errorData.error_description || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }
    const jwtToken = await response.text();
    try {
      const userInfo = decodeJWT(jwtToken);
      const processedUserInfo = {
        sub: userInfo.sub,
        name: userInfo.name || userInfo["name#en"] || userInfo["name#am"],
        email: userInfo.email,
        phone_number: userInfo.phone_number || userInfo.phone,
        picture: userInfo.picture,
        gender: userInfo.gender,
        birthdate: userInfo.birthdate,
        address: userInfo.address,
        name_en: userInfo["name#en"],
        name_am: userInfo["name#am"],
        fayda_id: userInfo.sub,
      };
      return NextResponse.json(processedUserInfo);
    } catch (jwtError) {
      return NextResponse.json(
        { error: "Failed to decode user information JWT" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error during userinfo fetch" },
      { status: 500 }
    );
  }
}
