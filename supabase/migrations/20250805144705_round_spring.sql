/*
  # Unified Authentication Schema

  1. New Tables
    - `user_profiles` - Unified user profile table
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `name` (text)
      - `role` (text, admin/developer/company)
      - `company_name` (text, for company users)
      - `api_key` (text, unique)
      - `plan_type` (text, developer/business)
      - `metadata` (jsonb, flexible data storage)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `verification_records` - Comprehensive verification tracking
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `user_email` (text)
      - `status` (text, pending/processing/success/failed)
      - `type` (text, KYC/biometric)
      - `fayda_id` (text)
      - `match_score` (numeric)
      - `liveness_score` (numeric)
      - `result_code` (text)
      - `reason` (text)
      - `api_provider` (text)
      - `user_data` (jsonb)
      - `created_at` (timestamp)
      - `completed_at` (timestamp)

    - `api_usage` - Track API usage for billing and analytics
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `endpoint` (text)
      - `method` (text)
      - `status_code` (integer)
      - `response_time` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add role-based policies
    - Implement proper access controls
*/

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS api_usage CASCADE;
DROP TABLE IF EXISTS verification_records CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Create user_profiles table (unified user management)
CREATE TABLE user_profiles (
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

-- Create verification_records table
CREATE TABLE verification_records (
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

-- Create api_usage table for tracking and analytics
CREATE TABLE api_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  method text NOT NULL,
  status_code integer NOT NULL,
  response_time integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_api_key ON user_profiles(api_key);
CREATE INDEX idx_verification_records_user_id ON verification_records(user_id);
CREATE INDEX idx_verification_records_status ON verification_records(status);
CREATE INDEX idx_verification_records_created_at ON verification_records(created_at DESC);
CREATE INDEX idx_api_usage_user_id ON api_usage(user_id);
CREATE INDEX idx_api_usage_created_at ON api_usage(created_at DESC);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );

-- RLS Policies for verification_records
CREATE POLICY "Users can read own verifications"
  ON verification_records
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all verifications"
  ON verification_records
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );

CREATE POLICY "Users can insert own verifications"
  ON verification_records
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "System can insert verifications"
  ON verification_records
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for api_usage
CREATE POLICY "Users can read own usage"
  ON api_usage
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all usage"
  ON api_usage
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );

-- Insert default admin user
INSERT INTO user_profiles (id, email, name, role, plan_type, api_key, metadata)
VALUES (
  gen_random_uuid(),
  'admin@faydapass.com',
  'System Administrator',
  'admin',
  'business',
  'fp_admin_' || substr(gen_random_uuid()::text, 1, 8),
  '{"created_by": "system", "is_default_admin": true}'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample data for testing
INSERT INTO user_profiles (id, email, name, role, company_name, plan_type, api_key, metadata) VALUES
(gen_random_uuid(), 'developer@example.com', 'John Developer', 'developer', NULL, 'developer', 'fp_dev_' || substr(gen_random_uuid()::text, 1, 8), '{"use_case": "Mobile App Development"}'),
(gen_random_uuid(), 'company@example.com', 'Sarah Johnson', 'company', 'Digital Bank Ethiopia', 'business', 'fp_biz_' || substr(gen_random_uuid()::text, 1, 8), '{"industry": "Banking", "employee_count": "201-500"}')