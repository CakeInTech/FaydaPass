# FaydaPass Unified Authentication Setup Instructions

## Overview

This implementation provides a comprehensive, unified authentication and dashboard system with proper role-based access control. The system supports three user roles (Admin, Developer, Company) with a single adaptive dashboard that changes based on user permissions.

## Key Improvements

### 1. **Unified Dashboard System**
- Single `/dashboard` route that adapts based on user role
- Role-based UI components and navigation tabs
- Proper authorization middleware that works correctly
- Seamless user experience across all roles

### 2. **Improved User Flow**
- Clean plan selection page (`/plan-selection`)
- Unified signup flow with role-specific fields
- Single login page for all user types
- Automatic redirection to appropriate dashboard sections

### 3. **Robust Authentication**
- Working middleware with proper session management
- Role-based route protection
- Secure password handling with Supabase Auth
- Proper cleanup of failed registrations

### 4. **Optimized Database Schema**
- `user_profiles` table for unified user management
- `verification_records` for comprehensive tracking
- `api_usage` for analytics and billing
- Proper RLS policies for security

## Setup Instructions

### Step 1: Environment Configuration

Ensure your `.env.local` file contains:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Fayda eSignet Configuration (existing)
NEXT_PUBLIC_CLIENT_ID=crXYIYg2cJiNTaw5t-peoPzCRo-3JATNfBd5A86U8t0
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/callback
NEXT_PUBLIC_AUTHORIZATION_ENDPOINT=https://esignet.ida.fayda.et/authorize
NEXT_PUBLIC_TOKEN_ENDPOINT=https://esignet.ida.fayda.et/v1/esignet/oauth/v2/token
NEXT_PUBLIC_USERINFO_ENDPOINT=https://esignet.ida.fayda.et/v1/esignet/oidc/userinfo
PRIVATE_KEY=your_base64_encoded_jwk_private_key
```

### Step 2: Database Migration

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the migration file: `supabase/migrations/create_unified_auth_schema.sql`
4. Verify all tables are created successfully

### Step 3: Setup Demo Users

Run the setup script to create demo users:

```bash
node scripts/setup-unified-auth.js
```

This will create:
- Admin user: `admin@faydapass.com` / `admin123456`
- Developer user: `developer@example.com` / `developer123`
- Company user: `company@example.com` / `company123`

### Step 4: Start the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to see the new system in action.

## Testing the System

### 1. **Plan Selection Flow**
- Visit `/plan-selection`
- Choose between Developer and Business plans
- Complete the signup process
- Verify automatic dashboard redirection

### 2. **Login Flow**
- Visit `/login`
- Test with demo credentials
- Verify role-based dashboard adaptation
- Test logout functionality

### 3. **Dashboard Features**
- **Admin Dashboard**: User management, system analytics, all verifications
- **Developer Dashboard**: API access, documentation, personal verifications
- **Company Dashboard**: Team management, business analytics, company verifications

### 4. **Middleware Testing**
- Try accessing protected routes without authentication
- Verify proper redirections
- Test role-based access control
- Confirm session persistence

## Architecture Benefits

### 1. **Simplified User Experience**
- Single entry point for all users
- Consistent UI/UX across roles
- Intuitive navigation and workflows

### 2. **Maintainable Codebase**
- Unified authentication logic
- Shared components with role-based rendering
- Single dashboard with adaptive content

### 3. **Scalable Security**
- Proper middleware implementation
- Role-based access control
- Secure session management
- Database-level security with RLS

### 4. **Developer Friendly**
- Clear separation of concerns
- Type-safe interfaces
- Comprehensive error handling
- Easy to extend for new roles

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Existing Endpoints (unchanged)
- `POST /api/token` - OAuth token exchange
- `GET /api/userinfo` - Fetch user information
- `POST /api/save-verification` - Save verification data

## Database Schema

### Core Tables
1. **user_profiles** - Unified user management
2. **verification_records** - Comprehensive verification tracking
3. **api_usage** - Usage analytics and billing

### Security Features
- Row Level Security (RLS) enabled on all tables
- Role-based access policies
- Proper foreign key constraints
- Performance-optimized indexes

## Troubleshooting

### Common Issues

1. **Middleware not working**
   - Ensure Supabase environment variables are set
   - Check that user profiles exist in database
   - Verify RLS policies are correctly configured

2. **Login redirects not working**
   - Clear browser cache and cookies
   - Check middleware configuration
   - Verify user roles in database

3. **Dashboard not loading**
   - Check browser console for errors
   - Verify API endpoints are responding
   - Ensure user profile exists

### Debug Steps

1. Check `/api/health` endpoint
2. Verify Supabase connection
3. Test authentication with demo credentials
4. Check browser network tab for failed requests

## Next Steps

1. **Enhanced Features**
   - Real-time notifications
   - Advanced analytics
   - Team collaboration tools
   - API rate limiting

2. **Production Deployment**
   - Environment-specific configurations
   - SSL certificates
   - Database backups
   - Monitoring and logging

3. **Integration Testing**
   - End-to-end test suite
   - Load testing
   - Security auditing
   - Performance optimization

This unified system provides a solid foundation for scaling FaydaPass while maintaining security, usability, and developer experience.