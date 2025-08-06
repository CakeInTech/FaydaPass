import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, adminSecret } = await request.json();

    // Validate admin secret (you should change this to a secure value)
    const expectedAdminSecret =
      process.env.ADMIN_SECRET || "faydapass_admin_2025";
    if (adminSecret !== expectedAdminSecret) {
      return NextResponse.json(
        { error: "Invalid admin secret" },
        { status: 401 }
      );
    }

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists by trying to create and catch the error
    // We'll handle the duplicate user error in the createUser call

    // Create the user in Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          name,
          role: "admin",
          plan_type: "business",
          is_admin: true,
        },
      });

    if (authError) {
      console.error("Auth creation error:", authError);

      // Check if it's a duplicate user error
      if (authError.message.includes("already registered")) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Failed to create user account", details: authError.message },
        { status: 500 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Failed to create user account" },
        { status: 500 }
      );
    }

    // Create user profile in our database
    const { error: profileError } = await supabase
      .from("user_profiles")
      .insert({
        id: authData.user.id,
        email: email,
        name: name,
        role: "admin",
        plan_type: "business",
        company_name: "FaydaPass Admin",
        api_key: `fp_admin_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        metadata: {
          is_admin: true,
          created_by: "admin_creation",
          created_at: new Date().toISOString(),
        },
      });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      // If profile creation fails, we should clean up the auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: "Failed to create user profile" },
        { status: 500 }
      );
    }

    // Generate a secure API key for the admin
    const apiKey = `fp_admin_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Update the profile with the API key
    await supabase
      .from("user_profiles")
      .update({ api_key: apiKey })
      .eq("id", authData.user.id);

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      user: {
        id: authData.user.id,
        email: email,
        name: name,
        role: "admin",
        api_key: apiKey,
      },
    });
  } catch (error) {
    console.error("Admin creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
