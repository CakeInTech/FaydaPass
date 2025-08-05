import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const { email, password, userData } = await request.json();

    console.log('Signup API called with:', { email, userData });
    if (!email || !password || !userData) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Create auth user with admin client
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: userData.name,
        role: userData.role,
      }
    });

    if (authError) {
      console.error('Auth user creation error:', authError);
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "No user data returned" },
        { status: 500 }
      );
    }

    console.log('Auth user created, creating profile...');

    // Use the database function to create profile (bypasses RLS)
    const { data: profileData, error: profileError } = await supabaseAdmin
      .rpc('create_user_profile', {
        user_id: authData.user.id,
        user_email: email,
        user_name: userData.name,
        user_role: userData.role,
        user_company_name: userData.company_name,
        user_plan_type: userData.plan_type,
        user_metadata: userData.metadata || {}
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Clean up auth user if profile creation fails
      try {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      } catch (cleanupError) {
        console.error('Failed to cleanup auth user:', cleanupError);
      }
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      );
    }

    console.log('Signup completed successfully');
    return NextResponse.json({
      data: {
        user: authData.user,
        profile: profileData
      }
    });
  } catch (error) {
    console.error("Error in signup route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}