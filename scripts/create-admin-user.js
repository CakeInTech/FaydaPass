const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  console.log('Please ensure you have:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    // Create admin user with service role
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'admin@faydapass.com',
      password: 'admin123456', // Change this to a secure password
      email_confirm: true,
      user_metadata: {
        role: 'admin',
        name: 'Admin User'
      }
    });

    if (error) {
      console.error('Error creating admin user:', error);
      return;
    }

    console.log('Admin user created successfully:', data.user.email);
    console.log('\nLogin credentials:');
    console.log('Email: admin@faydapass.com');
    console.log('Password: admin123456');
    console.log('\n⚠️  IMPORTANT: Change the password in production!');
    
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

createAdminUser(); 