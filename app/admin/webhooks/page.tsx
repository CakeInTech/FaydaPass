"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Filter, Eye, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { WebhookLog } from "@/lib/supabase";

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookLog | null>(
    null
  );

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    try {
      setLoading(true);
      if (!supabase) {
        console.error("Supabase client not initialized");
        return;
      }

      const { data, error } = await supabase
        .from("webhook_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching webhooks:", error);
        return;
      }

      setWebhooks(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWebhooks = webhooks.filter((webhook) => {
    const matchesSearch =
      webhook.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      webhook.endpoint.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || webhook.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      success: "bg-green-100 text-green-800",
      fail: "bg-red-100 text-red-800",
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
      year: "numeric",
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
          <h1 className="text-3xl font-bold text-gray-900">Webhook Logs</h1>
          <p className="text-gray-600 mt-2">
            Monitor webhook delivery and response logs
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by event or endpoint..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="fail">Failed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={fetchWebhooks}
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Webhook Logs ({filteredWebhooks.length} logs)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Retries</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWebhooks.map((webhook) => (
                      <TableRow key={webhook.id}>
                        <TableCell className="font-medium">
                          {webhook.event}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {webhook.endpoint}
                        </TableCell>
                        <TableCell>{getStatusBadge(webhook.status)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {webhook.retry_count}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {formatDate(webhook.created_at)}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedWebhook(webhook)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Webhook Details</DialogTitle>
                                <DialogDescription>
                                  Request and response details for this webhook.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Event</Label>
                                  <div className="text-sm font-medium">
                                    {webhook.event}
                                  </div>
                                </div>
                                <div>
                                  <Label>Endpoint</Label>
                                  <div className="text-sm font-mono bg-gray-100 p-2 rounded">
                                    {webhook.endpoint}
                                  </div>
                                </div>
                                <div>
                                  <Label>Status</Label>
                                  <div>{getStatusBadge(webhook.status)}</div>
                                </div>
                                <div>
                                  <Label>Request Body</Label>
                                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                                    {JSON.stringify(
                                      webhook.request_body,
                                      null,
                                      2
                                    )}
                                  </pre>
                                </div>
                                <div>
                                  <Label>Response</Label>
                                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                                    {JSON.stringify(webhook.response, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
