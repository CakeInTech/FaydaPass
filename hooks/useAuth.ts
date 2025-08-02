import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);
  const authChangeRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    // Get initial session
    const getInitialSession = async () => {
      if (!supabase) {
        console.warn(
          "Supabase client not initialized - environment variables missing"
        );
        if (mountedRef.current) {
          setLoading(false);
        }
        return;
      }

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (mountedRef.current) {
          setUser(session?.user ?? null);

          // Admin check is now done inline where needed

          setLoading(false);
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    if (supabase) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        // Prevent recursive calls and ensure component is still mounted
        if (authChangeRef.current || !mountedRef.current) {
          return;
        }

        authChangeRef.current = true;
        console.log("Auth state changed:", event, session?.user?.email);

        if (mountedRef.current) {
          setUser(session?.user ?? null);

          // Admin check is now done inline where needed

          setLoading(false);
        }

        // Reset the flag after a short delay
        setTimeout(() => {
          authChangeRef.current = false;
        }, 100);
      });

      return () => {
        mountedRef.current = false;
        subscription.unsubscribe();
      };
    }

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: new Error("Supabase not configured") };
    }

    if (isProcessingAuth) {
      return { error: new Error("Authentication already in progress") };
    }

    setIsProcessingAuth(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setIsProcessingAuth(false);
        return { error };
      }

      // Check if user is an admin after successful login
      if (data.user?.email) {
        const isAdmin = data.user.email === "admin@faydapass.com" || 
                       data.user.user_metadata?.role === "admin" ||
                       data.user.email?.includes("admin");
        
        if (!isAdmin) {
          // User is not an admin, sign them out
          await supabase.auth.signOut();
          setIsProcessingAuth(false);
          return {
            error: new Error(
              "Access denied. You are not authorized to access the admin dashboard."
            ),
          };
        }
      }

      setIsProcessingAuth(false);
      return { error: null };
    } catch (error) {
      setIsProcessingAuth(false);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    if (!supabase) {
      return { error: new Error("Supabase not configured") };
    }

    if (isProcessingAuth) {
      return { error: new Error("Authentication already in progress") };
    }

    setIsProcessingAuth(true);

    try {
      const { error } = await supabase.auth.signOut();
      // Admin state is no longer needed
      setIsProcessingAuth(false);
      return { error };
    } catch (error) {
      setIsProcessingAuth(false);
      return { error: error as Error };
    }
  };

  return {
    user,
    loading: loading || isProcessingAuth,
    signIn,
    signOut,
    isAdmin: user?.email === "admin@faydapass.com" || 
              user?.user_metadata?.role === "admin" ||
              user?.email?.includes("admin"),
    isViewer: user?.email === "admin@faydapass.com" || 
               user?.user_metadata?.role === "admin" ||
               user?.email?.includes("admin"),
    isProcessingAuth,
  };
}
