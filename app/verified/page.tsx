"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Download,
  Mail,
  Phone,
  Share2,
  Shield,
  User
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserInfo {
  sub: string;
  name: string;
  email?: string;
  phone_number?: string;
  fayda_id?: string;
  picture?: string;
  gender?: string;
  birthdate?: string;
  address?: string;
  name_en?: string;
  name_am?: string;
  verified_at?: string;
}

const ProgressStepper = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    "Select Method",
    "Fayda Authentication",
    "Verification Complete",
  ];

  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber <= currentStep;

          return (
            <div key={step} className="flex items-center w-full">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                    isCompleted
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <p
                  className={`mt-2 text-sm text-center font-medium ${
                    isCompleted ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {step}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-grow h-1 -mx-2 ${
                    isCompleted ? "bg-green-600" : "bg-gray-300"
                  }`}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function VerifiedPage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const accessToken = sessionStorage.getItem("access_token");
        if (!accessToken) {
          router.push("/verify");
          return;
        }
        const response = await fetch("/api/userinfo", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!response.ok) throw new Error("Failed to fetch user info");
        const userData = await response.json();
        setUserInfo({
          ...userData,
          verified_at: new Date().toISOString(),
        });
        sessionStorage.setItem("user_info", JSON.stringify(userData));
      } catch (error) {
        router.push("/verify");
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, [router]);

  const handleDownloadProof = () => {
    if (!userInfo) return;
    const proofData = {
      verification_id: `VP-${Date.now()}`,
      user_name: userInfo.name,
      fayda_id: userInfo.fayda_id || "N/A",
      verified_at: userInfo.verified_at,
      verification_method: "Fayda eSignet OIDC",
      status: "verified",
    };
    const dataStr = JSON.stringify(proofData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `fayda-verification-${userInfo.name
      .replace(/\s+/g, "-")
      .toLowerCase()}.json`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleShare = async () => {
    if (navigator.share && userInfo) {
      try {
        await navigator.share({
          title: "FaydaPass Verification Complete",
          text: `${userInfo.name} has been successfully verified through FaydaPass using Fayda eSignet.`,
          url: window.location.href,
        });
      } catch {}
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">No verification data found.</p>
          <Link href="/verify">
            <Button>Start Verification</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-dark-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">FaydaPass</span>
            </Link>
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 px-3 py-1"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Verified
            </Badge>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <ProgressStepper currentStep={3} />
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            KYC Verification Successful
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your identity has been successfully verified and your account is now
            fully activated.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              {userInfo.picture ? (
                <img
                  src={userInfo.picture}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <User className="w-6 h-6 text-gray-600" />
              )}
              <h2 className="text-2xl font-bold text-gray-900">
                Your Information
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Full Name</span>
                <span className="text-gray-900 font-semibold">
                  {userInfo.name}
                </span>
              </div>
              {userInfo.email && (
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </span>
                  <span className="text-gray-900">{userInfo.email}</span>
                </div>
              )}
              {userInfo.phone_number && (
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Phone
                  </span>
                  <span className="text-gray-900">{userInfo.phone_number}</span>
                </div>
              )}
              {userInfo.gender && (
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Gender</span>
                  <span className="text-gray-900 capitalize">
                    {userInfo.gender}
                  </span>
                </div>
              )}
              {userInfo.birthdate && (
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Birth Date</span>
                  <span className="text-gray-900">{userInfo.birthdate}</span>
                </div>
              )}
              {userInfo.fayda_id && (
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Fayda ID</span>
                  <span className="text-gray-900 font-mono text-sm">
                    {userInfo.fayda_id}
                  </span>
                </div>
              )}
              {(userInfo.name_en || userInfo.name_am) && (
                <div className="py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium block mb-2">
                    Multi-language Names
                  </span>
                  {userInfo.name_en && (
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-500">English:</span>
                      <span className="text-gray-900">{userInfo.name_en}</span>
                    </div>
                  )}
                  {userInfo.name_am && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Amharic:</span>
                      <span className="text-gray-900">{userInfo.name_am}</span>
                    </div>
                  )}
                </div>
              )}
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600 font-medium flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Verified At
                </span>
                <span className="text-gray-900">
                  {userInfo.verified_at
                    ? new Date(userInfo.verified_at).toLocaleString()
                    : "Just now"}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-8 flex flex-col items-center justify-center">
            <Shield className="w-12 h-12 text-green-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Status
            </h2>
            <Badge className="bg-green-100 text-green-800 px-4 py-2 mb-4">
              <CheckCircle className="w-4 h-4 mr-1" />
              Verified
            </Badge>
            <p className="text-green-700 text-center mb-4">
              Your identity is confirmed via Fayda eSignet.
              <br />
              You can now access all platform features.
            </p>
            <Button
              onClick={handleDownloadProof}
              variant="outline"
              className="w-full mb-2"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Verification Proof
            </Button>
            {typeof navigator.share === "function" && (
              <Button
                onClick={handleShare}
                variant="outline"
                className="w-full mb-2"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Verification
              </Button>
            )}
            <Link href="/dashboard" className="w-full">
              <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                <ArrowRight className="w-4 h-4 mr-2" />
                Continue to Dashboard
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
