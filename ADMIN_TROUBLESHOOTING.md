# Admin Dashboard Troubleshooting Guide

## Problem: Admin page keeps redirecting to home page

### Step 1: Check Debug Information
Visit `/admin/debug` to see detailed information about:
- Environment variables
- Authentication status
- Admin user status
- Cookies

### Step 2: Verify Environment Variables
Make sure you have these environment variables set in your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Step 3: Set Up Admin User

#### Option A: Run the setup script (Recommended)
```bash
cd FaydaPass
node scripts/create-admin-user.js
```

This will create an admin user in Supabase Auth with:
- Email: `admin@faydapass.com`
- Password: `admin123456`

#### Option B: Manual setup
1. Go to your Supabase dashboard
2. Navigate to Authentication > Users
3. Click "Add User"
4. Enter:
   - Email: `admin@faydapass.com`
   - Password: (choose a secure password)
   - User Metadata: `{"role": "admin"}`
5. Save the user

### Step 4: Test Login
1. Go to `/admin/login`
2. Login with:
   - Email: `admin@faydapass.com`
   - Password: `admin123456` (or the password you set)



### Common Issues and Solutions

#### Issue: "User is not an admin"
**Solution**: The user email doesn't match the admin criteria. Make sure you're using `admin@faydapass.com` or an email that contains "admin".

#### Issue: "No authenticated user found"
**Solution**: You're not logged in. Go to `/admin/login` and sign in.

#### Issue: "Authentication error occurred"
**Solution**: Check your environment variables and Supabase connection.

#### Issue: Missing environment variables
**Solution**: Create a `.env.local` file with your Supabase credentials.

### Authentication Check
The simplified admin system checks for:
1. User is authenticated with Supabase Auth
2. User email is `admin@faydapass.com` OR contains "admin" OR has role "admin" in metadata

No database table lookup is required.

### Middleware Debugging
The middleware checks for:
1. Valid authentication token
2. User email is `admin@faydapass.com` OR contains "admin" OR has role "admin" in metadata

If any of these fail, it redirects to the appropriate page.

### Browser Console
Check your browser's developer console for any JavaScript errors that might provide additional clues.

### Network Tab
Check the Network tab in developer tools to see if API calls are failing.

## Still Having Issues?

1. Check the debug page at `/admin/debug`
2. Look at browser console for errors
3. Verify Supabase connection
4. Ensure all environment variables are set
5. Check that the admin user exists in both Auth and the database 