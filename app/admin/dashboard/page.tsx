"use client";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { supabase, Verification, WebhookLog } from "@/lib/supabase";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Globe,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const { adminUser } = useAuth();
  const [stats, setStats] = useState({
    verifications: 0,
    users: 0,
    webhooks: 0,
  });
  const [recentVerifications, setRecentVerifications] = useState<
    Verification[]
  >([]);
  const [failedWebhooks, setFailedWebhooks] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!supabase) return;
      setLoading(true);

      // Fetch stats
      const { count: verificationsCount } = await supabase
        .from("verifications")
        .select("*", { count: "exact", head: true });
      const { count: usersCount } = await supabase
        .from("admin_users")
        .select("*", { count: "exact", head: true });
      const { count: webhooksCount } = await supabase
        .from("webhook_logs")
        .select("*", { count: "exact", head: true });

      setStats({
        verifications: verificationsCount || 0,
        users: usersCount || 0,
        webhooks: webhooksCount || 0,
      });

      // Fetch recent verifications
      const { data: verificationsData } = await supabase
        .from("verifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      setRecentVerifications(verificationsData || []);

      // Fetch failed webhooks
      const { data: webhooksData } = await supabase
        .from("webhook_logs")
        .select("*")
        .eq("status", "fail")
        .order("created_at", { ascending: false })
        .limit(5);
      setFailedWebhooks(webhooksData || []);

      setLoading(false);
    };

    fetchData();
  }, []);

  const getStatusBadge = (status: string) => {
    const variants = {
      success: "bg-green-100 text-green-800",
      failure: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
      fail: "bg-red-100 text-red-800",
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {adminUser?.email || "Admin"}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's a quick overview of your system.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Verifications
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.verifications}</div>
              <p className="text-xs text-muted-foreground">
                <Link href="/admin/verifications" className="hover:underline">
                  View all
                </Link>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.users}</div>
              <p className="text-xs text-muted-foreground">
                <Link href="/admin/users" className="hover:underline">
                  Manage users
                </Link>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Webhook Events
              </CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.webhooks}</div>
              <p className="text-xs text-muted-foreground">
                <Link href="/admin/webhooks" className="hover:underline">
                  View logs
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Verifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Verifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentVerifications.map((v) => (
                      <TableRow key={v.id}>
                        <TableCell>{v.user_email}</TableCell>
                        <TableCell>{getStatusBadge(v.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Failed Webhooks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Recent Failed Webhooks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {failedWebhooks.map((w) => (
                      <TableRow key={w.id}>
                        <TableCell className="truncate max-w-[150px]">
                          {w.endpoint}
                        </TableCell>
                        <TableCell>{getStatusBadge(w.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
