"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Trash2,
  User,
  Mail,
  Shield,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminUser } from "@/lib/supabase";
import { toast } from "sonner";
import Link from "next/link";

interface PageProps {
  params: {
    id: string;
  };
}

export default function UserDetailPage({ params }: PageProps) {
  const { id } = params;
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({ email: "", role: "viewer" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError("");

      if (!supabase) {
        console.warn("Supabase client not initialized");
        setError("Supabase not configured");
        return;
      }

      const { data, error } = await supabase
        .from("admin_users")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching user:", error);
        setError("Failed to load user details");
        return;
      }

      if (!data) {
        setError("User not found");
        return;
      }

      setUser(data);
      setEditForm({ email: data.email, role: data.role });
    } catch (error) {
      console.error("Error:", error);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    try {
      setSaving(true);

      if (!supabase) {
        console.warn("Supabase client not initialized");
        toast.error("Supabase not configured");
        return;
      }

      const { error } = await supabase
        .from("admin_users")
        .update({
          email: editForm.email,
          role: editForm.role,
        })
        .eq("id", id);

      if (error) {
        console.error("Error updating user:", error);
        toast.error("Failed to update user", {
          description: error.message,
        });
        return;
      }

      toast.success("User updated successfully");
      setIsEditDialogOpen(false);
      fetchUser(); // Refresh user data
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setSaving(true);

      if (!supabase) {
        console.warn("Supabase client not initialized");
        toast.error("Supabase not configured");
        return;
      }

      const { error } = await supabase
        .from("admin_users")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user", {
          description: error.message,
        });
        return;
      }

      toast.success("User deleted successfully");
      router.push("/admin/users");
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: "bg-red-100 text-red-800",
      viewer: "bg-blue-100 text-blue-800",
    };
    return (
      <Badge
        className={
          variants[role as keyof typeof variants] || "bg-gray-100 text-gray-800"
        }
      >
        {role}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !user) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/users">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Users
              </Button>
            </Link>
          </div>

          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error || "User not found"}</AlertDescription>
          </Alert>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/users">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Users
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
              <p className="text-gray-600 mt-1">
                Manage user information and permissions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit User</DialogTitle>
                  <DialogDescription>
                    Update user information and role.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={editForm.role}
                      onValueChange={(value) =>
                        setEditForm({ ...editForm, role: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">Viewer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateUser} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete User</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this user? This action
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      This will permanently delete the user account and all
                      associated data.
                    </AlertDescription>
                  </Alert>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteUser}
                    disabled={saving}
                  >
                    {saving ? "Deleting..." : "Delete User"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* User Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  User ID
                </Label>
                <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1">
                  {user.id}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Email Address
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{user.email}</span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Role
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <Shield className="h-4 w-4 text-gray-400" />
                  {getRoleBadge(user.role)}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Created At
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{formatDate(user.created_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Access Level
                </Label>
                <p className="text-sm mt-1">
                  {user.role === "admin"
                    ? "Full administrative access to all features"
                    : "View-only access to dashboard and reports"}
                </p>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Available Actions
                </Label>
                <div className="space-y-2 mt-2">
                  {user.role === "admin" ? (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        View all verifications and analytics
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Manage admin users and roles
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Configure webhooks and system settings
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Access webhook logs and monitoring
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        View verification statistics
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Access verification history
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        Cannot manage users or system settings
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Section */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500">
              Activity tracking will be implemented in future updates.
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
