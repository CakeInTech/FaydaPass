import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, UserProfile, getUserProfile, signIn as authSignIn, signOut as authSignOut } from '@/lib/auth';

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
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          // Try to get profile, but don't fail if RLS blocks it
          try {
            const userProfile = await getUserProfile(session.user.id);
            setProfile(userProfile);
          } catch (profileError) {
            console.warn('Could not fetch profile:', profileError);
            // Create a minimal profile from auth data
            const email = session.user.email || '';
            const isAdmin = email === 'admin@faydapass.com' || 
                           email.includes('admin') ||
                           session.user.user_metadata?.role === 'admin';
            
            setProfile({
              id: session.user.id,
              email: email,
              name: session.user.user_metadata?.name || email.split('@')[0],
              role: isAdmin ? 'admin' : 'developer',
              plan_type: 'developer',
              metadata: {},
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
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
            // Try to get profile, handle RLS errors gracefully
            try {
              const userProfile = await getUserProfile(session.user.id);
              setProfile(userProfile);
            } catch (profileError) {
              console.warn('Could not fetch profile on auth change:', profileError);
              // Create minimal profile from auth data
              const email = session.user.email || '';
              const isAdmin = email === 'admin@faydapass.com' || 
                             email.includes('admin') ||
                             session.user.user_metadata?.role === 'admin';
              
              setProfile({
                id: session.user.id,
                email: email,
                name: session.user.user_metadata?.name || email.split('@')[0],
                role: isAdmin ? 'admin' : 'developer',
                plan_type: 'developer',
                metadata: {},
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });
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
    const result = await authSignIn(email, password);
    
    if (result.data?.user) {
      try {
        const userProfile = await getUserProfile(result.data.user.id);
        setProfile(userProfile);
      } catch (profileError) {
        console.warn('Could not fetch profile after sign in:', profileError);
        // Create minimal profile
        const isAdmin = email === 'admin@faydapass.com' || 
                       email.includes('admin') ||
                       result.data.user.user_metadata?.role === 'admin';
        
        setProfile({
          id: result.data.user.id,
          email: email,
          name: result.data.user.user_metadata?.name || email.split('@')[0],
          role: isAdmin ? 'admin' : 'developer',
          plan_type: 'developer',
          metadata: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    }
    
    setLoading(false);
    return result;
  };

  const signOut = async () => {
    setLoading(true);
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