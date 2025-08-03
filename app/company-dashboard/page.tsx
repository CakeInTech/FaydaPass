"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Shield,
  Activity,
  TrendingUp,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import {
  getCompanyById,
  getCompanyVerifications,
  Company,
  Verification,
  signOut,
} from "@/lib/supabase";
import { faydapass } from "@/lib/faydapass-sdk";

export default function CompanyDashboard() {
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    successful: 0,
    failed: 0,
    pending: 0,
  });

  useEffect(() => {
    const loadDashboard = async () => {
      const companyId = sessionStorage.getItem("company_id");
      const userEmail = sessionStorage.getItem("user_email");

      if (!companyId || !userEmail) {
        router.push("/company-signup");
        return;
      }

      try {
        // Load company data
        const companyData = await getCompanyById(companyId);
        if (companyData) {
          setCompany(companyData);
        }

        // Load verifications
        const verificationData = await getCompanyVerifications(companyId);
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

        setStats({ total, successful, failed, pending });
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
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
          <div className="text-white text-xl">Loading dashboard...</div>
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
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    {company?.name || "Company Dashboard"}
                  </h1>
                  <p className="text-white/60 text-sm">
                    {sessionStorage.getItem("user_email")}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push("/company-settings")}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

          {/* API Key Section */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">
                API Configuration
              </h2>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-green-400 text-sm font-medium">
                  Active
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">
                  API Key
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={
                      sessionStorage.getItem("api_key") || "fp_live_demo_key"
                    }
                    readOnly
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-mono text-sm"
                  />
                  <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors">
                    Copy
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-white/60 text-sm">Base URL</p>
                  <p className="text-white font-mono text-sm">
                    https://api.faydapass.com
                  </p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Status</p>
                  <p className="text-green-400 text-sm">Active</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Plan</p>
                  <p className="text-white text-sm">Professional</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Verifications */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                Recent Verifications
              </h2>
              <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {verifications.slice(0, 5).map((verification) => (
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
                        {verification.fayda_id || "No Fayda ID"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`text-sm font-medium ${getStatusColor(
                        verification.status
                      )}`}
                    >
                      {verification.status}
                    </span>
                    <span className="text-white/60 text-sm">
                      {new Date(verification.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              {verifications.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">No verifications yet</p>
                  <p className="text-white/40 text-sm">
                    Start integrating FaydaPass to see verification data here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </BackgroundWrapper>
  );
}
