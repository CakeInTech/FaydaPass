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
          const userProfile = await getUserProfile(session.user.id);
          setProfile(userProfile);
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
            const userProfile = await getUserProfile(session.user.id);
            setProfile(userProfile);
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
      const userProfile = await getUserProfile(result.data.user.id);
      setProfile(userProfile);
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
  };
}