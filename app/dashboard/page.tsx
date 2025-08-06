"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Shield,
  Code,
  Building2,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Key,
  Activity,
  CheckCircle,
  Copy,
  ExternalLink,
  Download,
  Bell,
  TrendingUp,
  Zap,
  Globe,
  Home,
  FileText,
  CreditCard,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";

export default function UnifiedDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [verifications, setVerifications] = useState<any[]>([]);
  const [apiStats, setApiStats] = useState<any>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const loading = status === "loading";
  const user = session?.user;
  const profile = session?.user;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (session?.user) {
      loadDashboardData();
    }
  }, [session, status, router]);

  const loadDashboardData = async () => {
    if (!session?.user) return;

    try {
      setDashboardLoading(true);

      // Load verifications (mock data for now)
      setVerifications([]);
      setApiStats({
        total_calls: 0,
        success_rate: 100,
        avg_response_time: 150,
        failed_calls: 0,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setDashboardLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const copyApiKey = () => {
    if (session?.user?.api_key) {
      navigator.clipboard.writeText(profile?.api_key ?? "");
      toast.success("API key copied to clipboard");
    }
  };

  if (loading || dashboardLoading) {
    return (
      <BackgroundWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Loading dashboard...</p>
          </div>
        </div>
      </BackgroundWrapper>
    );
  }

  if (!user || !profile) {
    return null;
  }

  // Role-based configuration
  const roleConfig = {
    admin: {
      title: "Admin Dashboard",
      icon: <Shield className="w-6 h-6" />,
      gradient: "from-red-500 to-pink-600",
      navigation: [
        {
          id: "overview",
          label: "Overview",
          icon: <Home className="w-5 h-5" />,
        },
        { id: "users", label: "Users", icon: <Users className="w-5 h-5" /> },
        {
          id: "verifications",
          label: "Verifications",
          icon: <Activity className="w-5 h-5" />,
        },
        {
          id: "analytics",
          label: "Analytics",
          icon: <BarChart3 className="w-5 h-5" />,
        },
        {
          id: "settings",
          label: "Settings",
          icon: <Settings className="w-5 h-5" />,
        },
      ],
    },
    developer: {
      title: "Developer Dashboard",
      icon: <Code className="w-6 h-6" />,
      gradient: "from-blue-500 to-purple-600",
      navigation: [
        {
          id: "overview",
          label: "Overview",
          icon: <Home className="w-5 h-5" />,
        },
        { id: "api", label: "API Access", icon: <Key className="w-5 h-5" /> },
        {
          id: "verifications",
          label: "Verifications",
          icon: <Activity className="w-5 h-5" />,
        },
        {
          id: "docs",
          label: "Documentation",
          icon: <FileText className="w-5 h-5" />,
        },
      ],
    },
    company: {
      title: "Business Dashboard",
      icon: <Building2 className="w-6 h-6" />,
      gradient: "from-green-500 to-blue-600",
      navigation: [
        {
          id: "overview",
          label: "Overview",
          icon: <Home className="w-5 h-5" />,
        },
        {
          id: "verifications",
          label: "Verifications",
          icon: <Activity className="w-5 h-5" />,
        },
        { id: "team", label: "Team", icon: <Users className="w-5 h-5" /> },
        {
          id: "analytics",
          label: "Analytics",
          icon: <BarChart3 className="w-5 h-5" />,
        },
      ],
    },
  };

  const config =
    roleConfig[profile?.role as keyof typeof roleConfig] ||
    roleConfig.developer;

  // Calculate stats
  const totalVerifications = verifications.length;
  const successfulVerifications = verifications.filter(
    (v) => v.status === "success"
  ).length;
  const pendingVerifications = verifications.filter(
    (v) => v.status === "pending" || v.status === "processing"
  ).length;
  const successRate =
    totalVerifications > 0
      ? (successfulVerifications / totalVerifications) * 100
      : 0;

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome back, {profile?.name?.split(" ")[0]}!
              </h2>
              <p className="text-white/70">
                {profile?.role === "admin" &&
                  "Manage the FaydaPass platform and monitor all activities."}
                {profile?.role === "developer" &&
                  "Build amazing applications with government-backed KYC verification."}
                {profile?.role === "company" &&
                  `Manage KYC verifications for ${profile?.company_name}.`}
              </p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              <Card className="backdrop-blur-xl bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">
                        Total Verifications
                      </p>
                      <p className="text-3xl font-bold text-white">
                        {totalVerifications}
                      </p>
                    </div>
                    <Activity className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Successful</p>
                      <p className="text-3xl font-bold text-green-400">
                        {successfulVerifications}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Success Rate</p>
                      <p className="text-3xl font-bold text-white">
                        {successRate.toFixed(1)}%
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">API Calls</p>
                      <p className="text-3xl font-bold text-white">
                        {apiStats?.total_calls || 0}
                      </p>
                    </div>
                    <Zap className="w-8 h-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions and Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Quick Actions */}
              <Card className="backdrop-blur-xl bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile?.role === "developer" && (
                    <>
                      <Button className="w-full justify-start" variant="ghost">
                        <Code className="w-4 h-4 mr-2" />
                        View API Documentation
                      </Button>
                      <Button className="w-full justify-start" variant="ghost">
                        <Download className="w-4 h-4 mr-2" />
                        Download SDK
                      </Button>
                      <Button className="w-full justify-start" variant="ghost">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Try Demo
                      </Button>
                    </>
                  )}

                  {profile?.role === "company" && (
                    <>
                      <Button className="w-full justify-start" variant="ghost">
                        <Users className="w-4 h-4 mr-2" />
                        Invite Team Members
                      </Button>
                      <Button className="w-full justify-start" variant="ghost">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Analytics
                      </Button>
                      <Button className="w-full justify-start" variant="ghost">
                        <Settings className="w-4 h-4 mr-2" />
                        Configure Webhooks
                      </Button>
                    </>
                  )}

                  {profile?.role === "admin" && (
                    <>
                      <Button className="w-full justify-start" variant="ghost">
                        <Users className="w-4 h-4 mr-2" />
                        Manage Users
                      </Button>
                      <Button className="w-full justify-start" variant="ghost">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        System Analytics
                      </Button>
                      <Button className="w-full justify-start" variant="ghost">
                        <Settings className="w-4 h-4 mr-2" />
                        System Settings
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="backdrop-blur-xl bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {verifications.slice(0, 5).map((verification) => (
                      <div
                        key={verification.id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              verification.status === "success"
                                ? "bg-green-400"
                                : verification.status === "failed"
                                ? "bg-red-400"
                                : "bg-yellow-400"
                            }`}
                          />
                          <div>
                            <p className="text-white text-sm font-medium">
                              {verification.user_email}
                            </p>
                            <p className="text-white/60 text-xs">
                              {new Date(
                                verification.created_at
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge
                          className={`${
                            verification.status === "success"
                              ? "bg-green-500/20 text-green-400"
                              : verification.status === "failed"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          } border-0`}
                        >
                          {verification.status}
                        </Badge>
                      </div>
                    ))}

                    {verifications.length === 0 && (
                      <div className="text-center py-8">
                        <Activity className="w-12 h-12 text-white/40 mx-auto mb-4" />
                        <p className="text-white/60">No verifications yet</p>
                        <p className="text-white/40 text-sm">
                          {profile?.role === "developer"
                            ? "Start integrating FaydaPass to see verification data"
                            : "Begin verifying users to see activity here"}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        );

      case "api":
        return (
          <div className="space-y-6">
            <Card className="backdrop-blur-xl bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Key className="w-5 h-5 mr-2" />
                  API Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-white/70 text-sm mb-2 block">
                    Your API Key
                  </Label>
                  <div className="flex items-center space-x-3">
                    <Input
                      type="text"
                      value={profile?.api_key || "Loading..."}
                      readOnly
                      className="bg-white/10 border-white/20 text-white font-mono text-sm"
                    />
                    <Button
                      onClick={copyApiKey}
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
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
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-green-400 text-sm">Active</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Rate Limit</p>
                    <p className="text-white text-sm">
                      {profile?.plan_type === "developer" ? "1,000" : "50,000"}
                      /month
                    </p>
                  </div>
                </div>

                {/* API Usage Stats */}
                {apiStats && (
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-3">
                      This Month's Usage
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-white/60 text-xs">Total Calls</p>
                        <p className="text-white font-bold">
                          {apiStats.total_calls}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/60 text-xs">Success Rate</p>
                        <p className="text-green-400 font-bold">
                          {apiStats.success_rate.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-white/60 text-xs">Avg Response</p>
                        <p className="text-white font-bold">
                          {apiStats.avg_response_time}ms
                        </p>
                      </div>
                      <div>
                        <p className="text-white/60 text-xs">Failed Calls</p>
                        <p className="text-red-400 font-bold">
                          {apiStats.failed_calls}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case "verifications":
        return (
          <div className="space-y-6">
            <Card className="backdrop-blur-xl bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">
                  {profile?.role === "admin"
                    ? "All Verifications"
                    : "Your Verifications"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {verifications.map((verification) => (
                    <div
                      key={verification.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            verification.status === "success"
                              ? "bg-green-400"
                              : verification.status === "failed"
                              ? "bg-red-400"
                              : "bg-yellow-400"
                          }`}
                        />
                        <div>
                          <p className="text-white font-medium">
                            {verification.user_email}
                          </p>
                          <p className="text-white/60 text-sm">
                            {verification.fayda_id || "No Fayda ID"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={`${
                            verification.status === "success"
                              ? "bg-green-500/20 text-green-400"
                              : verification.status === "failed"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          } border-0 mb-1`}
                        >
                          {verification.status}
                        </Badge>
                        <p className="text-white/60 text-xs">
                          {new Date(
                            verification.created_at
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <Card className="backdrop-blur-xl bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">
                  This section will be implemented soon.
                </p>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <BackgroundWrapper>
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-black/20 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:static lg:inset-0`}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 bg-gradient-to-br ${config.gradient} rounded-lg flex items-center justify-center`}
                >
                  {config.icon}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">FaydaPass</h2>
                  <p className="text-white/60 text-xs">
                    {profile?.plan_type} plan
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {config.navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-white/10">
              <div className="space-y-2">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 lg:hidden">
            <div className="flex items-center justify-between p-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-white p-2 rounded-lg hover:bg-white/10"
              >
                {sidebarOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white"
                >
                  <Bell className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </div>
          </main>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </BackgroundWrapper>
  );
}
