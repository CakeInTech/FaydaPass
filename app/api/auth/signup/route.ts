import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    // Add timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Request timeout")), 15000); // 15 second timeout
    });

    const signupPromise = async () => {
      const { email, password, userData } = await request.json();

      console.log("Signup API called with:", { email, userData });

      if (!email || !password || !userData) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !supabaseServiceKey) {
        console.error("Missing Supabase environment variables");
        return NextResponse.json(
          { error: "Supabase not configured" },
          { status: 500 }
        );
      }

      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

      // Check if user already exists
      const { data: existingProfiles, error: existingError } =
        await supabaseAdmin
          .from("user_profiles")
          .select("email")
          .eq("email", email);

      if (existingError) {
        console.error("Database connection error:", existingError);
        return NextResponse.json(
          { error: "Database connection error" },
          { status: 500 }
        );
      }

      if (existingProfiles && existingProfiles.length > 0) {
        return NextResponse.json(
          { error: "User already exists" },
          { status: 400 }
        );
      }

      // Create auth user with admin client
      const { data: authData, error: authError } =
        await supabaseAdmin.auth.admin
          .createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
              name: userData.name,
              role: userData.role,
            },
          })
          .catch((error) => {
            console.error("Supabase connection error:", error);
            throw new Error(
              "Failed to connect to authentication service. Please try again."
            );
          });

      if (authError) {
        console.error("Auth user creation error:", authError);
        return NextResponse.json({ error: authError.message }, { status: 400 });
      }

      if (!authData.user) {
        return NextResponse.json(
          { error: "No user data returned" },
          { status: 500 }
        );
      }

      console.log("Auth user created, creating profile...");

      // Generate API key
      const apiKey = `fp_${userData.plan_type}_${userData.name
        .toLowerCase()
        .replace(/\s+/g, "_")}_${Date.now()}`;

      // Create user profile directly (bypassing RLS with service role)
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from("user_profiles")
        .insert({
          id: authData.user.id,
          email: email,
          name: userData.name,
          role: userData.role,
          company_name: userData.company_name,
          api_key: apiKey,
          plan_type: userData.plan_type,
          metadata: userData.metadata || {},
        })
        .select()
        .single();

      if (profileError) {
        console.error("Profile creation error:", profileError);
        // Clean up auth user if profile creation fails
        try {
          await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        } catch (cleanupError) {
          console.error("Failed to cleanup auth user:", cleanupError);
        }
        return NextResponse.json(
          { error: profileError.message },
          { status: 400 }
        );
      }

      console.log("Signup completed successfully");
      return NextResponse.json({
        data: {
          user: authData.user,
          profile: profileData,
        },
      });
    };

    // Race between timeout and signup
    return await Promise.race([signupPromise(), timeoutPromise]);
  } catch (error) {
    console.error("Error in signup route:", error);

    // Handle specific error types
    if (error.message === "Request timeout") {
      return NextResponse.json(
        { error: "Request timed out. Please try again." },
        { status: 408 }
      );
    }

    if (error.message.includes("Failed to connect")) {
      return NextResponse.json(
        {
          error: "Authentication service unavailable. Please try again later.",
        },
        { status: 503 }
      );
    }

    // Return the actual error message for debugging
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
