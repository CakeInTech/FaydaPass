-- Insert admin user
INSERT INTO admin_users (email, role)
VALUES ('admin@faydapass.com', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Check if admin user was inserted
SELECT * FROM admin_users;
