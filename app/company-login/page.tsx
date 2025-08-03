"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { signInWithEmail, signOut } from "@/lib/supabase";
import Link from "next/link";

export default function CompanyLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await signInWithEmail(email, password);

      if (error) {
        console.error("Login error:", error);
        setError(error.message);
        toast.error("Login failed", {
          description: error.message,
        });
        setLoading(false);
        return;
      }

      if (data?.user) {
        // Check if user is a company user
        const userRecord = await fetch("/api/check-user-type", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.user.email }),
        }).then((res) => res.json());

        console.log("Company login - User type check response:", userRecord);

        if (userRecord?.data?.user_type === "company_user") {
          toast.success("Login successful", {
            description: "Welcome back to your company dashboard!",
          });

          // Store user data in session storage for dashboard
          sessionStorage.setItem("user_email", data.user.email || "");
          sessionStorage.setItem("user_name", userRecord.data.name);
          sessionStorage.setItem("user_type", "company_user");
          sessionStorage.setItem("api_key", userRecord.data.api_key || "");

          router.push("/company-dashboard");
        } else {
          // User exists but is not a company user
          await signOut();
          setError("This account is not registered as a company user");
          toast.error("Access denied", {
            description: "This account is not registered as a company user",
          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred");
      toast.error("Login failed", {
        description: "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Company Login</CardTitle>
          <CardDescription>
            Sign in to access your company dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Don't have an account?</p>
            <Link
              href="/company-signup"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Sign up as a company
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
