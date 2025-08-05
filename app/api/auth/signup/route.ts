import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const { email, password, userData } = await request.json();

    if (!email || !password || !userData) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: userData.name,
        role: userData.role,
      }
    });

    if (authError) {
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

    // Generate API key
    const apiKey = `fp_${userData.plan_type}_${userData.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;

    // Create user profile
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        email,
        name: userData.name,
        role: userData.role,
        company_name: userData.company_name,
        plan_type: userData.plan_type,
        api_key: apiKey,
        metadata: userData.metadata || {}
      })
      .select()
      .single();

    if (profileError) {
      // Clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      );
    }

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