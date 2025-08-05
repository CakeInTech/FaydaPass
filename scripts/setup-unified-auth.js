const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('\nPlease ensure you have the following in your .env.local file:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupUnifiedAuth() {
  try {
    console.log('🚀 Setting up unified authentication system...\n');

    // Step 1: Create admin user in auth
    console.log('1. Creating admin user in Supabase Auth...');
    const { data: adminAuth, error: adminAuthError } = await supabase.auth.admin.createUser({
      email: 'admin@faydapass.com',
      password: 'admin123456',
      email_confirm: true,
      user_metadata: {
        name: 'System Administrator',
        role: 'admin'
      }
    });

    if (adminAuthError && !adminAuthError.message.includes('already been registered')) {
      console.error('❌ Error creating admin auth user:', adminAuthError);
      return;
    }

    console.log('✅ Admin auth user created/exists');

    // Step 2: Create demo developer user
    console.log('\n2. Creating demo developer user...');
    const { data: devAuth, error: devAuthError } = await supabase.auth.admin.createUser({
      email: 'developer@example.com',
      password: 'developer123',
      email_confirm: true,
      user_metadata: {
        name: 'John Developer',
        role: 'developer'
      }
    });

    if (devAuthError && !devAuthError.message.includes('already been registered')) {
      console.error('❌ Error creating developer auth user:', devAuthError);
    } else {
      console.log('✅ Developer auth user created/exists');
    }

    // Step 3: Create demo company user
    console.log('\n3. Creating demo company user...');
    const { data: companyAuth, error: companyAuthError } = await supabase.auth.admin.createUser({
      email: 'company@example.com',
      password: 'company123',
      email_confirm: true,
      user_metadata: {
        name: 'Sarah Johnson',
        role: 'company'
      }
    });

    if (companyAuthError && !companyAuthError.message.includes('already been registered')) {
      console.error('❌ Error creating company auth user:', companyAuthError);
    } else {
      console.log('✅ Company auth user created/exists');
    }

    // Step 4: Verify database schema
    console.log('\n4. Verifying database schema...');
    const { data: tables, error: tablesError } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);

    if (tablesError) {
      console.error('❌ Database schema not found. Please run the migration first:');
      console.log('   Run the SQL migration in your Supabase dashboard');
      return;
    }

    console.log('✅ Database schema verified');

    // Step 5: Test authentication
    console.log('\n5. Testing authentication...');
    const { data: testAuth, error: testError } = await supabase.auth.signInWithPassword({
      email: 'admin@faydapass.com',
      password: 'admin123456'
    });

    if (testError) {
      console.error('❌ Authentication test failed:', testError);
    } else {
      console.log('✅ Authentication test passed');
      
      // Sign out the test session
      await supabase.auth.signOut();
    }

    console.log('\n🎉 Setup completed successfully!\n');
    console.log('📋 Demo Credentials:');
    console.log('   Admin: admin@faydapass.com / admin123456');
    console.log('   Developer: developer@example.com / developer123');
    console.log('   Company: company@example.com / company123');
    console.log('\n🌐 Next steps:');
    console.log('   1. Start the development server: npm run dev');
    console.log('   2. Visit http://localhost:3000');
    console.log('   3. Try logging in with the demo credentials');
    console.log('   4. Test the unified dashboard system');

  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

setupUnifiedAuth();