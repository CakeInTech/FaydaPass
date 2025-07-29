"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Shield,
  Key,
  Activity,
  Calendar,
  Download,
  ExternalLink,
  Copy,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import BackgroundWrapper from "@/components/BackgroundWrapper";

interface UserInfo {
  sub: string;
  name: string;
  email: string;
  phone_number: string;
  email_verified: boolean;
  phone_number_verified: boolean;
  updated_at: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [apiKey] = useState(
    `fp_live_${Math.random().toString(36).substring(7)}`
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const storedUserInfo = sessionStorage.getItem("user_info");
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    } else {
      router.push("/verify");
    }
  }, [router]);

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <BackgroundWrapper>
      <div className="min-h-screen py-32 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome back, {userInfo.name.split(" ")[0]}!
            </h1>
            <p className="text-xl text-white/80">
              Your FaydaPass KYC verification is complete and active.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Verification Status</p>
                  <p className="text-2xl font-bold text-white">Verified</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">API Calls This Month</p>
                  <p className="text-2xl font-bold text-white">1,247</p>
                </div>
                <Activity className="w-12 h-12 text-blue-400" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Account Created</p>
                  <p className="text-2xl font-bold text-white">Today</p>
                </div>
                <Calendar className="w-12 h-12 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Profile */}
            <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-8 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Profile Information
                </h2>
                <User className="w-6 h-6 text-white/60" />
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-white/60 text-sm">Full Name</p>
                  <p className="text-white font-semibold">{userInfo.name}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Email</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-white font-semibold">{userInfo.email}</p>
                    {userInfo.email_verified && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Phone</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-white font-semibold">
                      {userInfo.phone_number}
                    </p>
                    {userInfo.phone_number_verified && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-white/60 text-sm">User ID</p>
                  <p className="text-white font-semibold font-mono text-sm">
                    {userInfo.sub}
                  </p>
                </div>
              </div>
            </div>

            {/* API Access */}
            <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-8 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">API Access</h2>
                <Key className="w-6 h-6 text-white/60" />
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-white/60 text-sm mb-2">Your API Key</p>
                  <div className="flex items-center space-x-2 bg-black/20 rounded-lg p-3">
                    <code className="text-green-400 font-mono text-sm flex-1">
                      {apiKey}
                    </code>
                    <button
                      onClick={copyApiKey}
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-300 mt-0.5" />
                    <div>
                      <p className="text-sm text-white font-medium">
                        Keep Your API Key Secure
                      </p>
                      <p className="text-sm text-white/70 mt-1">
                        Never share your API key publicly or commit it to
                        version control.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white/10 backdrop-blur-2xl rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/docs">
                <button className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Docs
                </button>
              </Link>

              <button
                onClick={() =>
                  window.open("https://github.com/faydapass/examples", "_blank")
                }
                className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <Download className="w-4 h-4 mr-2" />
                Examples
              </button>

              <Link href="/admin/users">
                <button className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                  <User className="w-4 h-4 mr-2" />
                  Manage Users
                </button>
              </Link>

              <button className="w-full flex items-center justify-center border border-white/30 hover:bg-white/10 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                <Activity className="w-4 h-4 mr-2" />
                Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </BackgroundWrapper>
  );
}
