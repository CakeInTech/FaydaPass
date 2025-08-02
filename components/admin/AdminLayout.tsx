"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Shield,
  LogOut,
  Users,
  Database,
  Webhook,
  BarChart3,
  Settings,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, adminUser, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || !adminUser)) {
      router.replace("/admin/login");
    }
  }, [user, adminUser, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !adminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: BarChart3,
    },
    {
      name: "Verifications",
      href: "/admin/verifications",
      icon: UserCheck,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
    },
    ...(adminUser.role === "admin"
      ? [
          {
            name: "Webhooks",
            href: "/admin/webhooks",
            icon: Webhook,
          },
          {
            name: "Settings",
            href: "/admin/settings",
            icon: Settings,
          },
        ]
      : []),
  ];

  const handleSignOut = async () => {
    await signOut();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-dark-900 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900">
                  FaydaPass
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  Admin Dashboard
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200",
                    isActive
                      ? "bg-primary-100 text-primary-700 border-r-2 border-primary-500"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5",
                      isActive ? "text-primary-500" : "text-gray-400"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info and sign out */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  {adminUser.email}
                </span>
                <span className="text-xs text-gray-500 capitalize">
                  {adminUser.role}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="py-8 px-8">{children}</main>
      </div>
    </div>
  );
}
