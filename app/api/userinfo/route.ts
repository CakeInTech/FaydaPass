import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Dummy validation - in production, this would validate the access token
    if (!token || token === "invalid_token") {
      return NextResponse.json(
        { error: "Invalid access token" },
        { status: 401 }
      );
    }

    // Dummy user info response - in production, this would fetch real user data
    const dummyUserInfo = {
      sub: "dummy_user_" + Math.random().toString(36).substring(7),
      name: "John Doe",
      given_name: "John",
      family_name: "Doe",
      email: "john.doe@example.com",
      email_verified: true,
      phone_number: "+251911234567",
      phone_number_verified: true,
      picture: "https://via.placeholder.com/150x150?text=JD",
      gender: "male",
      birthdate: "1990-01-01",
      address: {
        formatted: "Addis Ababa, Ethiopia",
        locality: "Addis Ababa",
        country: "Ethiopia",
      },
      updated_at: Math.floor(Date.now() / 1000),
    };

    return NextResponse.json(dummyUserInfo);
  } catch (error) {
    console.error("Userinfo error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
