"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Save, Globe, Shield, Bell, Database } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Webhook settings
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookEnabled, setWebhookEnabled] = useState(false);
  const [webhookSecret, setWebhookSecret] = useState("");

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [slackNotifications, setSlackNotifications] = useState(false);
  const [slackWebhookUrl, setSlackWebhookUrl] = useState("");

  // System settings
  const [autoRetryFailed, setAutoRetryFailed] = useState(true);
  const [maxRetries, setMaxRetries] = useState("3");
  const [retentionDays, setRetentionDays] = useState("90");

  useEffect(() => {
    // Load settings from localStorage or API
    const loadSettings = () => {
      const savedSettings = localStorage.getItem("faydapass-settings");
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setWebhookUrl(settings.webhookUrl || "");
        setWebhookEnabled(settings.webhookEnabled || false);
        setWebhookSecret(settings.webhookSecret || "");
        setEmailNotifications(settings.emailNotifications || false);
        setSlackNotifications(settings.slackNotifications || false);
        setSlackWebhookUrl(settings.slackWebhookUrl || "");
        setAutoRetryFailed(settings.autoRetryFailed !== false);
        setMaxRetries(settings.maxRetries || "3");
        setRetentionDays(settings.retentionDays || "90");
      }
    };

    loadSettings();
  }, []);

  const saveSettings = async () => {
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const settings = {
      webhookUrl,
      webhookEnabled,
      webhookSecret,
      emailNotifications,
      slackNotifications,
      slackWebhookUrl,
      autoRetryFailed,
      maxRetries,
      retentionDays,
    };

    localStorage.setItem("faydapass-settings", JSON.stringify(settings));

    setSaved(true);
    setLoading(false);

    setTimeout(() => setSaved(false), 3000);
  };

  const generateWebhookSecret = () => {
    const secret =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    setWebhookSecret(secret);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Configure system settings and integrations
          </p>
        </div>

        {saved && (
          <Alert>
            <AlertDescription>Settings saved successfully!</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Webhook Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Webhook Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="webhook-enabled">Enable Webhooks</Label>
                <Switch
                  id="webhook-enabled"
                  checked={webhookEnabled}
                  onCheckedChange={setWebhookEnabled}
                />
              </div>

              <div>
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://your-domain.com/webhook"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  disabled={!webhookEnabled}
                />
              </div>

              <div>
                <Label htmlFor="webhook-secret">Webhook Secret</Label>
                <div className="flex gap-2">
                  <Input
                    id="webhook-secret"
                    type="password"
                    placeholder="Enter webhook secret"
                    value={webhookSecret}
                    onChange={(e) => setWebhookSecret(e.target.value)}
                    disabled={!webhookEnabled}
                  />
                  <Button
                    variant="outline"
                    onClick={generateWebhookSecret}
                    disabled={!webhookEnabled}
                  >
                    Generate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="slack-notifications">Slack Notifications</Label>
                <Switch
                  id="slack-notifications"
                  checked={slackNotifications}
                  onCheckedChange={setSlackNotifications}
                />
              </div>

              <div>
                <Label htmlFor="slack-webhook">Slack Webhook URL</Label>
                <Input
                  id="slack-webhook"
                  placeholder="https://hooks.slack.com/services/..."
                  value={slackWebhookUrl}
                  onChange={(e) => setSlackWebhookUrl(e.target.value)}
                  disabled={!slackNotifications}
                />
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-retry">
                  Auto-retry Failed Verifications
                </Label>
                <Switch
                  id="auto-retry"
                  checked={autoRetryFailed}
                  onCheckedChange={setAutoRetryFailed}
                />
              </div>

              <div>
                <Label htmlFor="max-retries">Maximum Retries</Label>
                <Input
                  id="max-retries"
                  type="number"
                  min="1"
                  max="10"
                  value={maxRetries}
                  onChange={(e) => setMaxRetries(e.target.value)}
                  disabled={!autoRetryFailed}
                />
              </div>

              <div>
                <Label htmlFor="retention-days">Data Retention (days)</Label>
                <Input
                  id="retention-days"
                  type="number"
                  min="30"
                  max="365"
                  value={retentionDays}
                  onChange={(e) => setRetentionDays(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Current User</Label>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-medium">{user?.email}</span>
                  <Badge variant="outline" className="text-xs">
                    {user?.role}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div>
                <Label>Session Information</Label>
                <div className="text-sm text-gray-600 mt-2 space-y-1">
                  <div>Last Login: {new Date().toLocaleDateString()}</div>
                  <div>IP Address: 192.168.1.1</div>
                  <div>User Agent: Chrome/120.0.0.0</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full">
                  Enable 2FA
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={saveSettings} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
