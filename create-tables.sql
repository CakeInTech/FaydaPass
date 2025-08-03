-- Create tables for FaydaPass MVP
-- Run this in your Supabase SQL Editor

-- Create companies table FIRST (no dependencies)
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  website TEXT,
  employee_count TEXT,
  use_case TEXT,
  expected_volume TEXT,
  compliance_requirements TEXT[],
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table SECOND (syncs with Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  user_type TEXT CHECK (user_type IN ('developer', 'company_user', 'admin')) NOT NULL,
  company_id UUID REFERENCES companies(id),
  api_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create verifications table THIRD (company_id is optional)
CREATE TABLE IF NOT EXISTS verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  user_email TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'processing', 'success', 'failed')) DEFAULT 'pending',
  fayda_id TEXT,
  match_score DECIMAL(5,2),
  liveness_score DECIMAL(5,2),
  user_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
CREATE INDEX IF NOT EXISTS idx_verifications_company_id ON verifications(company_id);
CREATE INDEX IF NOT EXISTS idx_verifications_status ON verifications(status);
CREATE INDEX IF NOT EXISTS idx_verifications_created_at ON verifications(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for companies table
CREATE POLICY "Companies are viewable by authenticated users" ON companies
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Companies can be created by authenticated users" ON companies
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create RLS policies for verifications table
CREATE POLICY "Verifications are viewable by authenticated users" ON verifications
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Verifications can be created by authenticated users" ON verifications
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Insert some mock data for testing (only if tables are empty)
INSERT INTO companies (name, industry, contact_email, status) VALUES
('Test Bank', 'Banking', 'contact@testbank.com', 'approved'),
('Fintech Startup', 'Fintech', 'hello@fintech.com', 'approved'),
('Government Agency', 'Government', 'info@gov.et', 'pending')
ON CONFLICT DO NOTHING;

-- Note: We can't insert mock users because they need to exist in auth.users first
-- Mock users will be created when you sign up through the forms
