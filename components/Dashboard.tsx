"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Users,
  Shield,
  Activity,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  Download,
  Settings,
  Key,
  Building2,
  BarChart3,
  Calendar,
  Smartphone,
  Globe,
  LogOut,
  Code,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignOutButton from "@/components/SignOutButton";
import {
  mockCompanies,
  mockVerifications,
  mockApiUsage,
  getOverallStats,
  getVerificationsByCompany,
  getApiUsageByCompany,
  type MockCompany,
  type MockVerification,
  type MockApiUsage,
} from "@/lib/mock-data";

interface DashboardProps {
  userRole: "admin" | "company" | "developer";
  companyId?: string;
}

export default function Dashboard({ userRole, companyId }: DashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCompany, setSelectedCompany] = useState<MockCompany | null>(
    null
  );
  const [verifications, setVerifications] = useState<MockVerification[]>([]);
  const [apiUsage, setApiUsage] = useState<MockApiUsage[]>([]);

  useEffect(() => {
    if (userRole === "admin") {
      // Admin sees all data
      setVerifications(mockVerifications);
      setApiUsage(mockApiUsage);
    } else if (userRole === "company" && companyId) {
      // Company users see their company data
      const company = mockCompanies.find((c) => c.id === companyId);
      if (company) {
        setSelectedCompany(company);
        setVerifications(getVerificationsByCompany(companyId));
        setApiUsage(getApiUsageByCompany(companyId));
      }
    } else if (userRole === "developer") {
      // Developers see developer-specific data (no company)
      setVerifications([]); // Developers don't have verifications yet
      setApiUsage([]); // Developers don't have API usage yet
    }
  }, [userRole, companyId]);

  const overallStats = getOverallStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "processing":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "pending":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4" />;
      case "failed":
        return <XCircle className="w-4 h-4" />;
      case "processing":
        return <Clock className="w-4 h-4" />;
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="backdrop-blur-xl bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              {userRole === "admin"
                ? "Total Companies"
                : userRole === "developer"
                ? "API Key"
                : "Total Verifications"}
            </CardTitle>
            <Users className="h-4 w-4 text-white/50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {userRole === "admin"
                ? overallStats.totalCompanies
                : userRole === "developer"
                ? "fp_dev_..."
                : selectedCompany?.stats.totalVerifications || 0}
            </div>
            <p className="text-xs text-white/50">
              {userRole === "admin"
                ? "Registered companies"
                : userRole === "developer"
                ? "Your API key"
                : "All time verifications"}
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              {userRole === "admin"
                ? "Total Verifications"
                : userRole === "developer"
                ? "Plan Type"
                : "Success Rate"}
            </CardTitle>
            <Shield className="h-4 w-4 text-white/50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {userRole === "admin"
                ? overallStats.totalVerifications
                : userRole === "developer"
                ? "Developer"
                : `${selectedCompany?.stats.successRate || 0}%`}
            </div>
            <p className="text-xs text-white/50">
              {userRole === "admin"
                ? "All verifications"
                : userRole === "developer"
                ? "Your plan"
                : "Successful verifications"}
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              {userRole === "admin"
                ? "Success Rate"
                : userRole === "developer"
                ? "API Calls"
                : "API Calls"}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-white/50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {userRole === "admin"
                ? `${overallStats.successRate}%`
                : userRole === "developer"
                ? "0"
                : selectedCompany?.stats.apiCalls || 0}
            </div>
            <p className="text-xs text-white/50">
              {userRole === "admin"
                ? "Overall success rate"
                : userRole === "developer"
                ? "This month"
                : "This month"}
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              {userRole === "admin"
                ? "API Calls"
                : userRole === "developer"
                ? "Remaining Calls"
                : "Remaining Calls"}
            </CardTitle>
            <Activity className="h-4 w-4 text-white/50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {userRole === "admin"
                ? overallStats.totalApiCalls
                : userRole === "developer"
                ? "1000"
                : selectedCompany?.stats.remainingCalls || 0}
            </div>
            <p className="text-xs text-white/50">
              {userRole === "admin"
                ? "Total API calls"
                : userRole === "developer"
                ? "Free tier limit"
                : "This month"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="backdrop-blur-xl bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            {userRole === "developer"
              ? "Recent Activity"
              : "Recent Verifications"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userRole === "developer" ? (
              <div className="text-center py-8 text-white/70">
                <Code className="w-12 h-12 mx-auto mb-4 text-white/50" />
                <p className="text-lg font-semibold mb-2">No Activity Yet</p>
                <p className="text-sm">
                  Start integrating our SDK to see your activity here.
                </p>
              </div>
            ) : (
              verifications.slice(0, 5).map((verification) => (
                <div
                  key={verification.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">
                        {verification.user_data.name || verification.user_email}
                      </h4>
                      <p className="text-white/70 text-sm">
                        {verification.user_email}
                      </p>
                      <p className="text-white/50 text-xs">
                        {formatDate(verification.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge className={getStatusColor(verification.status)}>
                      {getStatusIcon(verification.status)}
                      <span className="ml-1 capitalize">
                        {verification.status}
                      </span>
                    </Badge>
                    {verification.fayda_id && (
                      <span className="text-white/70 text-sm">
                        ID: {verification.fayda_id}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderVerifications = () => (
    <Card className="backdrop-blur-xl bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            All Verifications
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="text-white border-white/20 hover:bg-white/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-white border-white/20 hover:bg-white/10"
            >
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
          </div>
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
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">
                    {verification.user_data.name || verification.user_email}
                  </h4>
                  <p className="text-white/70 text-sm">
                    {verification.user_email}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-white/50 text-xs">
                      {verification.user_data.phone}
                    </span>
                    <span className="text-white/50 text-xs">•</span>
                    <span className="text-white/50 text-xs capitalize">
                      {verification.user_data.source}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-white/70 text-sm">
                    {formatDate(verification.created_at)}
                  </p>
                  {verification.completed_at && (
                    <p className="text-white/50 text-xs">
                      Completed: {formatDate(verification.completed_at)}
                    </p>
                  )}
                </div>
                <Badge className={getStatusColor(verification.status)}>
                  {getStatusIcon(verification.status)}
                  <span className="ml-1 capitalize">{verification.status}</span>
                </Badge>
                {verification.match_score && (
                  <span className="text-white/70 text-sm">
                    Score: {verification.match_score}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderApiUsage = () => (
    <Card className="backdrop-blur-xl bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          API Usage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {apiUsage.map((usage) => (
            <div
              key={usage.id}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">{usage.endpoint}</h4>
                  <p className="text-white/70 text-sm">{usage.method}</p>
                  <p className="text-white/50 text-xs">
                    {formatDate(usage.created_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge
                  className={
                    usage.status_code === 200
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : "bg-red-500/20 text-red-400 border-red-500/30"
                  }
                >
                  {usage.status_code}
                </Badge>
                <span className="text-white/70 text-sm">
                  {usage.response_time}ms
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderSDKDocs = () => (
    <Card className="backdrop-blur-xl bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <Code className="w-5 h-5 mr-2" />
            SDK Documentation
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="text-white border-white/20 hover:bg-white/10"
              onClick={() => router.push("/sdk-examples")}
            >
              <Globe className="w-4 h-4 mr-2" />
              View Full Docs
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  Quick Start
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <pre className="text-green-400 text-sm">
                      {`npm install @faydapass/sdk

import FaydaPassSDK from '@faydapass/sdk';

const faydaPass = new FaydaPassSDK('your-api-key');`}
                    </pre>
                  </div>
                  <p className="text-white/70 text-sm">
                    Get started with our SDK in just 3 lines of code.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  API Reference
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-white font-semibold">Methods</h4>
                    <ul className="text-white/70 text-sm space-y-1">
                      <li>
                        •{" "}
                        <code className="text-green-400">
                          initiateVerification()
                        </code>
                      </li>
                      <li>
                        •{" "}
                        <code className="text-green-400">
                          getVerificationStatus()
                        </code>
                      </li>
                      <li>
                        •{" "}
                        <code className="text-green-400">validateApiKey()</code>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Your API Key</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 rounded-lg p-4">
                <code className="text-green-400 text-sm">
                  fp_dev_your_api_key_here
                </code>
              </div>
              <p className="text-white/70 text-sm mt-2">
                Use this API key to authenticate your requests.
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );

  const renderCompanies = () => (
    <div className="space-y-6">
      {mockCompanies.map((company) => (
        <Card
          key={company.id}
          className="backdrop-blur-xl bg-white/5 border-white/10"
        >
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                {company.name}
              </div>
              <div className="flex items-center space-x-2">
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
                  className={`${
                    company.plan_type === "business"
                      ? "bg-orange-500/20 text-orange-400"
                      : "bg-purple-500/20 text-purple-400"
                  }`}
                >
                  {company.plan_type}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {company.stats.totalVerifications}
                </div>
                <p className="text-white/70 text-sm">Total Verifications</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {company.stats.successRate}%
                </div>
                <p className="text-white/70 text-sm">Success Rate</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {company.stats.apiCalls}
                </div>
                <p className="text-white/70 text-sm">API Calls</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {company.stats.remainingCalls}
                </div>
                <p className="text-white/70 text-sm">Remaining</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">API Key:</span>
                <code className="text-white/90 text-sm bg-white/10 px-2 py-1 rounded">
                  {company.api_key}
                </code>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-white/70 text-sm">Email:</span>
                <span className="text-white/90 text-sm">{company.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">
              {userRole === "admin"
                ? "Admin Dashboard"
                : userRole === "developer"
                ? "Developer Dashboard"
                : `${selectedCompany?.name || "Company"} Dashboard`}
            </h1>
            <p className="text-white/70">
              {userRole === "admin"
                ? "Monitor all companies and verifications"
                : userRole === "developer"
                ? "Manage your API keys and usage"
                : "Track your verifications and API usage"}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="text-white border-white/20 hover:bg-white/10 bg-transparent"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="outline"
              className="text-white border-white/20 hover:bg-white/10 bg-transparent"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <SignOutButton />
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList
            className={`grid w-full ${
              userRole === "admin"
                ? "grid-cols-4"
                : userRole === "developer"
                ? "grid-cols-3"
                : "grid-cols-3"
            } bg-white/5 border border-white/10`}
          >
            <TabsTrigger
              value="overview"
              className="text-white data-[state=active]:bg-white/10"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            {userRole !== "developer" && (
              <TabsTrigger
                value="verifications"
                className="text-white data-[state=active]:bg-white/10"
              >
                <Shield className="w-4 h-4 mr-2" />
                Verifications
              </TabsTrigger>
            )}
            <TabsTrigger
              value="api-usage"
              className="text-white data-[state=active]:bg-white/10"
            >
              <Activity className="w-4 h-4 mr-2" />
              API Usage
            </TabsTrigger>
            {userRole === "developer" && (
              <TabsTrigger
                value="sdk"
                className="text-white data-[state=active]:bg-white/10"
              >
                <Code className="w-4 h-4 mr-2" />
                SDK Docs
              </TabsTrigger>
            )}
            {userRole === "admin" && (
              <TabsTrigger
                value="companies"
                className="text-white data-[state=active]:bg-white/10"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Companies
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {renderOverview()}
          </TabsContent>

          <TabsContent value="verifications" className="space-y-6">
            {renderVerifications()}
          </TabsContent>

          <TabsContent value="api-usage" className="space-y-6">
            {renderApiUsage()}
          </TabsContent>

          {userRole === "developer" && (
            <TabsContent value="sdk" className="space-y-6">
              {renderSDKDocs()}
            </TabsContent>
          )}

          {userRole === "admin" && (
            <TabsContent value="companies" className="space-y-6">
              {renderCompanies()}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
