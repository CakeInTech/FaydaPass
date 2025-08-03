import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Types for MVP
export interface User {
  id: string;
  email: string;
  name: string;
  user_type: "developer" | "company_user" | "admin";
  company_id?: string;
  api_key?: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  industry?: string;
  contact_email: string;
  contact_phone?: string;
  website?: string;
  employee_count?: string;
  use_case?: string;
  expected_volume?: string;
  compliance_requirements?: string[];
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
}

export interface Verification {
  id: string;
  company_id?: string;
  user_email: string;
  status: "pending" | "processing" | "success" | "failed";
  fayda_id?: string;
  match_score?: number;
  liveness_score?: number;
  user_data?: any;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  // Additional properties for admin dashboard
  type?: string;
  result_code?: string;
  reason?: string;
  api_provider?: string;
  document_type?: string;
}

export interface WebhookLog {
  id: string;
  event: string;
  endpoint: string;
  status: "success" | "fail" | "pending";
  request_body: any;
  response: any;
  retry_count: number;
  created_at: string;
}

// Admin user interface (existing)
export interface AdminUser {
  id: string;
  email: string;
  role: "admin" | "viewer";
  created_at: string;
}

// ===== SUPABASE AUTH FUNCTIONS =====

// Sign up with Supabase Auth
export async function signUpWithEmail(email: string, password: string) {
  if (!supabase)
    return { data: null, error: new Error("Supabase not initialized") };

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  return { data, error };
}

// Sign in with Supabase Auth
export async function signInWithEmail(email: string, password: string) {
  if (!supabase)
    return { data: null, error: new Error("Supabase not initialized") };

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

// Sign out
export async function signOut() {
  if (!supabase) return { error: new Error("Supabase not initialized") };

  const { error } = await supabase.auth.signOut();
  return { error };
}

// Get current user
export async function getCurrentUser() {
  if (!supabase) return null;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user;
}

// Get current session
export async function getCurrentSession() {
  if (!supabase) return null;

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) return null;
  return session;
}

// ===== DATABASE FUNCTIONS =====

// Check if user is an admin
export async function checkAdminUser(email: string): Promise<AdminUser | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("admin_users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !data) return null;
  return data;
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      console.error("Error fetching user by email:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Exception fetching user by email:", error);
    return null;
  }
}

// Get company by ID
export async function getCompanyById(id: string): Promise<Company | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

// Get verifications for a company
export async function getCompanyVerifications(
  companyId: string
): Promise<Verification[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("verifications")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data;
}

// Get all verifications (for admin)
export async function getAllVerifications(): Promise<Verification[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("verifications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data;
}

// Sync existing auth user with our database
export async function syncAuthUserWithDatabase(email: string) {
  if (!supabase) return null;

  // Get the current auth user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  // Check if user already exists in our database
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return existingUser;
  }

  // If user exists in auth but not in our database, create the record
  const newUser = await createUser({
    id: user.id,
    email: user.email || email,
    name: user.user_metadata?.name || email.split("@")[0],
    user_type: "developer", // Default to developer, can be updated later
    api_key: `fp_dev_${Date.now()}`,
  });

  return newUser;
}

// Create new user (without password - use signUpWithEmail for auth)
export async function createUser(
  userData: Partial<User>
): Promise<User | null> {
  try {
    console.log("createUser called with:", userData);

    const response = await fetch("/api/create-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    console.log("createUser API response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error creating user:", errorData);
      return null;
    }

    const { data } = await response.json();
    console.log("createUser success:", data);
    return data;
  } catch (error) {
    console.error("Exception creating user:", error);
    return null;
  }
}

// Create new company
export async function createCompany(
  companyData: Partial<Company>
): Promise<Company | null> {
  try {
    const response = await fetch("/api/create-company", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(companyData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error creating company:", errorData);
      return null;
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Exception creating company:", error);
    return null;
  }
}

// Clean up orphaned auth user if database creation fails
export async function cleanupOrphanedAuthUser(email: string) {
  if (!supabase) return;

  try {
    // This would require admin privileges, so we'll just log it
    console.log("Orphaned auth user detected for:", email);
    console.log(
      "Please clean up manually in Supabase Auth dashboard if needed"
    );
  } catch (error) {
    console.error("Error cleaning up orphaned auth user:", error);
  }
}

// Create developer user with proper auth
export async function createDeveloperUser(
  email: string,
  password: string,
  name: string,
  useCase: string
) {
  console.log("createDeveloperUser called with:", { email, name, useCase });

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      user: null,
      error: new Error("Please enter a valid email address"),
    };
  }

  // Validate password
  if (password.length < 6) {
    return {
      user: null,
      error: new Error("Password must be at least 6 characters"),
    };
  }

  // First, check if user already exists in our database
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return {
      user: existingUser,
      error: new Error("User already exists in database"),
    };
  }

  console.log("Creating auth user...");
  // Create the auth user
  const { data: authData, error: authError } = await signUpWithEmail(
    email,
    password
  );

  console.log("Auth signup result:", { authData, authError });

  if (authError) {
    console.error("Auth signup error:", authError);
    return { user: null, error: authError };
  }

  if (!authData?.user) {
    return {
      user: null,
      error: new Error("No user data returned from auth signup"),
    };
  }

  console.log("Auth user created, waiting...");
  // Wait a moment for the auth user to be fully created
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log("Creating database user record...");
  // Then create the user record in our database
  const user = await createUser({
    email,
    name,
    user_type: "developer",
    api_key: `fp_dev_${name.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`,
  });

  console.log("Database user creation result:", user);

  if (!user) {
    console.error("Failed to create user record, cleaning up auth user");
    // Clean up the orphaned auth user
    await cleanupOrphanedAuthUser(email);
    return { user: null, error: new Error("Failed to create user record") };
  }

  console.log("Developer user created successfully:", user);
  return { user, error: null };
}

// Create company user with proper auth
export async function createCompanyUser(
  email: string,
  password: string,
  name: string,
  companyId: string,
  companyName: string
) {
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      user: null,
      error: new Error("Please enter a valid email address"),
    };
  }

  // Validate password
  if (password.length < 6) {
    return {
      user: null,
      error: new Error("Password must be at least 6 characters"),
    };
  }

  // First, check if user already exists in our database
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return {
      user: existingUser,
      error: new Error("User already exists in database"),
    };
  }

  // Create the auth user
  const { data: authData, error: authError } = await signUpWithEmail(
    email,
    password
  );

  if (authError) {
    console.error("Auth signup error:", authError);
    return { user: null, error: authError };
  }

  if (!authData?.user) {
    return {
      user: null,
      error: new Error("No user data returned from auth signup"),
    };
  }

  // Wait a moment for the auth user to be fully created
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Then create the user record in our database
  const user = await createUser({
    email,
    name,
    user_type: "company_user",
    company_id: companyId,
    api_key: `fp_company_${companyName
      .toLowerCase()
      .replace(/\s+/g, "_")}_${Date.now()}`,
  });

  if (!user) {
    // Clean up the orphaned auth user
    await cleanupOrphanedAuthUser(email);
    return { user: null, error: new Error("Failed to create user record") };
  }

  return { user, error: null };
}
