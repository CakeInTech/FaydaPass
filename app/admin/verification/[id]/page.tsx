"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase, Verification } from "@/lib/supabase";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  User,
  FileText,
  Camera,
  Shield,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";

export default function VerificationDetailPage() {
  const params = useParams();
  const [verification, setVerification] = useState<Verification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.id) {
      fetchVerification(params.id as string);
    }
  }, [params.id]);

  const fetchVerification = async (id: string) => {
    try {
      if (!supabase) {
        console.warn(
          "Supabase client not initialized - environment variables missing"
        );
        setError("Supabase not configured");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("verifications")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setVerification(data);
    } catch (error) {
      console.error("Error fetching verification:", error);
      setError("Verification not found");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      success: "bg-green-100 text-green-800",
      failure: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !verification) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verification Not Found
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/admin/dashboard">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Verification Details
              </h1>
              <p className="text-gray-600">Job ID: {verification.id}</p>
            </div>
          </div>
          <Badge className={getStatusColor(verification.status)}>
            {verification.status.toUpperCase()}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <p className="text-sm text-gray-900">
                    {verification.user_email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    User ID
                  </label>
                  <p className="text-sm text-gray-900 font-mono">
                    {verification.user_id || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Verification Type
                  </label>
                  <Badge variant="outline">{verification.type}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    API Provider
                  </label>
                  <Badge variant="secondary">{verification.api_provider}</Badge>
                </div>
              </div>

              {verification.metadata &&
                Object.keys(verification.metadata).length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      User Metadata
                    </label>
                    <div className="mt-1 bg-gray-50 rounded p-3">
                      {Object.entries(verification.metadata).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between text-sm"
                          >
                            <span className="font-medium">{key}:</span>
                            <span>{String(value)}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Verification Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Verification Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Match Score
                  </label>
                  <p
                    className={`text-2xl font-bold ${getScoreColor(
                      verification.match_score
                    )}`}
                  >
                    {verification.match_score
                      ? `${verification.match_score.toFixed(1)}%`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Liveness Score
                  </label>
                  <p
                    className={`text-2xl font-bold ${getScoreColor(
                      verification.liveness_score
                    )}`}
                  >
                    {verification.liveness_score
                      ? `${verification.liveness_score.toFixed(1)}%`
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Result Code
                </label>
                <code className="block mt-1 text-sm bg-gray-100 px-3 py-2 rounded">
                  {verification.result_code || "N/A"}
                </code>
              </div>

              {verification.reason && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Reason
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {verification.reason}
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Document Type
                </label>
                <p className="text-sm text-gray-900 mt-1 capitalize">
                  {verification.document_type || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Document Images */}
          {(verification.selfie_url || verification.id_photo_url) && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  Document Images
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {verification.selfie_url && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-2 block">
                        Selfie Photo
                      </label>
                      <div className="border rounded-lg overflow-hidden">
                        <Image
                          src={verification.selfie_url}
                          alt="Selfie"
                          width={300}
                          height={400}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {verification.id_photo_url && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-2 block">
                        ID Document Photo
                      </label>
                      <div className="border rounded-lg overflow-hidden">
                        <Image
                          src={verification.id_photo_url}
                          alt="ID Document"
                          width={300}
                          height={400}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Verification Created</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(verification.created_at), "PPpp")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      verification.status === "success"
                        ? "bg-green-500"
                        : verification.status === "failure"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  ></div>
                  <div>
                    <p className="text-sm font-medium">
                      Verification{" "}
                      {verification.status === "success"
                        ? "Completed"
                        : verification.status === "failure"
                        ? "Failed"
                        : "In Progress"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(verification.created_at), "PPpp")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
