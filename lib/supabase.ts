import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create Supabase client only if environment variables are available
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Types for our database tables
export interface AdminUser {
  id: string;
  email: string;
  role: "admin" | "viewer";
  created_at: string;
}

export interface Verification {
  id: string;
  user_id?: string;
  user_email: string;
  status: "success" | "failure" | "pending";
  type: "KYC" | "biometric";
  match_score: number;
  liveness_score: number;
  result_code?: string;
  reason?: string;
  document_type?: string;
  selfie_url?: string;
  id_photo_url?: string;
  api_provider: "fayda" | "internal";
  metadata: Record<string, any>;
  created_at: string;
}

export interface WebhookLog {
  id: string;
  event: string;
  endpoint: string;
  status: "success" | "fail" | "pending";
  request_body: Record<string, any>;
  response: Record<string, any>;
  retry_count: number;
  created_at: string;
}

// Admin authentication helpers
export const checkAdminUser = async (
  email: string
): Promise<AdminUser | null> => {
  if (!supabase) {
    console.warn(
      "Supabase client not initialized - environment variables missing"
    );
    return null;
  }

  const { data, error } = await supabase
    .from("admin_users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !data) return null;
  return data;
};

export const isAdmin = (user: AdminUser | null): boolean => {
  return user?.role === "admin";
};

export const isViewer = (user: AdminUser | null): boolean => {
  return user?.role === "viewer" || user?.role === "admin";
};
