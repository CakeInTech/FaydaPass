const fs = require('fs');
const path = require('path');

console.log('Setting up environment variables...\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '..', '.env.local');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('✅ .env.local file already exists');
} else {
  console.log('❌ .env.local file not found');
  console.log('\nPlease create a .env.local file in the root directory with:');
  console.log('\nNEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here');
  console.log('\nTo get these values:');
  console.log('1. Go to your Supabase dashboard');
  console.log('2. Navigate to Settings > API');
  console.log('3. Copy the Project URL and API keys');
}

console.log('\n📋 Steps to get your Supabase credentials:');
console.log('1. Go to https://supabase.com/dashboard');
console.log('2. Select your project (or create a new one)');
console.log('3. Go to Settings > API');
console.log('4. Copy the following values:');
console.log('   - Project URL → NEXT_PUBLIC_SUPABASE_URL');
console.log('   - anon public → NEXT_PUBLIC_SUPABASE_ANON_KEY');
console.log('   - service_role secret → SUPABASE_SERVICE_ROLE_KEY');
console.log('\n5. Create a .env.local file in the project root with these values');
console.log('\n6. Run: node scripts/create-admin-user.js'); 