import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { 
  supabase, 
  supabaseAdmin, 
  UserProfile, 
  getUserProfile, 
  signIn as authSignIn, 
  signOut as authSignOut 
} from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        console.log('Getting initial session...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('Session found, setting user...');
          setUser(session.user);
          
          // Try to get profile with better error handling
          try {
            const userProfile = await getUserProfile(session.user.id);
            if (userProfile) {
              console.log('Profile loaded:', userProfile.role);
              setProfile(userProfile);
            } else {
              console.warn('No profile found, creating minimal profile');
              await createMinimalProfile(session.user);
            }
          } catch (profileError) {
            console.error('Profile fetch error:', profileError);
            await createMinimalProfile(session.user);
          }
        } else {
          console.log('No session found');
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    const createMinimalProfile = async (user: User) => {
      const email = user.email || '';
      const isAdmin = email === 'admin@faydapass.com' || 
                     email.includes('admin') ||
                     user.user_metadata?.role === 'admin';
      
      const minimalProfile: UserProfile = {
        id: user.id,
        email: email,
        name: user.user_metadata?.name || email.split('@')[0],
        role: isAdmin ? 'admin' : 'developer',
        plan_type: 'developer',
        metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setProfile(minimalProfile);
      
      // Try to create the profile in the database using service role
      if (supabaseAdmin) {
        try {
          await supabaseAdmin.rpc('create_user_profile', {
            user_id: user.id,
            user_email: email,
            user_name: minimalProfile.name,
            user_role: minimalProfile.role,
            user_company_name: null,
            user_plan_type: minimalProfile.plan_type,
            user_metadata: {}
          });
          console.log('Minimal profile created in database');
        } catch (dbError) {
          console.warn('Could not create profile in database:', dbError);
        }
      }
    };
    getInitialSession();

    // Listen for auth changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event);
          
          if (session?.user) {
            setUser(session.user);
            try {
              const userProfile = await getUserProfile(session.user.id);
              if (userProfile) {
                setProfile(userProfile);
              } else {
                await createMinimalProfile(session.user);
              }
            } catch (profileError) {
              console.error('Profile error on auth change:', profileError);
              await createMinimalProfile(session.user);
            }
          } else {
            setUser(null);
            setProfile(null);
          }
          
          setLoading(false);
        }
      );

      return () => subscription.unsubscribe();
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    console.log('Attempting sign in for:', email);
    
    const result = await authSignIn(email, password);
    
    if (result.data?.user) {
      console.log('Sign in successful, fetching profile...');
      try {
        const userProfile = await getUserProfile(result.data.user.id);
        if (userProfile) {
          setProfile(userProfile);
        } else {
          console.warn('No profile found after sign in');
        }
      } catch (profileError) {
        console.error('Profile error after sign in:', profileError);
      }
    }
    
    setLoading(false);
    return result;
  };

  const signOut = async () => {
    setLoading(true);
    console.log('Signing out...');
    const result = await authSignOut();
    setUser(null);
    setProfile(null);
    setLoading(false);
    return result;
  };

  return {
    user,
    profile,
    loading,
    signIn,
    signOut,
    isAdmin: profile?.role === 'admin',
    isDeveloper: profile?.role === 'developer',
    isCompany: profile?.role === 'company',
    adminUser: profile?.role === 'admin' ? profile : null,
  };
}