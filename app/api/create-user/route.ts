import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const { email, name, user_type, company_id, api_key } =
      await request.json();

    console.log("Creating user with data:", {
      email,
      name,
      user_type,
      company_id,
      api_key,
    });

    if (!email || !name || !user_type) {
      console.error("Missing required fields:", { email, name, user_type });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log("Environment check:", {
      supabaseUrl: !!supabaseUrl,
      supabaseServiceKey: !!supabaseServiceKey,
    });

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables");
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create user record in database
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          email,
          name,
          user_type,
          company_id,
          api_key,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating user:", error);
      return NextResponse.json(
        { error: "Failed to create user record", details: error },
        { status: 500 }
      );
    }

    console.log("User created successfully:", data);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in create-user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
