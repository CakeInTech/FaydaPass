const fs = require('fs');
const path = require('path');

console.log('🧹 FaydaPass Project Cleanup Tool\n');

// Files and folders that should be removed
const filesToRemove = [
  // Old authentication files
  'app/admin/login/page.tsx',
  'app/admin/dashboard/page.tsx', 
  'app/admin/settings/page.tsx',
  'app/admin/users/page.tsx',
  'app/admin/users/[id]/page.tsx',
  'app/admin/verifications/page.tsx',
  'app/admin/webhooks/page.tsx',
  'app/admin/debug/page.tsx',
  'app/developer-login/page.tsx',
  'app/developer-signup/page.tsx',
  'app/developer-dashboard/page.tsx',
  'app/company-login/page.tsx',
  'app/company-signup/page.tsx',
  'app/company-dashboard/page.tsx',
  
  // Old API routes
  'app/api/create-user/route.ts',
  'app/api/create-company/route.ts',
  'app/api/check-user-type/route.ts',
  'app/api/debug-env/route.ts',
  
  // Old components
  'components/admin',
  
  // Old lib files
  'lib/supabase.ts',
  'lib/supabase/client.ts',
  'lib/supabase/server.ts',
  'lib/supabase/middleware.ts',
  'app/lib/actions.ts',
  
  // Documentation files that are outdated
  'TODO.md',
  'ADMIN_TROUBLESHOOTING.md',
  'b2b_kyc_flow.txt',
  'improved_kyc_flow.txt',
  'user_flow_graph.txt',
  
  // Old scripts
  'scripts/create-admin-user.js',
  'scripts/setup-admin.js',
  'scripts/confirm-admin-email.js',
  'scripts/setup-env.js',
  
  // Deployment files (if not using Docker)
  'deploy.sh',
  'docker-compose.yml',
  'Dockerfile',
  '.dockerignore',
  
  // Database files
  'create-tables.sql',
  'insert-admin.sql',
];

// Files to keep (important ones)
const filesToKeep = [
  // Core Next.js files
  'package.json',
  'next.config.js',
  'tsconfig.json',
  'tailwind.config.ts',
  'postcss.config.js',
  'components.json',
  
  // Environment and config
  '.env.local',
  '.gitignore',
  
  // Documentation
  'README.md',
  'LICENSE',
  'SETUP_INSTRUCTIONS.md',
  
  // Core application files
  'app/globals.css',
  'app/layout.tsx',
  'app/page.tsx',
  'app/dashboard/page.tsx',
  'app/login/page.tsx',
  'app/signup/page.tsx',
  'app/plan-selection/page.tsx',
  'app/verify/page.tsx',
  'app/callback/page.tsx',
  'app/verified/page.tsx',
  'app/docs/page.tsx',
  
  // New auth system
  'lib/auth.ts',
  'hooks/useAuth.ts',
  'middleware.ts',
  
  // API routes (keep working ones)
  'app/api/token/route.ts',
  'app/api/userinfo/route.ts',
  'app/api/save-verification/route.ts',
  'app/api/health/route.ts',
  'app/api/auth/profile/route.ts',
  'app/api/auth/signup/route.ts',
  
  // Components
  'components/ui/',
  'components/BackgroundWrapper.tsx',
  'components/Features.tsx',
  'components/Footer.tsx',
  'components/Home.tsx',
  'components/Navbar.tsx',
  'components/Pricing.tsx',
  'components/Testimonials.tsx',
  'components/Compliance.tsx',
  'components/DeveloperResource.tsx',
  'components/docs/',
  
  // Utils
  'lib/utils.ts',
  'lib/pkce.ts',
  'lib/jwt.ts',
  'lib/fayda-utils.ts',
  'lib/faydapass-sdk.ts',
  
  // Supabase
  'supabase/migrations/',
  
  // Hooks
  'hooks/use-mobile.tsx',
];

function shouldRemoveFile(filePath) {
  // Check if file is explicitly marked for removal
  if (filesToRemove.includes(filePath)) {
    return true;
  }
  
  // Check if file is in a directory marked for removal
  return filesToRemove.some(removePattern => {
    if (removePattern.endsWith('/')) {
      return filePath.startsWith(removePattern);
    }
    return false;
  });
}

