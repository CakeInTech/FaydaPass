import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase, AdminUser, checkAdminUser } from "@/lib/supabase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      if (!supabase) {
        console.warn(
          "Supabase client not initialized - environment variables missing"
        );
        setLoading(false);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user?.email) {
        const admin = await checkAdminUser(session.user.email);
        setAdminUser(admin);
      }

      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    if (supabase) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        setUser(session?.user ?? null);

        if (session?.user?.email) {
          const admin = await checkAdminUser(session.user.email);
          console.log("Admin check result:", admin);
          setAdminUser(admin);
        } else {
          setAdminUser(null);
        }

        setLoading(false);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: new Error("Supabase not configured") };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      // Check if user is an admin after successful login
      if (data.user?.email) {
        const admin = await checkAdminUser(data.user.email);
        if (!admin) {
          // User is not an admin, sign them out
          await supabase.auth.signOut();
          return {
            error: new Error(
              "Access denied. You are not authorized to access the admin dashboard."
            ),
          };
        }
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    if (!supabase) {
      return { error: new Error("Supabase not configured") };
    }
    const { error } = await supabase.auth.signOut();
    setAdminUser(null);
    return { error };
  };

  return {
    user,
    adminUser,
    loading,
    signIn,
    signOut,
    isAdmin: adminUser?.role === "admin",
    isViewer: adminUser?.role === "viewer" || adminUser?.role === "admin",
  };
}
