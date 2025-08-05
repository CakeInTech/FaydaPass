const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

console.log('🍪 FaydaPass Cookie Fix Tool\n');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('\nPlease ensure you have the following in your .env.local file:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

async function fixCookieIssues() {
  try {
    console.log('🔧 Diagnosing cookie and session issues...\n');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Test Supabase connection
    console.log('1. Testing Supabase connection...');
    const { data: healthCheck, error: healthError } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);

    if (healthError) {
      console.error('❌ Supabase connection failed:', healthError.message);
      return;
    }
    console.log('✅ Supabase connection working');

    // Check for malformed sessions
    console.log('\n2. Checking for session issues...');
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      console.error('❌ Error listing users:', usersError.message);
      return;
    }

    console.log(`✅ Found ${users.length} users in auth system`);

    // Check user profiles
    console.log('\n3. Checking user profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*');

    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError.message);
      return;
    }

    console.log(`✅ Found ${profiles.length} user profiles`);

    // Find orphaned auth users (users without profiles)
    const orphanedUsers = users.filter(user => 
      !profiles.find(profile => profile.id === user.id)
    );

    if (orphanedUsers.length > 0) {
      console.log(`\n⚠️  Found ${orphanedUsers.length} orphaned auth users:`);
      orphanedUsers.forEach(user => {
        console.log(`   - ${user.email} (${user.id})`);
      });

      console.log('\n🔧 Creating missing profiles...');
      for (const user of orphanedUsers) {
        try {
          const isAdmin = user.email === 'admin@faydapass.com' || 
                         user.email?.includes('admin') ||
                         user.user_metadata?.role === 'admin';

          const { data: newProfile, error: createError } = await supabase
            .rpc('create_user_profile', {
              user_id: user.id,
              user_email: user.email,
              user_name: user.user_metadata?.name || user.email.split('@')[0],
              user_role: isAdmin ? 'admin' : 'developer',
              user_company_name: user.user_metadata?.company_name || null,
              user_plan_type: 'developer',
              user_metadata: user.user_metadata || {}
            });

          if (createError) {
            console.error(`❌ Failed to create profile for ${user.email}:`, createError.message);
          } else {
            console.log(`✅ Created profile for ${user.email}`);
          }
        } catch (error) {
          console.error(`❌ Exception creating profile for ${user.email}:`, error);
        }
      }
    }

    // Find orphaned profiles (profiles without auth users)
    const orphanedProfiles = profiles.filter(profile => 
      !users.find(user => user.id === profile.id)
    );

    if (orphanedProfiles.length > 0) {
      console.log(`\n⚠️  Found ${orphanedProfiles.length} orphaned profiles:`);
      orphanedProfiles.forEach(profile => {
        console.log(`   - ${profile.email} (${profile.id})`);
      });

      console.log('\n🗑️  Removing orphaned profiles...');
      for (const profile of orphanedProfiles) {
        try {
          const { error: deleteError } = await supabase
            .from('user_profiles')
            .delete()
            .eq('id', profile.id);

          if (deleteError) {
            console.error(`❌ Failed to delete profile for ${profile.email}:`, deleteError.message);
          } else {
            console.log(`✅ Deleted orphaned profile for ${profile.email}`);
          }
        } catch (error) {
          console.error(`❌ Exception deleting profile for ${profile.email}:`, error);
        }
      }
    }

    console.log('\n🎉 Cookie and session cleanup completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Clear your browser cookies and localStorage');
    console.log('2. Restart your development server');
    console.log('3. Test login/signup flows');
    console.log('4. Check browser console for any remaining errors');

  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  }
}

fixCookieIssues();