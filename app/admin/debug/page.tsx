"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function AdminDebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runDebugChecks = async () => {
      const info: any = {};

      try {
        // Check environment variables
        info.envVars = {
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing",
          supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Missing",
          serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Set" : "Missing",
        };

        // Check current user
        try {
          const user = await getCurrentUser();
          info.currentUser = user ? {
            id: user.id,
            email: user.email,
            emailVerified: user.email_confirmed_at ? "Yes" : "No",
          } : "No user found";
        } catch (error) {
          info.currentUser = `Error: ${error}`;
        }

        // Check admin status using simplified approach
        if (info.currentUser && typeof info.currentUser !== "string") {
          const isAdmin = info.currentUser.email === "admin@faydapass.com" || 
                         info.currentUser.email?.includes("admin");
          info.adminUser = isAdmin ? {
            email: info.currentUser.email,
            role: "admin",
            method: "email-based check"
          } : "Not an admin";
        } else {
          info.adminUser = "No user to check";
        }

        // Check cookies
        info.cookies = {
          accessToken: document.cookie.includes("sb-access-token") ? "Present" : "Missing",
          refreshToken: document.cookie.includes("sb-refresh-token") ? "Present" : "Missing",
        };

      } catch (error) {
        info.error = error;
      }

      setDebugInfo(info);
      setLoading(false);
    };

    runDebugChecks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p>Running debug checks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Debug Information</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(debugInfo.envVars || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="font-mono text-sm">{key}:</span>
                    <Badge variant={value === "Set" ? "default" : "destructive"}>
                      {value}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Authentication Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Current User:</h4>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                    {JSON.stringify(debugInfo.currentUser, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Admin Status:</h4>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                    {JSON.stringify(debugInfo.adminUser, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(debugInfo.cookies || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="font-mono text-sm">{key}:</span>
                    <Badge variant={value === "Present" ? "default" : "destructive"}>
                      {value}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {debugInfo.error && (
            <Card>
              <CardHeader>
                <CardTitle>Errors</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-red-50 p-3 rounded text-sm text-red-800 overflow-auto">
                  {JSON.stringify(debugInfo.error, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-8 space-x-4">
          <Button onClick={() => window.location.reload()}>
            Refresh Debug Info
          </Button>
          <Button variant="outline" onClick={() => window.location.href = "/admin/login"}>
            Go to Admin Login
          </Button>
        </div>
      </div>
    </div>
  );
} 