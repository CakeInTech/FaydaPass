"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react";

interface Stats {
  total: number;
  success: number;
  failure: number;
  pending: number;
  successRate: number;
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    success: 0,
    failure: 0,
    pending: 0,
    successRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      if (!supabase) {
        console.warn(
          "Supabase client not initialized - environment variables missing"
        );
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("verifications")
        .select("status");

      if (error) throw error;

      const total = data.length;
      const success = data.filter((v) => v.status === "success").length;
      const failure = data.filter((v) => v.status === "failure").length;
      const pending = data.filter((v) => v.status === "pending").length;
      const successRate = total > 0 ? (success / total) * 100 : 0;

      setStats({ total, success, failure, pending, successRate });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Verifications",
      value: stats.total,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Successful",
      value: stats.success,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Failed",
      value: stats.failure,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                {stat.title === "Successful" && (
                  <p className="text-sm text-gray-500 mt-1">
                    {stats.successRate.toFixed(1)}% success rate
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
