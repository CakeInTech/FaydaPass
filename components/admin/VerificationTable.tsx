"use client";

import { useEffect, useState } from "react";
import { supabase, Verification } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Download, Eye, Filter, Calendar } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface Filters {
  status: string;
  search: string;
  dateFrom: string;
  dateTo: string;
}

export function VerificationTable() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [filteredVerifications, setFilteredVerifications] = useState<
    Verification[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    status: "all",
    search: "",
    dateFrom: "",
    dateTo: "",
  });
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchVerifications();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [verifications, filters]);

  const fetchVerifications = async () => {
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
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVerifications(data || []);
    } catch (error) {
      console.error("Error fetching verifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...verifications];

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((v) => v.status === filters.status);
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.user_email.toLowerCase().includes(searchLower) ||
          v.id.toLowerCase().includes(searchLower) ||
          v.result_code?.toLowerCase().includes(searchLower)
      );
    }

    // Date filters
    if (filters.dateFrom) {
      filtered = filtered.filter(
        (v) => new Date(v.created_at) >= new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(
        (v) => new Date(v.created_at) <= new Date(filters.dateTo + "T23:59:59")
      );
    }

    setFilteredVerifications(filtered);
  };

  const exportToCSV = () => {
    if (!isAdmin) return;

    const headers = [
      "Job ID",
      "User Email",
      "Status",
      "Type",
      "Match Score",
      "Liveness Score",
      "Result Code",
      "Reason",
      "Document Type",
      "API Provider",
      "Created At",
    ];

    const csvData = filteredVerifications.map((v) => [
      v.id,
      v.user_email,
      v.status,
      v.type,
      v.match_score,
      v.liveness_score,
      v.result_code || "",
      v.reason || "",
      v.document_type || "",
      v.api_provider,
      format(new Date(v.created_at), "yyyy-MM-dd HH:mm:ss"),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `verifications-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Verifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Verifications ({filteredVerifications.length})</CardTitle>
          {isAdmin && (
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by email, ID, or result code..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="pl-10"
              />
            </div>
          </div>

          <Select
            value={filters.status}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, status: value }))
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failure">Failure</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Input
              type="date"
              placeholder="From date"
              value={filters.dateFrom}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))
              }
              className="w-[140px]"
            />
            <Input
              type="date"
              placeholder="To date"
              value={filters.dateTo}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, dateTo: e.target.value }))
              }
              className="w-[140px]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job ID</TableHead>
                <TableHead>User Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Match Score</TableHead>
                <TableHead>Result Code</TableHead>
                <TableHead>API Provider</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVerifications.map((verification) => (
                <TableRow key={verification.id}>
                  <TableCell className="font-mono text-xs">
                    {verification.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>{verification.user_email}</TableCell>
                  <TableCell>{getStatusBadge(verification.status)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{verification.type}</Badge>
                  </TableCell>
                  <TableCell>
                    {verification.match_score
                      ? `${verification.match_score.toFixed(1)}%`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {verification.result_code || "-"}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {verification.api_provider}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(
                      new Date(verification.created_at),
                      "MMM dd, yyyy HH:mm"
                    )}
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/verification/${verification.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredVerifications.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No verifications found matching your filters.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
