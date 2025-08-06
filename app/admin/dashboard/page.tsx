"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Users, Activity, Settings, ArrowLeft } from "lucide-react";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SignOutButton from "@/components/SignOutButton";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVerifications: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    // Check if user is admin
    if (session.user?.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    // Load admin stats
    loadAdminStats();
  }, [session, status, router]);

  const [companies, setCompanies] = useState<any[]>([]);

  const loadAdminStats = async () => {
    try {
      // Load companies data
      const companiesResponse = await fetch("/api/admin/companies");
      if (companiesResponse.ok) {
        const companiesData = await companiesResponse.json();
        setCompanies(companiesData.data || []);
      }

      // Load overall stats
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to load admin stats:", error);
    }
  };

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

  return (
    <BackgroundWrapper>
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Admin Dashboard
                </h1>
                <p className="text-white/70">
                  Welcome back, {session.user?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={() => router.push("/dashboard")}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <SignOutButton />
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <Card className="backdrop-blur-xl bg-white/5 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/70">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-white/50" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats.totalUsers}
                </div>
                <p className="text-xs text-white/50">All registered users</p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/5 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/70">
                  Total Verifications
                </CardTitle>
                <Activity className="h-4 w-4 text-white/50" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats.totalVerifications}
                </div>
                <p className="text-xs text-white/50">KYC verifications</p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/5 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/70">
                  Active Users
                </CardTitle>
                <Shield className="h-4 w-4 text-white/50" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats.activeUsers}
                </div>
                <p className="text-xs text-white/50">Users with API activity</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Companies List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-full"
          >
            <Card className="backdrop-blur-xl bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Registered Companies & Developers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {companies.map((company) => (
                    <div
                      key={company.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">
                            {company.company_name || company.name}
                          </h3>
                          <p className="text-white/70 text-sm">
                            {company.email}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge
                              variant="secondary"
                              className={`${
                                company.role === "company"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "bg-green-500/20 text-green-400"
                              }`}
                            >
                              {company.role}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="bg-purple-500/20 text-purple-400"
                            >
                              {company.plan_type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">
                          {company.stats?.totalVerifications || 0} verifications
                        </div>
                        <div className="text-white/70 text-sm">
                          {company.stats?.successRate || 0}% success rate
                        </div>
                        <div className="text-white/70 text-sm">
                          {company.stats?.apiCalls || 0} API calls
                        </div>
                      </div>
                    </div>
                  ))}
                  {companies.length === 0 && (
                    <div className="text-center py-8 text-white/70">
                      No companies registered yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Admin Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <Card className="backdrop-blur-xl bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Admin Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => router.push("/admin/create")}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700"
                >
                  Create Admin User
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-white border-white/20 hover:bg-white/10"
                >
                  View All Users
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-white border-white/20 hover:bg-white/10"
                >
                  System Settings
                </Button>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Quick Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">User Role:</span>
                  <Badge
                    variant="secondary"
                    className="bg-green-500/20 text-green-400"
                  >
                    Admin
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Plan Type:</span>
                  <Badge
                    variant="secondary"
                    className="bg-blue-500/20 text-blue-400"
                  >
                    Business
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">API Key:</span>
                  <span className="text-white text-sm">
                    {session.user?.api_key ? "Configured" : "Not set"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </BackgroundWrapper>
  );
}
