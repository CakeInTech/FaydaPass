import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    // Get all companies/developers (non-admin users)
    const { data: companies, error: companiesError } = await supabase
      .from("user_profiles")
      .select("*")
      .neq("role", "admin")
      .order("created_at", { ascending: false });

    if (companiesError) {
      console.error("Companies fetch error:", companiesError);
      return NextResponse.json(
        { error: "Failed to fetch companies" },
        { status: 500 }
      );
    }

    // Get verification stats for each company
    const companiesWithStats = await Promise.all(
      companies.map(async (company) => {
        // Get total verifications for this company
        const { count: totalVerifications } = await supabase
          .from("verification_records")
          .select("*", { count: "exact", head: true })
          .eq("user_id", company.id);

        // Get successful verifications
        const { count: successfulVerifications } = await supabase
          .from("verification_records")
          .select("*", { count: "exact", head: true })
          .eq("user_id", company.id)
          .eq("status", "success");

        // Get recent verifications (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { count: recentVerifications } = await supabase
          .from("verification_records")
          .select("*", { count: "exact", head: true })
          .eq("user_id", company.id)
          .gte("created_at", thirtyDaysAgo.toISOString());

        // Get API usage stats
        const { count: apiCalls } = await supabase
          .from("api_usage")
          .select("*", { count: "exact", head: true })
          .eq("user_id", company.id);

        return {
          ...company,
          stats: {
            totalVerifications: totalVerifications || 0,
            successfulVerifications: successfulVerifications || 0,
            recentVerifications: recentVerifications || 0,
            apiCalls: apiCalls || 0,
            successRate:
              totalVerifications > 0
                ? Math.round(
                    (successfulVerifications / totalVerifications) * 100
                  )
                : 0,
          },
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: companiesWithStats,
      total: companiesWithStats.length,
    });
  } catch (error) {
    console.error("Admin companies error:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies data" },
      { status: 500 }
    );
  }
}