function shouldKeepFile(filePath) {
  // Check if file is explicitly marked to keep
  if (filesToKeep.includes(filePath)) {
    return true;
  }
  
  // Check if file is in a directory marked to keep
  return filesToKeep.some(keepPattern => {
    if (keepPattern.endsWith('/')) {
      return filePath.startsWith(keepPattern);
    }
    return false;
  });
}

function scanDirectory(dir, basePath = '') {
  const items = fs.readdirSync(dir);
  const results = {
    toRemove: [],
    toKeep: [],
    unknown: []
  };
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const relativePath = path.join(basePath, item);
    
    // Skip node_modules and .next
    if (item === 'node_modules' || item === '.next' || item.startsWith('.git')) {
      continue;
    }
    
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Recursively scan subdirectories
      const subResults = scanDirectory(fullPath, relativePath);
      results.toRemove.push(...subResults.toRemove);
      results.toKeep.push(...subResults.toKeep);
      results.unknown.push(...subResults.unknown);
      
      // Check if directory itself should be removed
      if (shouldRemoveFile(relativePath + '/')) {
        results.toRemove.push(relativePath + '/');
      }
    } else {
      // Check individual files
      if (shouldRemoveFile(relativePath)) {
        results.toRemove.push(relativePath);
      } else if (shouldKeepFile(relativePath)) {
        results.toKeep.push(relativePath);
      } else {
        results.unknown.push(relativePath);
      }
    }
  }
  
  return results;
}

// Scan the project
console.log('📁 Scanning project structure...\n');
const results = scanDirectory('.');

console.log('🗑️  Files/Folders to Remove:');
results.toRemove.forEach(file => {
  console.log(`   - ${file}`);
});

console.log('\n✅ Files/Folders to Keep:');
results.toKeep.slice(0, 10).forEach(file => {
  console.log(`   - ${file}`);
});
if (results.toKeep.length > 10) {
  console.log(`   ... and ${results.toKeep.length - 10} more files`);
}

console.log('\n❓ Unknown Files (review manually):');
results.unknown.forEach(file => {
  console.log(`   - ${file}`);
});

console.log('\n📋 Cleanup Commands:');
console.log('Run these commands to clean up your project:\n');

// Generate removal commands
results.toRemove.forEach(file => {
  if (file.endsWith('/')) {
    console.log(`rm -rf "${file}"`);
  } else {
    console.log(`rm "${file}"`);
  }
});

console.log('\n⚠️  IMPORTANT:');
console.log('1. Review the files marked for removal before running commands');
console.log('2. Make sure you have a backup of your project');
console.log('3. Test the application after cleanup');
console.log('4. The unknown files should be reviewed manually');

console.log('\n🎯 Recommended Next.js Project Structure:');
console.log(`
app/
├── globals.css
├── layout.tsx
├── page.tsx                 # Landing page
├── dashboard/
│   └── page.tsx            # Unified dashboard
├── login/
│   └── page.tsx            # Single login
├── signup/
│   └── page.tsx            # Unified signup
├── plan-selection/
│   └── page.tsx            # Plan selection
├── verify/
│   └── page.tsx            # KYC verification
├── callback/
│   └── page.tsx            # OAuth callback
├── verified/
│   └── page.tsx            # Success page
├── docs/
│   └── page.tsx            # Documentation
└── api/
    ├── auth/
    │   ├── signup/
    │   └── profile/
    ├── token/
    ├── userinfo/
    └── health/

components/
├── ui/                     # Shadcn components
├── BackgroundWrapper.tsx
├── Features.tsx
├── Footer.tsx
├── Home.tsx
├── Navbar.tsx
├── Pricing.tsx
├── Testimonials.tsx
├── Compliance.tsx
└── DeveloperResource.tsx

lib/
├── auth.ts                 # New unified auth
├── utils.ts
├── pkce.ts
├── jwt.ts
└── faydapass-sdk.ts

hooks/
├── useAuth.ts              # New auth hook
└── use-mobile.tsx

supabase/
└── migrations/
    ├── create_unified_auth_schema.sql
    └── fix_auth_system.sql
`);