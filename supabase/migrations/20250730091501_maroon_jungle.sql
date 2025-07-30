/*
  # Admin Dashboard Schema

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `role` (text, admin/viewer)
      - `created_at` (timestamp)

    - `verifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `user_email` (text)
      - `status` (text, success/failure/pending)
      - `type` (text, KYC/biometric)
      - `match_score` (numeric)
      - `liveness_score` (numeric)
      - `result_code` (text)
      - `reason` (text)
      - `document_type` (text)
      - `selfie_url` (text)
      - `id_photo_url` (text)
      - `api_provider` (text, fayda/internal)
      - `metadata` (jsonb)
      - `created_at` (timestamp)

    - `webhook_logs`
      - `id` (uuid, primary key)
      - `event` (text)
      - `endpoint` (text)
      - `status` (text, success/fail)
      - `request_body` (jsonb)
      - `response` (jsonb)
      - `retry_count` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access only
*/

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'viewer')),
  created_at timestamptz DEFAULT now()
);

-- Verifications table
CREATE TABLE IF NOT EXISTS verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  user_email text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('success', 'failure', 'pending')),
  type text NOT NULL DEFAULT 'KYC' CHECK (type IN ('KYC', 'biometric')),
  match_score numeric DEFAULT 0,
  liveness_score numeric DEFAULT 0,
  result_code text,
  reason text,
  document_type text,
  selfie_url text,
  id_photo_url text,
  api_provider text DEFAULT 'fayda' CHECK (api_provider IN ('fayda', 'internal')),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Webhook logs table
CREATE TABLE IF NOT EXISTS webhook_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event text NOT NULL,
  endpoint text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('success', 'fail', 'pending')),
  request_body jsonb DEFAULT '{}',
  response jsonb DEFAULT '{}',
  retry_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admin users can read all admin_users" ON admin_users;
DROP POLICY IF EXISTS "Admin users can read all verifications" ON verifications;
DROP POLICY IF EXISTS "Admin users can insert verifications" ON verifications;
DROP POLICY IF EXISTS "Admin users can update verifications" ON verifications;
DROP POLICY IF EXISTS "Admin role can read webhook_logs" ON webhook_logs;
DROP POLICY IF EXISTS "Admin role can insert webhook_logs" ON webhook_logs;

-- Admin users policies - users can only read their own row
CREATE POLICY "Admin users can read own row"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (email = auth.jwt() ->> 'email');

-- Verifications policies - admin users can read all verifications
CREATE POLICY "Admin users can read all verifications"
  ON verifications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Admin users can insert verifications"
  ON verifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Admin users can update verifications"
  ON verifications
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.email = auth.jwt() ->> 'email'
    )
  );

-- Webhook logs policies (admin role only)
CREATE POLICY "Admin role can read webhook_logs"
  ON webhook_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.email = auth.jwt() ->> 'email'
      AND au.role = 'admin'
    )
  );

CREATE POLICY "Admin role can insert webhook_logs"
  ON webhook_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.email = auth.jwt() ->> 'email'
      AND au.role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_verifications_status ON verifications(status);
CREATE INDEX IF NOT EXISTS idx_verifications_created_at ON verifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_verifications_user_email ON verifications(user_email);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_created_at ON webhook_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_status ON webhook_logs(status);

-- Insert sample admin user (replace with your email)
INSERT INTO admin_users (email, role)
VALUES ('admin@faydapass.com', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample verification data for testing
INSERT INTO verifications (user_email, status, type, match_score, liveness_score, result_code, reason, document_type, api_provider, metadata)
VALUES
  ('user1@example.com', 'success', 'KYC', 95.5, 98.2, 'SUCCESS', 'Verification successful', 'passport', 'fayda', '{"name": "John Doe", "dob": "1990-01-01"}'),
  ('user2@example.com', 'failure', 'KYC', 45.2, 67.8, 'NO_MATCH', 'Document does not match selfie', 'drivers_license', 'fayda', '{"name": "Jane Smith", "dob": "1985-05-15"}'),
  ('user3@example.com', 'pending', 'biometric', 0, 0, 'PROCESSING', 'Verification in progress', 'national_id', 'internal', '{"name": "Bob Johnson", "dob": "1992-12-10"}'),
  ('user4@example.com', 'success', 'KYC', 89.7, 94.1, 'SUCCESS', 'Verification successful', 'passport', 'fayda', '{"name": "Alice Brown", "dob": "1988-03-22"}'),
  ('user5@example.com', 'failure', 'KYC', 32.1, 55.4, 'LIVENESS_FAIL', 'Liveness check failed', 'drivers_license', 'internal', '{"name": "Charlie Wilson", "dob": "1995-07-08"}')
ON CONFLICT DO NOTHING;
