"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Activity,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Verification } from "@/lib/supabase";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    failure: 0,
    pending: 0,
    successRate: 0,
    avgMatchScore: 0,
    avgLivenessScore: 0,
  });
  const [recentVerifications, setRecentVerifications] = useState<
    Verification[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      if (!supabase) {
        console.error("Supabase client not initialized");
        return;
      }

      // Check if user is authenticated
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        console.error("No active session");
        return;
      }

      // Fetch all verifications
      const { data: verifications, error } = await supabase
        .from("verifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching verifications:", error);
        return;
      }

      const verificationsData = verifications || [];

      // Calculate stats
      const total = verificationsData.length;
      const success = verificationsData.filter(
        (v) => v.status === "success"
      ).length;
      const failure = verificationsData.filter(
        (v) => v.status === "failure"
      ).length;
      const pending = verificationsData.filter(
        (v) => v.status === "pending"
      ).length;

      const successRate = total > 0 ? (success / total) * 100 : 0;

      const completedVerifications = verificationsData.filter(
        (v) => v.status !== "pending"
      );
      const avgMatchScore =
        completedVerifications.length > 0
          ? completedVerifications.reduce(
              (sum, v) => sum + (v.match_score || 0),
              0
            ) / completedVerifications.length
          : 0;
      const avgLivenessScore =
        completedVerifications.length > 0
          ? completedVerifications.reduce(
              (sum, v) => sum + (v.liveness_score || 0),
              0
            ) / completedVerifications.length
          : 0;

      setStats({
        total,
        success,
        failure,
        pending,
        successRate,
        avgMatchScore,
        avgLivenessScore,
      });

      setRecentVerifications(verificationsData.slice(0, 5));
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: "bg-green-100 text-green-800",
      failure: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
    };
    return (
      <Badge
        className={
          variants[status as keyof typeof variants] ||
          "bg-gray-100 text-gray-800"
        }
      >
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Monitor and manage KYC verification jobs
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Verifications
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">
                    All time verifications
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Success Rate
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.successRate.toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats.success} successful out of {stats.total}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg Match Score
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.avgMatchScore.toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Average biometric match score
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pending}</div>
                  <p className="text-xs text-muted-foreground">
                    Verifications in progress
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Status Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Successful
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {stats.success}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Verifications completed successfully
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    Failed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">
                    {stats.failure}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Verifications that failed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    Issues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600">
                    {stats.failure}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Verifications with issues
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Verifications */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Verifications</CardTitle>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {recentVerifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No verifications found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentVerifications.map((verification) => (
                      <div
                        key={verification.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div>
                            <div className="font-medium">
                              {verification.user_email}
                            </div>
                            <div className="text-sm text-gray-500">
                              {verification.type} • {verification.api_provider}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              Match: {verification.match_score}%
                            </div>
                            <div className="text-sm text-gray-500">
                              Liveness: {verification.liveness_score}%
                            </div>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(verification.status)}
                            <div className="text-xs text-gray-500 mt-1">
                              {formatDate(verification.created_at)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
