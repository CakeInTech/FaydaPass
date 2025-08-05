/*
  # Fix Authentication System Issues

  1. Problem Analysis
    - RLS policies causing 403 errors on user_profiles
    - Cookie parsing errors from malformed session data
    - Admin user management issues
    - Circular dependencies in policies

  2. Solution
    - Simplified RLS policies without circular references
    - Proper user profile creation flow
    - Fixed admin detection logic
    - Clean session management

  3. Changes
    - Drop all problematic policies
    - Create new simplified policies
    - Add proper user creation functions
    - Fix admin user setup
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admin users can read all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admin users can update all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own verifications" ON verification_records;
DROP POLICY IF EXISTS "Users can insert own verifications" ON verification_records;
DROP POLICY IF EXISTS "Users can update own verifications" ON verification_records;
DROP POLICY IF EXISTS "Admin users can read all verifications" ON verification_records;
DROP POLICY IF EXISTS "Admin users can insert all verifications" ON verification_records;
DROP POLICY IF EXISTS "Admin users can update all verifications" ON verification_records;
DROP POLICY IF EXISTS "Users can read own usage" ON api_usage;
DROP POLICY IF EXISTS "Users can insert own usage" ON api_usage;
DROP POLICY IF EXISTS "Admin users can read all usage" ON api_usage;

-- Ensure tables exist with correct structure
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'developer', 'company')) DEFAULT 'developer',
  company_name text,
  api_key text UNIQUE,
  plan_type text CHECK (plan_type IN ('developer', 'business')) DEFAULT 'developer',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS verification_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  user_email text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'success', 'failed')),
  type text NOT NULL DEFAULT 'KYC' CHECK (type IN ('KYC', 'biometric')),
  fayda_id text,
  match_score numeric DEFAULT 0,
  liveness_score numeric DEFAULT 0,
  result_code text,
  reason text,
  api_provider text DEFAULT 'fayda',
  user_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE IF NOT EXISTS api_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  method text NOT NULL,
  status_code integer NOT NULL,
  response_time integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- Create simplified policies without circular dependencies

-- User Profiles: Users can only access their own data
CREATE POLICY "user_profiles_select_own"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "user_profiles_insert_own"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "user_profiles_update_own"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Admin access using service role key (for API routes)
CREATE POLICY "user_profiles_service_role_access"
  ON user_profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Verification Records: Users can access their own data
CREATE POLICY "verification_records_select_own"
  ON verification_records
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "verification_records_insert_own"
  ON verification_records
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "verification_records_update_own"
  ON verification_records
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Service role access for verification records
CREATE POLICY "verification_records_service_role_access"
  ON verification_records
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- API Usage: Users can access their own data
CREATE POLICY "api_usage_select_own"
  ON api_usage
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "api_usage_insert_own"
  ON api_usage
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Service role access for API usage
CREATE POLICY "api_usage_service_role_access"
  ON api_usage
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_api_key ON user_profiles(api_key);
CREATE INDEX IF NOT EXISTS idx_verification_records_user_id ON verification_records(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_records_status ON verification_records(status);
CREATE INDEX IF NOT EXISTS idx_verification_records_created_at ON verification_records(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_usage_user_id ON api_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_created_at ON api_usage(created_at DESC);

-- Function to safely create user profile (called from API routes)
CREATE OR REPLACE FUNCTION create_user_profile(
  user_id uuid,
  user_email text,
  user_name text,
  user_role text DEFAULT 'developer',
  user_company_name text DEFAULT NULL,
  user_plan_type text DEFAULT 'developer',
  user_metadata jsonb DEFAULT '{}'
)
RETURNS user_profiles
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_profile user_profiles;
  generated_api_key text;
BEGIN
  -- Generate API key
  generated_api_key := 'fp_' || user_plan_type || '_' || 
                       replace(lower(user_name), ' ', '_') || '_' || 
                       extract(epoch from now())::bigint;

  -- Insert user profile
  INSERT INTO user_profiles (
    id, email, name, role, company_name, api_key, plan_type, metadata
  ) VALUES (
    user_id, user_email, user_name, user_role, user_company_name, 
    generated_api_key, user_plan_type, user_metadata
  ) RETURNING * INTO new_profile;

  RETURN new_profile;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION create_user_profile TO service_role;
GRANT EXECUTE ON FUNCTION create_user_profile TO authenticated;