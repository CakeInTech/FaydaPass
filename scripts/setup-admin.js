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

async function setupAdmin() {
  try {
    console.log('Setting up admin user...');
    
    // Insert admin user
    const { data, error } = await supabase
      .from('admin_users')
      .upsert([
        {
          email: 'admin@faydapass.com',
          role: 'admin'
        }
      ], {
        onConflict: 'email'
      });

    if (error) {
      console.error('Error inserting admin user:', error);
      return;
    }

    console.log('Admin user created/updated successfully');
    
    // Verify the admin user exists
    const { data: adminUser, error: fetchError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', 'admin@faydapass.com')
      .single();

    if (fetchError) {
      console.error('Error fetching admin user:', fetchError);
      return;
    }

    console.log('Admin user verified:', adminUser);
    console.log('\nNext steps:');
    console.log('1. Create a user account in Supabase Auth with email: admin@faydapass.com');
    console.log('2. Set a password for the admin user');
    console.log('3. Try logging in to the admin dashboard');
    
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

setupAdmin(); 