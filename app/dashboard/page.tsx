"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import Dashboard from "@/components/Dashboard";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <BackgroundWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      </BackgroundWrapper>
    );
  }

  if (!session) {
    return null;
  }

  const userRole = session?.user?.role || "developer";
  const companyId = session?.user?.id || "comp_001"; // Default to first company for demo

  return (
    <BackgroundWrapper>
      <Dashboard userRole={userRole} companyId={companyId} />
    </BackgroundWrapper>
  );
}
