"use client";

import BackgroundWrapper from "@/components/BackgroundWrapper";
import {
  Company,
  getAllVerifications,
  getCurrentUser,
  signOut,
  Verification
} from "@/lib/supabase";
import {
  Activity,
  Building2,
  CheckCircle,
  Clock,
  Eye,
  LogOut,
  Settings,
  Users,
  XCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const router = useRouter();
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState<string>("Checking authentication...");
  const [stats, setStats] = useState({
    total: 0,
    successful: 0,
    failed: 0,
    pending: 0,
    companies: 0,
  });

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Check if user is authenticated
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          setAuthStatus("No authenticated user found");
          router.push("/admin/login");
          return;
        }

        setAuthStatus(`User authenticated: ${currentUser.email}`);

        // Check if user is admin using simplified approach
        const isAdmin = currentUser.email === "admin@faydapass.com" || 
                       currentUser.user_metadata?.role === "admin" ||
                       currentUser.email?.includes("admin");
        
        if (!isAdmin) {
          setAuthStatus("User is not an admin");
          console.error("User is not an admin:", currentUser.email);
          router.push("/");
          return;
        }

        setAuthStatus(`Admin access confirmed for: ${currentUser.email}`);

        // Load dashboard data
        const loadDashboard = async () => {
          try {
            // Load all verifications
            const verificationData = await getAllVerifications();
            setVerifications(verificationData);

            // Calculate stats
            const total = verificationData.length;
            const successful = verificationData.filter(
              (v) => v.status === "success"
            ).length;
            const failed = verificationData.filter(
              (v) => v.status === "failed"
            ).length;
            const pending = verificationData.filter(
              (v) => v.status === "pending" || v.status === "processing"
            ).length;

            // Get unique companies
            const uniqueCompanies = Array.from(
              new Set(
                verificationData
                  .map((v) => v.company_id)
                  .filter((id): id is string => id !== null && id !== undefined)
              )
            );
            const companies = uniqueCompanies.length;

            setStats({ total, successful, failed, pending, companies });
          } catch (error) {
            console.error("Error loading dashboard:", error);
          } finally {
            setLoading(false);
          }
        };

        loadDashboard();
      } catch (error) {
        console.error("Authentication check error:", error);
        setAuthStatus("Authentication error occurred");
        router.push("/admin/login");
      }
    };

    checkAuthentication();
  }, [router]);

  const handleLogout = async () => {
    try {
      // Properly sign out from Supabase Auth
      const { error } = await signOut();

      if (error) {
        console.error("Error signing out:", error);
      }

      // Clear session storage
      sessionStorage.clear();

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if there's an error, clear session and redirect
      sessionStorage.clear();
      router.push("/");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-400" />;
      case "pending":
      case "processing":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-400";
      case "failed":
        return "text-red-400";
      case "pending":
      case "processing":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  if (loading) {
    return (
      <BackgroundWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-white text-xl mb-4">Loading admin dashboard...</div>
            <div className="text-white/60 text-sm">{authStatus}</div>
          </div>
        </div>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-white/5 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    FaydaPass Admin Dashboard
                  </h1>
                  <p className="text-white/60 text-sm">
                    System Overview & Analytics
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push("/admin/settings")}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  onClick={handleLogout}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            {[
              {
                title: "Total Verifications",
                value: stats.total,
                icon: <Activity className="w-6 h-6 text-blue-400" />,
                color: "text-blue-400",
              },
              {
                title: "Successful",
                value: stats.successful,
                icon: <CheckCircle className="w-6 h-6 text-green-400" />,
                color: "text-green-400",
              },
              {
                title: "Failed",
                value: stats.failed,
                icon: <XCircle className="w-6 h-6 text-red-400" />,
                color: "text-red-400",
              },
              {
                title: "Pending",
                value: stats.pending,
                icon: <Clock className="w-6 h-6 text-yellow-400" />,
                color: "text-yellow-400",
              },
              {
                title: "Active Companies",
                value: stats.companies,
                icon: <Building2 className="w-6 h-6 text-purple-400" />,
                color: "text-purple-400",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium">
                      {stat.title}
                    </p>
                    <p className={`text-3xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Verifications */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                Recent Verifications
              </h2>
              <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {verifications.slice(0, 10).map((verification) => (
                <div
                  key={verification.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(verification.status)}
                    <div>
                      <p className="text-white font-medium">
                        {verification.user_email}
                      </p>
                      <p className="text-white/60 text-sm">
                        Company ID: {verification.company_id?.substring(0, 8)}
                        ...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span
                        className={`text-sm font-medium ${getStatusColor(
                          verification.status
                        )}`}
                      >
                        {verification.status}
                      </span>
                      <p className="text-white/60 text-sm">
                        {new Date(verification.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button className="text-white/60 hover:text-white transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {verifications.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">No verifications yet</p>
                  <p className="text-white/40 text-sm">
                    Verification data will appear here as companies integrate
                    FaydaPass
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* System Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">System Status</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-medium">
                    All Systems Operational
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  {
                    service: "API Gateway",
                    status: "Operational",
                    color: "text-green-400",
                  },
                  {
                    service: "Fayda Integration",
                    status: "Operational",
                    color: "text-green-400",
                  },
                  {
                    service: "Database",
                    status: "Operational",
                    color: "text-green-400",
                  },
                  {
                    service: "Webhook Service",
                    status: "Operational",
                    color: "text-green-400",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-white">{item.service}</span>
                    <span className={`text-sm font-medium ${item.color}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Quick Actions</h3>
              </div>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300">
                  View All Companies
                </button>
                <button className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-300">
                  Generate Reports
                </button>
                <button className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300">
                  System Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackgroundWrapper>
  );
}
