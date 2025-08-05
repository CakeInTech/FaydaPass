import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Service role client for admin operations
export const supabaseAdmin =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;
// User types and interfaces
export type UserRole = 'admin' | 'developer' | 'company';
export type PlanType = 'developer' | 'business';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company_name?: string;
  api_key?: string;
  plan_type: PlanType;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface VerificationRecord {
  id: string;
  user_id: string;
  user_email: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  type: 'KYC' | 'biometric';
  fayda_id?: string;
  match_score?: number;
  liveness_score?: number;
  result_code?: string;
  reason?: string;
  api_provider?: string;
  user_data?: Record<string, any>;
  created_at: string;
  completed_at?: string;
}

export interface ApiUsage {
  id: string;
  user_id: string;
  endpoint: string;
  method: string;
  status_code: number;
  response_time: number;
  created_at: string;
}

// Authentication functions
export async function signUp(email: string, password: string, userData: {
  name: string;
  role: UserRole;
  plan_type: PlanType;
  company_name?: string;
  metadata?: Record<string, any>;
}) {
  if (!supabase || !supabaseAdmin) {
    return { data: null, error: new Error("Supabase not initialized") };
  }

  try {
    console.log('Starting signup process for:', email);

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          role: userData.role,
        }
      }
    });

    if (authError) {
      console.error('Auth signup error:', authError);
      return { data: null, error: authError };
    }

    if (!authData.user) {
      return { data: null, error: new Error("No user data returned") };
    }

    console.log('Auth user created, creating profile...');

    // Use service role to create profile (bypasses RLS)
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
      return { data: null, error: profileError };
    }

    console.log('Profile created successfully:', profileData);
    return { data: { user: authData.user, profile: profileData }, error: null };
  } catch (error) {
    console.error('Signup exception:', error);
    return { data: null, error: error as Error };
  }
}

export async function signIn(email: string, password: string) {
  if (!supabase) {
    return { data: null, error: new Error("Supabase not initialized") };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

export async function signOut() {
  if (!supabase) {
    return { error: new Error("Supabase not initialized") };
  }

  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  if (!supabase) return null;

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  return user;
}

export async function getUserProfile(userId?: string): Promise<UserProfile | null> {
  if (!supabase) return null;

  let targetUserId = userId;
  
  if (!targetUserId) {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Error getting current user:', userError);
      return null;
    }
    targetUserId = user.id;
  }

  if (!targetUserId) {
    console.error('No user ID available');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', targetUserId)
      .single();
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    if (!data) {
      console.warn('No profile found for user:', targetUserId);
      return null;
    }

    return data;
  } catch (exception) {
    console.error('Exception fetching user profile:', exception);
    return null;
  }
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  if (!supabase) {
    return { data: null, error: new Error("Supabase not initialized") };
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  return { data, error };
}

// Verification functions
export async function createVerificationRecord(data: Partial<VerificationRecord>) {
  if (!supabase) {
    return { data: null, error: new Error("Supabase not initialized") };
  }

  const { data: result, error } = await supabase
    .from('verification_records')
    .insert(data)
    .select()
    .single();

  return { data: result, error };
}

export async function getVerificationRecords(userId?: string): Promise<VerificationRecord[]> {
  if (!supabase) return [];

  let query = supabase
    .from('verification_records')
    .select('*')
    .order('created_at', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error || !data) return [];
  return data;
}

// API usage tracking
export async function trackApiUsage(data: Partial<ApiUsage>) {
  if (!supabase) return;

  await supabase
    .from('api_usage')
    .insert(data);
}

export async function getApiUsageStats(userId: string) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('api_usage')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  if (error) return null;

  const totalCalls = data.length;
  const successfulCalls = data.filter(call => call.status_code < 400).length;
  const avgResponseTime = data.reduce((sum, call) => sum + call.response_time, 0) / totalCalls || 0;

  return {
    total_calls: totalCalls,
    successful_calls: successfulCalls,
    failed_calls: totalCalls - successfulCalls,
    avg_response_time: Math.round(avgResponseTime),
    success_rate: totalCalls > 0 ? (successfulCalls / totalCalls) * 100 : 0
  };
}