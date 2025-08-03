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

async function confirmAdminEmail() {
  try {
    console.log('Confirming admin user email...');
    
    // Update the admin user to confirm email
    const { data, error } = await supabase.auth.admin.updateUserById(
      'admin@faydapass.com', // This should be the user ID, but we'll try email first
      {
        email_confirmed_at: new Date().toISOString(),
        user_metadata: {
          role: 'admin',
          name: 'Admin User'
        }
      }
    );

    if (error) {
      console.error('Error updating admin user:', error);
      
      // Try alternative approach - get user by email first
      console.log('Trying alternative approach...');
      const { data: users, error: listError } = await supabase.auth.admin.listUsers();
      
      if (listError) {
        console.error('Error listing users:', listError);
        return;
      }
      
      const adminUser = users.users.find(user => user.email === 'admin@faydapass.com');
      if (adminUser) {
        const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
          adminUser.id,
          {
            email_confirmed_at: new Date().toISOString(),
            user_metadata: {
              role: 'admin',
              name: 'Admin User'
            }
          }
        );
        
        if (updateError) {
          console.error('Error updating user:', updateError);
        } else {
          console.log('Admin user email confirmed successfully');
        }
      } else {
        console.log('Admin user not found. Please create the user first.');
      }
      return;
    }

    console.log('Admin user email confirmed successfully');
    
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

confirmAdminEmail(); 