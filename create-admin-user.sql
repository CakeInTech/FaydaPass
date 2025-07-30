-- First, let's check if the admin user exists in the admin_users table
SELECT * FROM admin_users;

-- Insert admin user if it doesn't exist
INSERT INTO admin_users (email, role)
VALUES ('admin@faydapass.com', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Check again
SELECT * FROM admin_users;
