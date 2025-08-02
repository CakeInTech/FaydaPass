-- MVP Database Schema for FaydaPass B2B KYC Service

-- Create users table for both developers and company users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('developer', 'company_user', 'admin')),
  company_id UUID REFERENCES companies(id),
  api_key TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  website TEXT,
  employee_count TEXT,
  use_case TEXT,
  expected_volume TEXT,
  compliance_requirements TEXT[],
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create verifications table (mock data for MVP)
CREATE TABLE IF NOT EXISTS verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  user_email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'success', 'failed')),
  fayda_id TEXT,
  match_score DECIMAL DEFAULT 95.5,
  liveness_score DECIMAL DEFAULT 98.2,
  user_data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Insert mock data for presentation
INSERT INTO companies (id, name, industry, contact_email, contact_phone, website, employee_count, use_case, expected_volume, status) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Digital Bank Ethiopia', 'Banking', 'cto@digitalbank.et', '+251 911 123 456', 'https://digitalbank.et', '201-1000', 'Customer onboarding and account verification', '1,000-10,000 verifications/month', 'approved'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Fintech Solutions', 'Fintech', 'engineering@fintech.et', '+251 922 234 567', 'https://fintech.et', '51-200', 'Payment app KYC integration', '100-1,000 verifications/month', 'approved'),
  ('550e8400-e29b-41d4-a716-446655440003', 'EthioPay', 'Payment Processing', 'compliance@ethiopay.et', '+251 933 345 678', 'https://ethiopay.et', '11-50', 'Merchant verification', '10,000+ verifications/month', 'approved');

INSERT INTO users (id, email, name, user_type, company_id, api_key) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'sarah.johnson@digitalbank.et', 'Sarah Johnson', 'company_user', '550e8400-e29b-41d4-a716-446655440001', 'fp_live_digitalbank_123456'),
  ('660e8400-e29b-41d4-a716-446655440002', 'michael.chen@fintech.et', 'Michael Chen', 'company_user', '550e8400-e29b-41d4-a716-446655440002', 'fp_live_fintech_789012'),
  ('660e8400-e29b-41d4-a716-446655440003', 'amina.hassan@ethiopay.et', 'Amina Hassan', 'company_user', '550e8400-e29b-41d4-a716-446655440003', 'fp_live_ethiopay_345678'),
  ('660e8400-e29b-41d4-a716-446655440004', 'john.developer@example.com', 'John Developer', 'developer', NULL, 'fp_dev_john_123456');

INSERT INTO verifications (id, company_id, user_email, status, fayda_id, match_score, liveness_score, user_data, created_at, completed_at) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'user1@digitalbank.et', 'success', 'FID123456789', 95.5, 98.2, '{"name": "Abebe Kebede", "email": "abebe@example.com", "phone": "+251 911 111 111"}', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour'),
  ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'user2@digitalbank.et', 'success', 'FID987654321', 97.8, 99.1, '{"name": "Kebede Abebe", "email": "kebede@example.com", "phone": "+251 922 222 222"}', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '3 hours'),
  ('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'user3@fintech.et', 'success', 'FID456789123', 94.2, 97.5, '{"name": "Tigist Haile", "email": "tigist@example.com", "phone": "+251 933 333 333"}', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '5 hours'),
  ('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 'user4@ethiopay.et', 'processing', NULL, NULL, NULL, NULL, NOW() - INTERVAL '30 minutes', NULL),
  ('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'user5@digitalbank.et', 'failed', NULL, 45.2, 23.1, '{"name": "Failed User", "email": "failed@example.com"}', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '30 minutes');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_verifications_company_id ON verifications(company_id);
CREATE INDEX IF NOT EXISTS idx_verifications_status ON verifications(status);
CREATE INDEX IF NOT EXISTS idx_verifications_created_at ON verifications(created_at);
