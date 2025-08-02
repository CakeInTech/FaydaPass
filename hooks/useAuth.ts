import { useEffect, useState, useRef } from "react";
import { User } from "@supabase/supabase-js";
import { supabase, AdminUser, checkAdminUser } from "@/lib/supabase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
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

          if (session?.user?.email) {
            const admin = await checkAdminUser(session.user.email);
            if (mountedRef.current) {
              setAdminUser(admin);
            }
          }

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

          if (session?.user?.email) {
            try {
              const admin = await checkAdminUser(session.user.email);
              console.log("Admin check result:", admin);
              if (mountedRef.current) {
                setAdminUser(admin);
              }
            } catch (error) {
              console.error("Error checking admin status:", error);
              if (mountedRef.current) {
                setAdminUser(null);
              }
            }
          } else {
            if (mountedRef.current) {
              setAdminUser(null);
            }
          }

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
        try {
          const admin = await checkAdminUser(data.user.email);
          if (!admin) {
            // User is not an admin, sign them out
            await supabase.auth.signOut();
            setIsProcessingAuth(false);
            return {
              error: new Error(
                "Access denied. You are not authorized to access the admin dashboard."
              ),
            };
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
          await supabase.auth.signOut();
          setIsProcessingAuth(false);
          return {
            error: new Error("Error verifying admin access. Please try again."),
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
      if (mountedRef.current) {
        setAdminUser(null);
      }
      setIsProcessingAuth(false);
      return { error };
    } catch (error) {
      setIsProcessingAuth(false);
      return { error: error as Error };
    }
  };

  return {
    user,
    adminUser,
    loading: loading || isProcessingAuth,
    signIn,
    signOut,
    isAdmin: adminUser?.role === "admin",
    isViewer: adminUser?.role === "viewer" || adminUser?.role === "admin",
    isProcessingAuth,
  };
}
