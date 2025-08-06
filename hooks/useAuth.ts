import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();
  
  const loading = status === "loading";
  const user = session?.user || null;
  const profile = session?.user ? {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role as 'admin' | 'developer' | 'company',
    plan_type: session.user.plan_type as 'developer' | 'business',
    company_name: session.user.company_name,
    api_key: session.user.api_key,
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } : null;

  const signIn = async (email: string, password: string) => {
    const result = await nextAuthSignIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { data: null, error: new Error(result.error) };
    }

    return { data: { user: session?.user }, error: null };
  };

  const signOut = async () => {
    await nextAuthSignOut({ redirect: false });
    return { error: null };
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