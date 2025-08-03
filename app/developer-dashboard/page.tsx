"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Code,
  BookOpen,
  Zap,
  Shield,
  Activity,
  TrendingUp,
  BarChart3,
  Settings,
  LogOut,
  Copy,
  ExternalLink,
  Download,
  Play,
} from "lucide-react";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import { faydapass } from "@/lib/faydapass-sdk";
import { signOut } from "@/lib/supabase";

export default function DeveloperDashboard() {
  const router = useRouter();
  const [usageStats, setUsageStats] = useState({
    total_verifications: 0,
    successful_verifications: 0,
    failed_verifications: 0,
    api_calls_this_month: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      const userEmail = sessionStorage.getItem("user_email");
      const userName = sessionStorage.getItem("user_name");

      if (!userEmail || !userName) {
        router.push("/developer-signup");
        return;
      }

      try {
        // Load usage stats from SDK
        const stats = await faydapass.getUsageStats();
        setUsageStats(stats);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  const handleLogout = async () => {
    try {
      // Properly sign out from Supabase Auth
      const { error } = await signOut();

      if (error) {
        console.error("Error signing out:", error);
      }

      // Clear session storage
      sessionStorage.clear();

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if there's an error, clear session and redirect
      sessionStorage.clear();
      router.push("/");
    }
  };

  const handleCopyApiKey = () => {
    const apiKey = sessionStorage.getItem("api_key");
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      // You could add a toast notification here
    }
  };

  const sdkExamples = [
    {
      language: "JavaScript",
      code: `const faydapass = new FaydaPass({
  apiKey: '${sessionStorage.getItem("api_key") || "fp_dev_demo_key"}'
});

// Initialize verification
const result = await faydapass.initiateVerification({
  user_email: 'user@example.com',
  redirect_url: 'https://yourapp.com/callback'
});`,
      downloadUrl: "#",
    },
    {
      language: "Python",
      code: `import faydapass

client = faydapass.Client(
    api_key='${sessionStorage.getItem("api_key") || "fp_dev_demo_key"}'
)

# Initialize verification
result = client.initiate_verification(
    user_email='user@example.com',
    redirect_url='https://yourapp.com/callback'
)`,
      downloadUrl: "#",
    },
    {
      language: "cURL",
      code: `curl -X POST https://api.faydapass.com/v1/verify \\
  -H "Authorization: Bearer ${
    sessionStorage.getItem("api_key") || "fp_dev_demo_key"
  }" \\
  -H "Content-Type: application/json" \\
  -d '{
    "user_email": "user@example.com",
    "redirect_url": "https://yourapp.com/callback"
  }'`,
      downloadUrl: "#",
    },
  ];

  if (loading) {
    return (
      <BackgroundWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white text-xl">Loading dashboard...</div>
        </div>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-white/5 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    Developer Dashboard
                  </h1>
                  <p className="text-white/60 text-sm">
                    {sessionStorage.getItem("user_email")}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push("/developer-settings")}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  onClick={handleLogout}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: "Total Verifications",
                value: usageStats.total_verifications,
                icon: <Activity className="w-6 h-6 text-blue-400" />,
                color: "text-blue-400",
              },
              {
                title: "Successful",
                value: usageStats.successful_verifications,
                icon: <TrendingUp className="w-6 h-6 text-green-400" />,
                color: "text-green-400",
              },
              {
                title: "Failed",
                value: usageStats.failed_verifications,
                icon: <BarChart3 className="w-6 h-6 text-red-400" />,
                color: "text-red-400",
              },
              {
                title: "API Calls (Month)",
                value: usageStats.api_calls_this_month,
                icon: <Zap className="w-6 h-6 text-yellow-400" />,
                color: "text-yellow-400",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium">
                      {stat.title}
                    </p>
                    <p className={`text-3xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* API Key Section */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">
                API Configuration
              </h2>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-green-400 text-sm font-medium">
                  Active
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">
                  API Key
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={
                      sessionStorage.getItem("api_key") || "fp_dev_demo_key"
                    }
                    readOnly
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-mono text-sm"
                  />
                  <button
                    onClick={handleCopyApiKey}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-white/60 text-sm">Base URL</p>
                  <p className="text-white font-mono text-sm">
                    https://api.faydapass.com
                  </p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Status</p>
                  <p className="text-green-400 text-sm">Active</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Plan</p>
                  <p className="text-white text-sm">Developer</p>
                </div>
              </div>
            </div>
          </div>

          {/* SDK Examples */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">SDK Examples</h2>
              <a
                href="/docs"
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center space-x-2"
              >
                <span>View Full Docs</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {sdkExamples.map((example, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">
                      {example.language}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button className="text-white/60 hover:text-white transition-colors">
                        <Play className="w-4 h-4" />
                      </button>
                      <button className="text-white/60 hover:text-white transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <pre className="text-green-400 text-xs leading-relaxed font-mono whitespace-pre-wrap overflow-x-auto">
                    {example.code}
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Documentation
                  </h3>
                  <p className="text-white/60 text-sm">
                    Complete API reference
                  </p>
                </div>
              </div>
              <p className="text-white/80 mb-4">
                Get started with our comprehensive documentation, including code
                examples, integration guides, and best practices.
              </p>
              <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300">
                View Documentation
              </button>
            </div>

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Sandbox</h3>
                  <p className="text-white/60 text-sm">Test your integration</p>
                </div>
              </div>
              <p className="text-white/80 mb-4">
                Test your integration in our sandbox environment with mock data
                and real API responses.
              </p>
              <button className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-300">
                Open Sandbox
              </button>
            </div>
          </div>
        </div>
      </div>
    </BackgroundWrapper>
  );
}
