"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  CheckCircle,
  XCircle,
  Loader2,
  Copy,
  ExternalLink,
} from "lucide-react";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function SDKTestPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [testData, setTestData] = useState({
    apiKey: "fp_demo_key_123456",
    userEmail: "test@example.com",
    redirectUrl: "https://yourapp.com/callback",
  });

  const runSDKTest = async (testType: string) => {
    setLoading(true);
    setResults(null);

    try {
      let response;
      let data;

      switch (testType) {
        case "validate":
          response = await fetch("/api/sdk/validate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ apiKey: testData.apiKey }),
          });
          break;

        case "initiate":
          response = await fetch("/api/sdk/initiate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              apiKey: testData.apiKey,
              userEmail: testData.userEmail,
              redirectUrl: testData.redirectUrl,
            }),
          });
          break;

        case "status":
          response = await fetch("/api/sdk/status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              apiKey: testData.apiKey,
              verificationId: "vp_test_123456",
            }),
          });
          break;

        case "list":
          response = await fetch("/api/sdk/list", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ apiKey: testData.apiKey }),
          });
          break;

        case "usage":
          response = await fetch("/api/sdk/usage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ apiKey: testData.apiKey }),
          });
          break;

        default:
          throw new Error("Unknown test type");
      }

      data = await response.json();
      setResults({ testType, success: response.ok, data });

      if (response.ok) {
        toast.success(`${testType} test completed successfully!`);
      } else {
        toast.error(`Test failed: ${data.error}`);
      }
    } catch (error) {
      console.error("SDK test error:", error);
      setResults({
        testType,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      toast.error("Test failed with an error");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <BackgroundWrapper>
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              FaydaPass SDK Test
            </h1>
            <p className="text-white/70 text-lg">
              Test and demonstrate the FaydaPass SDK functionality
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Test Configuration */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="backdrop-blur-xl bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Play className="w-5 h-5 mr-2" />
                    Test Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="apiKey" className="text-white/70">
                      API Key
                    </Label>
                    <Input
                      id="apiKey"
                      value={testData.apiKey}
                      onChange={(e) =>
                        setTestData((prev) => ({
                          ...prev,
                          apiKey: e.target.value,
                        }))
                      }
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      placeholder="Enter your API key"
                    />
                  </div>
                  <div>
                    <Label htmlFor="userEmail" className="text-white/70">
                      User Email
                    </Label>
                    <Input
                      id="userEmail"
                      type="email"
                      value={testData.userEmail}
                      onChange={(e) =>
                        setTestData((prev) => ({
                          ...prev,
                          userEmail: e.target.value,
                        }))
                      }
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      placeholder="user@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="redirectUrl" className="text-white/70">
                      Redirect URL
                    </Label>
                    <Input
                      id="redirectUrl"
                      value={testData.redirectUrl}
                      onChange={(e) =>
                        setTestData((prev) => ({
                          ...prev,
                          redirectUrl: e.target.value,
                        }))
                      }
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      placeholder="https://yourapp.com/callback"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Test Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="backdrop-blur-xl bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    SDK Tests
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => runSDKTest("validate")}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    Validate API Key
                  </Button>

                  <Button
                    onClick={() => runSDKTest("initiate")}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white hover:from-green-600 hover:to-blue-700"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <ExternalLink className="w-4 h-4 mr-2" />
                    )}
                    Initiate Verification
                  </Button>

                  <Button
                    onClick={() => runSDKTest("status")}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    Check Status
                  </Button>

                  <Button
                    onClick={() => runSDKTest("list")}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    List Verifications
                  </Button>

                  <Button
                    onClick={() => runSDKTest("usage")}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    Get Usage Stats
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Results */}
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <Card className="backdrop-blur-xl bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    {results.success ? (
                      <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 mr-2 text-red-400" />
                    )}
                    Test Results: {results.testType}
                    <Badge
                      variant="secondary"
                      className={`ml-2 ${
                        results.success
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {results.success ? "Success" : "Failed"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-black/20 rounded-lg p-4">
                    <pre className="text-white text-sm overflow-x-auto">
                      {JSON.stringify(results.data || results.error, null, 2)}
                    </pre>
                    <Button
                      onClick={() =>
                        copyToClipboard(
                          JSON.stringify(results.data || results.error, null, 2)
                        )
                      }
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-white/70 hover:text-white"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy JSON
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* SDK Usage Example */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <Card className="backdrop-blur-xl bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">SDK Usage Example</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-black/20 rounded-lg p-4">
                  <pre className="text-white text-sm overflow-x-auto">
                    {`// Initialize the SDK
const { FaydaPass } = require('@faydapass/sdk');

const faydapass = new FaydaPass({
  apiKey: 'fp_your_api_key_here',
  baseUrl: 'https://api.faydapass.com',
  timeout: 30000,
});

// Initiate a verification
const verification = await faydapass.initiateVerification({
  userEmail: 'user@example.com',
  redirectUrl: 'https://yourapp.com/callback',
  metadata: {
    source: 'web_app',
    user_id: '12345',
  },
});

console.log('Verification ID:', verification.verificationId);
console.log('Auth URL:', verification.authUrl);

// Check verification status
const status = await faydapass.getVerificationStatus(verification.verificationId);
console.log('Status:', status.status);`}
                  </pre>
                  <Button
                    onClick={() =>
                      copyToClipboard(`// Initialize the SDK
const { FaydaPass } = require('@faydapass/sdk');

const faydapass = new FaydaPass({
  apiKey: 'fp_your_api_key_here',
  baseUrl: 'https://api.faydapass.com',
  timeout: 30000,
});

// Initiate a verification
const verification = await faydapass.initiateVerification({
  userEmail: 'user@example.com',
  redirectUrl: 'https://yourapp.com/callback',
  metadata: {
    source: 'web_app',
    user_id: '12345',
  },
});

console.log('Verification ID:', verification.verificationId);
console.log('Auth URL:', verification.authUrl);

// Check verification status
const status = await faydapass.getVerificationStatus(verification.verificationId);
console.log('Status:', status.status);`)
                    }
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-white/70 hover:text-white"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </BackgroundWrapper>
  );
}
