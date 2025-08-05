/*
  # Fix RLS Infinite Recursion

  1. Problem
    - The admin policy on user_profiles creates infinite recursion
    - Policy checks user_profiles table to determine if user is admin
    - This creates a circular dependency

  2. Solution
    - Use simplified admin check based on email pattern
    - Remove circular dependency by using auth.jwt() directly
    - Implement proper role-based policies without table lookups

  3. Changes
    - Drop existing problematic policies
    - Create new policies that avoid circular references
    - Use JWT claims and email patterns for admin detection
*/

-- Drop all existing policies that cause recursion
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own verifications" ON verification_records;
DROP POLICY IF EXISTS "Admins can read all verifications" ON verification_records;
DROP POLICY IF EXISTS "Users can insert own verifications" ON verification_records;
DROP POLICY IF EXISTS "System can insert verifications" ON verification_records;
DROP POLICY IF EXISTS "Users can read own usage" ON api_usage;
DROP POLICY IF EXISTS "Admins can read all usage" ON api_usage;

-- Create new policies without circular dependencies

-- User Profiles Policies
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

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Admin access based on email pattern (no table lookup)
CREATE POLICY "Admin users can read all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = 'admin@faydapass.com' OR
    auth.jwt() ->> 'email' LIKE '%admin%' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin users can update all profiles"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = 'admin@faydapass.com' OR
    auth.jwt() ->> 'email' LIKE '%admin%' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Verification Records Policies
CREATE POLICY "Users can read own verifications"
  ON verification_records
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own verifications"
  ON verification_records
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own verifications"
  ON verification_records
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Admin access to all verifications (no table lookup)
CREATE POLICY "Admin users can read all verifications"
  ON verification_records
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = 'admin@faydapass.com' OR
    auth.jwt() ->> 'email' LIKE '%admin%' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin users can insert all verifications"
  ON verification_records
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'email' = 'admin@faydapass.com' OR
    auth.jwt() ->> 'email' LIKE '%admin%' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin users can update all verifications"
  ON verification_records
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = 'admin@faydapass.com' OR
    auth.jwt() ->> 'email' LIKE '%admin%' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- API Usage Policies
CREATE POLICY "Users can read own usage"
  ON api_usage
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own usage"
  ON api_usage
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Admin access to all usage (no table lookup)
CREATE POLICY "Admin users can read all usage"
  ON api_usage
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = 'admin@faydapass.com' OR
    auth.jwt() ->> 'email' LIKE '%admin%' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Create a function to safely check if user is admin (for use in application code)
CREATE OR REPLACE FUNCTION is_admin(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    user_email = 'admin@faydapass.com' OR
    user_email LIKE '%admin%'
  );
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION is_admin(text) TO authenticated;