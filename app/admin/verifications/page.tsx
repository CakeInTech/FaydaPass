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
import { Search, Filter, Download } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Verification } from "@/lib/supabase";

export default function VerificationsPage() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      setLoading(true);

      if (!supabase) {
        console.warn("Supabase client not initialized");
        return;
      }

      const { data, error } = await supabase
        .from("verifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching verifications:", error);
        return;
      }

      setVerifications(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVerifications = verifications.filter((verification) => {
    const matchesSearch =
      verification.user_email
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      verification.result_code
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      verification.reason?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || verification.status === statusFilter;
    const matchesType =
      typeFilter === "all" || verification.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

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

  const getTypeBadge = (type: string) => {
    return (
      <Badge variant="outline" className="text-xs">
        {type}
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
          <h1 className="text-3xl font-bold text-gray-900">Verifications</h1>
          <p className="text-gray-600 mt-2">
            Monitor and manage KYC verification jobs
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by email, result code, or reason..."
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
                    <SelectItem value="failure">Failure</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="KYC">KYC</SelectItem>
                    <SelectItem value="biometric">Biometric</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={fetchVerifications}
                  className="w-full"
                >
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Results ({filteredVerifications.length} verifications)
              </CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
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
                      <TableHead>User Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Scores</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVerifications.map((verification) => (
                      <TableRow key={verification.id}>
                        <TableCell className="font-medium">
                          {verification.user_email}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(verification.status)}
                        </TableCell>
                        <TableCell>
                          {getTypeBadge(verification.type || "unknown")}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>Match: {verification.match_score}%</div>
                            <div>Liveness: {verification.liveness_score}%</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">
                              {verification.result_code}
                            </div>
                            {verification.reason && (
                              <div className="text-gray-500 text-xs">
                                {verification.reason}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {verification.api_provider}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {formatDate(verification.created_at)}
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
