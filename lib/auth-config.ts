import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create Supabase client for NextAuth adapter
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  db: {
    schema: "next_auth",
  },
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export const authConfig = {
  adapter: SupabaseAdapter({
    url: supabaseUrl,
    secret: supabaseServiceKey,
  }),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Create a temporary Supabase client for authentication
          const authClient = createClient(supabaseUrl, supabaseServiceKey)
          
          // Try to sign in with Supabase
          const { data, error } = await authClient.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          })

          if (error || !data.user) {
            console.error('Auth error:', error)
            return null
          }

          // Get user profile from our custom table
          const { data: profile, error: profileError } = await authClient
            .from('user_profiles')
            .select('*')
            .eq('email', credentials.email)
            .single()

          if (profileError || !profile) {
            console.error('Profile error:', profileError)
            return null
          }

          return {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: profile.role,
            plan_type: profile.plan_type,
            company_name: profile.company_name,
            api_key: profile.api_key,
          }
        } catch (error) {
          console.error('Authorization error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.plan_type = user.plan_type
        token.company_name = user.company_name
        token.api_key = user.api_key
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.plan_type = token.plan_type as string
        session.user.company_name = token.company_name as string
        session.user.api_key = token.api_key as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    signUp: '/signup',
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)