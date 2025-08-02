"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "../../lib/supabase"; // Corrected import path

// This function is now aligned with the Verification interface in lib/supabase.ts
export async function createVerification(data: {
  user_email: string;
  status: "success" | "failure" | "pending";
  type: "KYC" | "biometric";
  api_provider: "fayda" | "internal";
  selfie_url?: string;
  metadata?: Record<string, any>;
}) {
  const { user_email, status, type, api_provider, selfie_url, metadata } = data;

  // Corrected table name to 'verifications'
  if (!supabase) {
    throw new Error("Supabase client is not initialized.");
  }

  const { error } = await supabase.from("verifications").insert([
    {
      user_email,
      status,
      type,
      api_provider,
      selfie_url,
      metadata,
      // Set default values for required fields not passed in
      match_score: 0,
      liveness_score: 0,
    },
  ]);

  if (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to Create Verification.");
  }

  revalidatePath("/dashboard/verifications");
}
