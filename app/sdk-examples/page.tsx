"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Code,
  Copy,
  Download,
  Globe,
  Key,
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Activity,
  BarChart3,
  Terminal,
  FileText,
  Github,
  ExternalLink,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function SDKDocsPage() {
  const [activeTab, setActiveTab] = useState("javascript");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, language: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(language);
    toast.success(`${language} code copied to clipboard`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const codeExamples: Record<
    string,
    {
      title: string;
      icon: JSX.Element;
      color: string;
      installation: string;
      basicUsage: string;
      frameworkExample?: string;
    }
  > = {
    javascript: {
      title: "JavaScript/Node.js",
      icon: <Terminal className="w-5 h-5" />,
      color: "from-yellow-500 to-orange-600",
      installation: `npm install @faydapass/sdk
# or
yarn add @faydapass/sdk`,
      basicUsage: `import FaydaPassSDK from '@faydapass/sdk';

const faydaPass = new FaydaPassSDK('your-api-key');

// Validate your API key
const validation = await faydaPass.validateApiKey();

// Initiate verification
const verification = await faydaPass.initiateVerification(
  'user@example.com',
  'https://yourapp.com/callback'
);

// Check status
const status = await faydaPass.getVerificationStatus(verification.verificationId);`,
      frameworkExample: `const express = require('express');
const FaydaPassSDK = require('@faydapass/sdk');

const app = express();
const faydaPass = new FaydaPassSDK('your-api-key');

app.post('/verify', async (req, res) => {
  try {
    const { userEmail, redirectUrl } = req.body;
    const verification = await faydaPass.initiateVerification(userEmail, redirectUrl);

    res.json({
      success: true,
      verificationId: verification.verificationId,
      redirectUrl: verification.redirectUrl
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});`,
    },
    python: {
      title: "Python",
      icon: <FileText className="w-5 h-5" />,
      color: "from-blue-500 to-purple-600",
      installation: `pip install faydapass-sdk
# or
poetry add faydapass-sdk`,
      basicUsage: `from faydapass import FaydaPassSDK

fayda_pass = FaydaPassSDK('your-api-key')

# Validate your API key
validation = fayda_pass.validate_api_key()

# Initiate verification
verification = fayda_pass.initiate_verification(
    'user@example.com',
    'https://yourapp.com/callback'
)

# Check status
status = fayda_pass.get_verification_status(verification['verificationId'])`,
      frameworkExample: `from flask import Flask, request, jsonify
from faydapass import FaydaPassSDK

app = Flask(__name__)
fayda_pass = FaydaPassSDK('your-api-key')

@app.route('/verify', methods=['POST'])
def start_verification():
    try:
        data = request.get_json()
        verification = fayda_pass.initiate_verification(
            data['userEmail'],
            data['redirectUrl']
        )

        return jsonify({
            'success': True,
            'verificationId': verification['verificationId'],
            'redirectUrl': verification['redirectUrl']
        })
    except Exception as error:
        return jsonify({'success': False, 'error': str(error)}), 400`,
    },
    php: {
      title: "PHP",
      icon: <Code className="w-5 h-5" />,
      color: "from-purple-500 to-pink-600",
      installation: `composer require faydapass/sdk`,
      basicUsage: `<?php
require_once 'vendor/autoload.php';

use FaydaPass\FaydaPassSDK;

$faydaPass = new FaydaPassSDK('your-api-key');

// Validate your API key
$validation = $faydaPass->validateApiKey();

// Initiate verification
$verification = $faydaPass->initiateVerification(
    'user@example.com',
    'https://yourapp.com/callback'
);

// Check status
$status = $faydaPass->getVerificationStatus($verification['verificationId']);`,
      frameworkExample: `<?php
namespace App\\Http\\Controllers;

use FaydaPass\\FaydaPassSDK;
use Illuminate\\Http\\Request;

class VerificationController extends Controller
{
    private $faydaPass;

    public function __construct()
    {
        $this->faydaPass = new FaydaPassSDK(config('faydapass.api_key'));
    }

    public function startVerification(Request $request)
    {
        try {
            $verification = $this->faydaPass->initiateVerification(
                $request->userEmail,
                $request->redirectUrl
            );

            return response()->json([
                'success' => true,
                'verificationId' => $verification['verificationId'],
                'redirectUrl' => $verification['redirectUrl']
            ]);
        } catch (Exception $error) {
            return response()->json([
                'success' => false,
                'error' => $error->getMessage()
            ], 400);
        }
    }
}`,
    },
  };

  const apiEndpoints = [
    {
      method: "POST",
      endpoint: "/api/sdk/validate",
      description: "Validate your API key",
      parameters: [{ name: "apiKey", type: "string", required: true }],
      response: {
        success: true,
        company: {
          name: "EthioBank PLC",
          email: "tech@ethiobank.com",
          plan_type: "business",
          api_calls_remaining: 46580,
        },
      },
    },
    {
      method: "POST",
      endpoint: "/api/sdk/initiate",
      description: "Initiate a KYC verification",
      parameters: [
        { name: "apiKey", type: "string", required: true },
        { name: "userEmail", type: "string", required: true },
        { name: "redirectUrl", type: "string", required: true },
      ],
      response: {
        success: true,
        verificationId: "ver_123456789",
        redirectUrl: "https://faydapass.com/verify/ver_123456789",
        expiresAt: "2025-01-07T08:30:00Z",
      },
    },
    {
      method: "POST",
      endpoint: "/api/sdk/status",
      description: "Check verification status",
      parameters: [
        { name: "apiKey", type: "string", required: true },
        { name: "verificationId", type: "string", required: true },
      ],
      response: {
        success: true,
        verification_id: "ver_123456789",
        status: "success",
        user_email: "user@example.com",
        fayda_id: "FAYDA_123456789",
        match_score: 98.5,
        liveness_score: 95.2,
        created_at: "2025-01-06T08:30:00Z",
        completed_at: "2025-01-06T08:32:15Z",
      },
    },
    {
      method: "POST",
      endpoint: "/api/sdk/list",
      description: "List all verifications",
      parameters: [{ name: "apiKey", type: "string", required: true }],
      response: {
        success: true,
        verifications: [
          {
            verification_id: "ver_123456789",
            status: "success",
            user_email: "user@example.com",
            created_at: "2025-01-06T08:30:00Z",
          },
        ],
      },
    },
    {
      method: "POST",
      endpoint: "/api/sdk/usage",
      description: "Get API usage statistics",
      parameters: [{ name: "apiKey", type: "string", required: true }],
      response: {
        success: true,
        total_calls: 3420,
        success_rate: 95,
        avg_response_time: 245,
        monthly_limit: 50000,
        remaining_calls: 46580,
      },
    },
  ];

  const statusTypes = [
    {
      status: "pending",
      icon: <Clock className="w-4 h-4" />,
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      description: "Verification has been initiated but not yet started",
    },
    {
      status: "processing",
      icon: <Activity className="w-4 h-4" />,
      color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      description: "Verification is currently being processed",
    },
    {
      status: "success",
      icon: <CheckCircle className="w-4 h-4" />,
      color: "bg-green-500/20 text-green-400 border-green-500/30",
      description: "Verification completed successfully",
    },
    {
      status: "failed",
      icon: <AlertCircle className="w-4 h-4" />,
      color: "bg-red-500/20 text-red-400 border-red-500/30",
      description: "Verification failed or was rejected",
    },
  ];

  return (
    <BackgroundWrapper>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <Code className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white">FaydaPass SDK</h1>
            </div>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Integrate government-backed KYC verification into your
              applications with our comprehensive SDK
            </p>
            <div className="flex items-center justify-center space-x-4 mt-6">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                <Download className="w-4 h-4 mr-2" />
                Download SDK
              </Button>
              <Button
                variant="outline"
                className="text-white border-white/20 hover:bg-white/10 bg-transparent"
              >
                <Github className="w-4 h-4 mr-2" />
                View on GitHub
              </Button>
            </div>
          </motion.div>

          {/* Quick Start */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <Card className="backdrop-blur-xl bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Quick Start
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Key className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">
                      1. Get API Key
                    </h3>
                    <p className="text-white/70 text-sm">
                      Register your company and get your unique API key
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Download className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">
                      2. Install SDK
                    </h3>
                    <p className="text-white/70 text-sm">
                      Install the SDK for your preferred programming language
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Code className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">
                      3. Start Verifying
                    </h3>
                    <p className="text-white/70 text-sm">
                      Integrate KYC verification into your application
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* SDK Examples */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <Card className="backdrop-blur-xl bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">SDK Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="space-y-6"
                >
                  <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10">
                    {Object.entries(codeExamples).map(([key, example]) => (
                      <TabsTrigger
                        key={key}
                        value={key}
                        className="text-white data-[state=active]:bg-white/10"
                      >
                        <div
                          className={`w-4 h-4 bg-gradient-to-br ${example.color} rounded mr-2`}
                        />
                        {example.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {Object.entries(codeExamples).map(([key, example]) => (
                    <TabsContent key={key} value={key} className="space-y-6">
                      {/* Installation */}
                      <div>
                        <h3 className="text-white font-semibold mb-3 flex items-center">
                          <Download className="w-4 h-4 mr-2" />
                          Installation
                        </h3>
                        <div className="relative">
                          <pre className="bg-black/20 rounded-lg p-4 text-white/90 text-sm overflow-x-auto">
                            <code>{example.installation}</code>
                          </pre>
                          <Button
                            size="sm"
                            variant="outline"
                            className="absolute top-2 right-2 text-white border-white/20 hover:bg-white/10 bg-transparent"
                            onClick={() =>
                              copyToClipboard(
                                example.installation,
                                "Installation"
                              )
                            }
                          >
                            {copiedCode === "Installation" ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Basic Usage */}
                      <div>
                        <h3 className="text-white font-semibold mb-3 flex items-center">
                          <Code className="w-4 h-4 mr-2" />
                          Basic Usage
                        </h3>
                        <div className="relative">
                          <pre className="bg-black/20 rounded-lg p-4 text-white/90 text-sm overflow-x-auto">
                            <code>{example.basicUsage}</code>
                          </pre>
                          <Button
                            size="sm"
                            variant="outline"
                            className="absolute top-2 right-2 text-white border-white/20 hover:bg-white/10 bg-transparent"
                            onClick={() =>
                              copyToClipboard(example.basicUsage, "Basic Usage")
                            }
                          >
                            {copiedCode === "Basic Usage" ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Framework Integration */}
                      <div>
                        <h3 className="text-white font-semibold mb-3 flex items-center">
                          <Globe className="w-4 h-4 mr-2" />
                          Framework Integration
                        </h3>
                        <div className="relative">
                          <pre className="bg-black/20 rounded-lg p-4 text-white/90 text-sm overflow-x-auto">
                            <code>{example.frameworkExample}</code>
                          </pre>
                          <Button
                            size="sm"
                            variant="outline"
                            className="absolute top-2 right-2 text-white border-white/20 hover:bg-white/10 bg-transparent"
                            onClick={() =>
                              copyToClipboard(
                                example.frameworkExample || "",
                                "Framework"
                              )
                            }
                          >
                            {copiedCode === "Framework" ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* API Reference */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <Card className="backdrop-blur-xl bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">API Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {apiEndpoints.map((endpoint, index) => (
                    <div
                      key={`endpoint-${endpoint.method}-${endpoint.endpoint}-${index}`}
                      className="border border-white/10 rounded-lg p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Badge
                            className={
                              endpoint.method === "POST"
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                            }
                          >
                            {endpoint.method}
                          </Badge>
                          <code className="text-white font-mono bg-white/10 px-3 py-1 rounded">
                            {endpoint.endpoint}
                          </code>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-white border-white/20 hover:bg-white/10 bg-transparent"
                          onClick={() =>
                            copyToClipboard(
                              `${endpoint.method} ${endpoint.endpoint}`,
                              `endpoint-${index}`
                            )
                          }
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>

                      <p className="text-white/70 mb-4">
                        {endpoint.description}
                      </p>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-white font-semibold mb-3">
                            Parameters
                          </h4>
                          <div className="space-y-2">
                            {endpoint.parameters.map((param, paramIndex) => (
                              <div
                                key={`param-${endpoint.method}-${endpoint.endpoint}-${param.name}-${paramIndex}`}
                                className="flex items-center justify-between"
                              >
                                <code className="text-white/90 font-mono">
                                  {param.name}
                                </code>
                                <div className="flex items-center space-x-2">
                                  <span className="text-white/60 text-sm">
                                    {param.type}
                                  </span>
                                  {param.required && (
                                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                                      Required
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-white font-semibold mb-3">
                            Response
                          </h4>
                          <pre className="bg-black/20 rounded-lg p-3 text-white/90 text-sm overflow-x-auto">
                            <code>
                              {JSON.stringify(endpoint.response, null, 2)}
                            </code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Status Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <Card className="backdrop-blur-xl bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">
                  Verification Status Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {statusTypes.map((status, index) => (
                    <div
                      key={`status-${status.status}-${index}`}
                      className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <Badge className={status.color}>
                        {status.icon}
                        <span className="ml-1 capitalize">{status.status}</span>
                      </Badge>
                      <p className="text-white/70 text-sm">
                        {status.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Additional Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="backdrop-blur-xl bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">
                  Additional Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Button
                    variant="outline"
                    className="text-white border-white/20 hover:bg-white/10 h-auto p-4 flex-col"
                  >
                    <FileText className="w-8 h-8 mb-2" />
                    <span className="font-semibold">Full Documentation</span>
                    <span className="text-white/60 text-sm">
                      Complete API reference
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    className="text-white border-white/20 hover:bg-white/10 h-auto p-4 flex-col"
                  >
                    <Github className="w-8 h-8 mb-2" />
                    <span className="font-semibold">GitHub Repository</span>
                    <span className="text-white/60 text-sm">
                      Source code and examples
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    className="text-white border-white/20 hover:bg-white/10 h-auto p-4 flex-col"
                  >
                    <Users className="w-8 h-8 mb-2" />
                    <span className="font-semibold">Community</span>
                    <span className="text-white/60 text-sm">
                      Get help and share
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    className="text-white border-white/20 hover:bg-white/10 h-auto p-4 flex-col"
                  >
                    <BarChart3 className="w-8 h-8 mb-2" />
                    <span className="font-semibold">Dashboard</span>
                    <span className="text-white/60 text-sm">
                      Monitor your usage
                    </span>
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
