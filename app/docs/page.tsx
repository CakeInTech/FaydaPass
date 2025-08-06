"use client";

import DocsBackgroundWrapper from "@/components/docs/DocsBackgroundWrapper";
import Footer from "@/components/docs/DocsFooter";
import { DocsLayout } from "@/components/docs/DocsLayout";
import DocsNavbar from "@/components/docs/DocsNavbar";
import { DocsPageHeader } from "@/components/docs/DocsPageHeader";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { MdxComponents } from "@/components/docs/MdxComponents";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Shield,
  Zap,
  Globe,
  Code,
  Lock,
  Users,
  ArrowRight,
  Building2,
} from "lucide-react";

const headings = [
  { id: "about-faydapass", title: "About FaydaPass" },
  { id: "company-registration", title: "Company Registration" },
  { id: "sdk-overview", title: "SDK Overview" },
  { id: "quick-start", title: "Quick Start" },
  { id: "installation", title: "Installation" },
  { id: "authentication", title: "Authentication" },
  { id: "api-reference", title: "API Reference" },
  { id: "dashboard", title: "Dashboard" },
  { id: "security", title: "Security" },
  { id: "examples", title: "Examples" },
  { id: "troubleshooting", title: "Troubleshooting" },
  { id: "support", title: "Support" },
];

export default function Page() {
  return (
    <DocsBackgroundWrapper>
      <DocsNavbar />
      <DocsSidebar headings={headings} />
      <DocsLayout>
        <DocsPageHeader
          heading="FaydaPass Documentation"
          text="Government-backed KYC verification platform for Ethiopia. Register your company, get API keys, and integrate secure identity verification in minutes."
        />

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Production Ready
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            <Shield className="w-3 h-3 mr-1" />
            SOC 2 Compliant
          </Badge>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            <Zap className="w-3 h-3 mr-1" />
            99.9% Uptime
          </Badge>
        </div>

        {/* About FaydaPass */}
        <section id="about-faydapass" className="mb-12">
          <MdxComponents.h2>About FaydaPass</MdxComponents.h2>
          <MdxComponents.p>
            FaydaPass is a government-backed KYC (Know Your Customer)
            verification platform specifically designed for Ethiopian
            businesses. Built on top of the Fayda eSignet infrastructure, it
            provides seamless integration with Ethiopia's national identity
            system.
          </MdxComponents.p>
          <MdxComponents.p>
            Our platform enables companies and developers to integrate secure
            identity verification into their applications with simple API calls.
            Each company gets their own API key, dashboard, and verification
            tracking.
          </MdxComponents.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <Globe className="w-8 h-8 text-blue-400 mb-2" />
              <h4 className="text-white font-semibold mb-1">
                Government Backed
              </h4>
              <p className="text-gray-400 text-sm">
                Powered by Ethiopia's official Fayda eSignet system
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <Code className="w-8 h-8 text-green-400 mb-2" />
              <h4 className="text-white font-semibold mb-1">Simple SDK</h4>
              <p className="text-gray-400 text-sm">
                Easy-to-use JavaScript SDK with comprehensive documentation
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <Lock className="w-8 h-8 text-purple-400 mb-2" />
              <h4 className="text-white font-semibold mb-1">
                Company Dashboard
              </h4>
              <p className="text-gray-400 text-sm">
                Track verifications, usage stats, and manage your API keys
              </p>
            </div>
          </div>
        </section>

        {/* Company Registration */}
        <section id="company-registration" className="mb-12">
          <MdxComponents.h2>Company Registration</MdxComponents.h2>
          <MdxComponents.p>
            Register your company to get started with FaydaPass. Each company
            gets their own API key, dashboard, and verification tracking.
          </MdxComponents.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">
                    Company Registration
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Register your company and get instant API access
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">API Key Generation</h4>
                  <p className="text-gray-400 text-sm">
                    Automatic API key generation for secure access
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">Dashboard Access</h4>
                  <p className="text-gray-400 text-sm">
                    Track verifications and usage in real-time
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">Developer Plans</h4>
                  <p className="text-gray-400 text-sm">
                    Free developer plan for testing and development
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">Business Plans</h4>
                  <p className="text-gray-400 text-sm">
                    Production-ready plans with higher limits
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">Usage Tracking</h4>
                  <p className="text-gray-400 text-sm">
                    Monitor API usage and verification success rates
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 my-6">
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-blue-400" />
              Registration Process
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  1
                </div>
                <span className="text-white">
                  Visit{" "}
                  <code className="bg-gray-800 px-2 py-1 rounded">
                    /signup?plan=business
                  </code>
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  2
                </div>
                <span className="text-white">
                  Fill in company details and choose plan
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  3
                </div>
                <span className="text-white">Get your API key instantly</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  4
                </div>
                <span className="text-white">
                  Start integrating with our SDK
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SDK Overview */}
        <section id="sdk-overview" className="mb-12">
          <MdxComponents.h2>SDK Overview</MdxComponents.h2>
          <MdxComponents.p>
            The FaydaPass SDK provides a simple way to integrate KYC
            verification into your applications. It handles authentication,
            verification initiation, and status checking.
          </MdxComponents.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">Easy Integration</h4>
                  <p className="text-gray-400 text-sm">
                    Simple JavaScript SDK with comprehensive documentation
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">API Key Validation</h4>
                  <p className="text-gray-400 text-sm">
                    Automatic validation of company API keys
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">
                    Verification Tracking
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Track verification status and results
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">Error Handling</h4>
                  <p className="text-gray-400 text-sm">
                    Comprehensive error handling with detailed messages
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">TypeScript Support</h4>
                  <p className="text-gray-400 text-sm">
                    Full type safety with generated types
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">Usage Statistics</h4>
                  <p className="text-gray-400 text-sm">
                    Monitor API usage and performance metrics
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 my-6">
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <Code className="w-5 h-5 mr-2 text-green-400" />
              SDK Features
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">API Key Validation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">
                    Verification Initiation
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">Status Checking</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">Usage Statistics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">Error Handling</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">TypeScript Support</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section id="quick-start" className="mb-12">
          <MdxComponents.h2>Quick Start</MdxComponents.h2>
          <MdxComponents.p>
            Get up and running with FaydaPass SDK in less than 5 minutes. This
            guide will walk you through the basic setup and integration.
          </MdxComponents.p>

          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 my-6">
            <h4 className="text-white font-semibold mb-4 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-yellow-400" />
              Prerequisites
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-white">
                  Company registration completed
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-white">API key from your dashboard</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-white">Node.js 18+ installed</span>
              </div>
            </div>
          </div>

          <MdxComponents.h3>1. Install the SDK</MdxComponents.h3>
          <CodeBlock
            language="bash"
            code={`# Using npm
npm install @faydapass/sdk

# Using yarn
yarn add @faydapass/sdk

# Using pnpm
pnpm add @faydapass/sdk`}
          />

          <MdxComponents.h3>2. Initialize the SDK</MdxComponents.h3>
          <CodeBlock
            language="javascript"
            code={`import { FaydaPass } from '@faydapass/sdk';

const faydapass = new FaydaPass({
  apiKey: 'your_api_key_here',
  baseUrl: 'https://api.faydapass.com',
  timeout: 30000,
});`}
          />

          <MdxComponents.h3>3. Initiate a Verification</MdxComponents.h3>
          <CodeBlock
            language="javascript"
            code={`// Initiate a KYC verification
const verification = await faydapass.initiateVerification({
  userEmail: 'user@example.com',
  redirectUrl: 'https://yourapp.com/callback',
  metadata: {
    source: 'web_app',
    user_id: '12345',
  },
});

console.log('Verification ID:', verification.verificationId);
console.log('Auth URL:', verification.authUrl);`}
          />

          <MdxComponents.h3>4. Check Verification Status</MdxComponents.h3>
          <CodeBlock
            language="javascript"
            code={`// Check verification status
const status = await faydapass.getVerificationStatus(verification.verificationId);
console.log('Status:', status.status);
console.log('Fayda ID:', status.faydaId);`}
          />

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 my-6">
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <Code className="w-4 h-4 mr-2 text-blue-400" />
              Test Your Integration
            </h4>
            <p className="text-white text-sm mb-3">
              Use our SDK test page to verify your integration:
            </p>
            <a
              href="/sdk-test"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Code className="w-4 h-4" />
              <span>Test SDK</span>
            </a>
          </div>
        </section>

        {/* Installation */}
        <section id="installation" className="mb-12">
          <MdxComponents.h2>Installation</MdxComponents.h2>
          <MdxComponents.p>
            Install the FaydaPass SDK in your project to start integrating KYC
            verification.
          </MdxComponents.p>

          <MdxComponents.h3>Using npm</MdxComponents.h3>
          <CodeBlock language="bash" code="npm install @faydapass/sdk" />

          <MdxComponents.h3>Using yarn</MdxComponents.h3>
          <CodeBlock language="bash" code="yarn add @faydapass/sdk" />

          <MdxComponents.h3>Using pnpm</MdxComponents.h3>
          <CodeBlock language="bash" code="pnpm add @faydapass/sdk" />

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 my-6">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <div>
                <h4 className="text-blue-400 font-medium mb-1">Note</h4>
                <p className="text-blue-200 text-sm">
                  Make sure you have registered your company and obtained an API
                  key before installing the SDK. You can register at{" "}
                  <code>/signup?plan=business</code>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Authentication */}
        <section id="authentication" className="mb-12">
          <MdxComponents.h2>Authentication</MdxComponents.h2>
          <MdxComponents.p>
            FaydaPass uses API key authentication for secure access to the
            verification services.
          </MdxComponents.p>

          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 my-6">
            <h4 className="text-white font-semibold mb-4">
              Authentication Flow
            </h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  1
                </div>
                <div>
                  <h5 className="text-white font-medium">Register Company</h5>
                  <p className="text-gray-400 text-sm">
                    Register your company to get an API key
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  2
                </div>
                <div>
                  <h5 className="text-white font-medium">Initialize SDK</h5>
                  <p className="text-gray-400 text-sm">
                    Initialize the SDK with your API key
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  3
                </div>
                <div>
                  <h5 className="text-white font-medium">Validate API Key</h5>
                  <p className="text-gray-400 text-sm">
                    Validate your API key before making requests
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  4
                </div>
                <div>
                  <h5 className="text-white font-medium">Make Requests</h5>
                  <p className="text-gray-400 text-sm">
                    Use the SDK to initiate verifications and check status
                  </p>
                </div>
              </div>
            </div>
          </div>

          <CodeBlock
            language="javascript"
            filename="example.js"
            code={`import { FaydaPass } from '@faydapass/sdk';

// Initialize with your API key
const faydapass = new FaydaPass({
  apiKey: 'your_api_key_here',
  baseUrl: 'https://api.faydapass.com',
  timeout: 30000,
});

// Validate your API key
const validation = await faydapass.validateApiKey();
if (validation.valid) {
  console.log('API key is valid');
  console.log('Plan:', validation.plan);
  console.log('Company:', validation.company?.name);
} else {
  console.error('Invalid API key');
}`}
          />
        </section>

        {/* Dashboard */}
        <section id="dashboard" className="mb-12">
          <MdxComponents.h2>Dashboard</MdxComponents.h2>
          <MdxComponents.p>
            Each registered company gets access to a comprehensive dashboard to
            track verifications, monitor usage, and manage their API keys.
          </MdxComponents.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">
                    Verification Tracking
                  </h4>
                  <p className="text-gray-400 text-sm">
                    View all verifications with status and results
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">Usage Statistics</h4>
                  <p className="text-gray-400 text-sm">
                    Monitor API calls, success rates, and performance
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">API Key Management</h4>
                  <p className="text-gray-400 text-sm">
                    View and regenerate your API keys securely
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">Real-time Updates</h4>
                  <p className="text-gray-400 text-sm">
                    Get instant notifications for verification status changes
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">Export Data</h4>
                  <p className="text-gray-400 text-sm">
                    Export verification data for reporting and analysis
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">Plan Management</h4>
                  <p className="text-gray-400 text-sm">
                    Upgrade your plan and manage billing information
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 my-6">
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-400" />
              Dashboard Features
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">
                    Verification History
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">
                    Success Rate Analytics
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">API Usage Metrics</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">
                    Real-time Notifications
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">Data Export</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">Plan Management</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* API Reference */}
        <section id="api-reference" className="mb-12">
          <MdxComponents.h2>API Reference</MdxComponents.h2>
          <MdxComponents.p>
            Complete reference for all FaydaPass SDK methods and API endpoints.
          </MdxComponents.p>

          <div className="space-y-6">
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-semibold">
                  initiateVerification()
                </h4>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Core Method
                </Badge>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Initiate a new KYC verification for a user
              </p>

              <h5 className="text-white font-medium mb-2">Parameters</h5>
              <CodeBlock
                language="typescript"
                code={`interface VerificationRequest {
  userEmail: string;
  redirectUrl?: string;
  metadata?: Record<string, any>;
}`}
              />

              <h5 className="text-white font-medium mb-2 mt-4">Response</h5>
              <CodeBlock
                language="typescript"
                code={`interface VerificationResponse {
  verificationId: string;
  authUrl: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  createdAt: string;
}`}
              />
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-semibold">
                  getVerificationStatus()
                </h4>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  Status Check
                </Badge>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Check the status of a verification
              </p>

              <h5 className="text-white font-medium mb-2">Parameters</h5>
              <CodeBlock
                language="typescript"
                code={`verificationId: string`}
              />

              <h5 className="text-white font-medium mb-2 mt-4">Response</h5>
              <CodeBlock
                language="typescript"
                code={`interface VerificationStatus {
  verificationId: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  userEmail: string;
  faydaId?: string;
  verifiedAt?: string;
  metadata?: Record<string, any>;
  error?: string;
}`}
              />
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-semibold">validateApiKey()</h4>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  Authentication
                </Badge>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Validate your API key and get account information
              </p>

              <h5 className="text-white font-medium mb-2 mt-4">Response</h5>
              <CodeBlock
                language="typescript"
                code={`interface ApiKeyValidation {
  valid: boolean;
  plan: string;
  permissions: string[];
  company?: {
    id: string;
    name: string;
    email: string;
    role: string;
    plan_type: string;
  };
}`}
              />
            </div>
          </div>
        </section>

        {/* Security */}
        <section id="security" className="mb-12">
          <MdxComponents.h2>Security</MdxComponents.h2>
          <MdxComponents.p>
            FaydaPass implements multiple layers of security to protect user
            data and prevent unauthorized access.
          </MdxComponents.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <Shield className="w-8 h-8 text-blue-400 mb-3" />
              <h4 className="text-white font-semibold mb-2">
                OAuth 2.0 + OIDC
              </h4>
              <p className="text-gray-400 text-sm">
                Industry standard authentication and authorization protocols
              </p>
            </div>
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <Lock className="w-8 h-8 text-green-400 mb-3" />
              <h4 className="text-white font-semibold mb-2">
                PKCE Implementation
              </h4>
              <p className="text-gray-400 text-sm">
                Proof Key for Code Exchange prevents authorization code
                interception
              </p>
            </div>
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <Code className="w-8 h-8 text-purple-400 mb-3" />
              <h4 className="text-white font-semibold mb-2">
                JWT Client Assertion
              </h4>
              <p className="text-gray-400 text-sm">
                RS256 JWT signing for secure client authentication
              </p>
            </div>
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <Users className="w-8 h-8 text-orange-400 mb-3" />
              <h4 className="text-white font-semibold mb-2">
                State Validation
              </h4>
              <p className="text-gray-400 text-sm">
                CSRF protection with secure state parameter validation
              </p>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 my-6">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div>
                <h4 className="text-red-400 font-medium mb-1">
                  Security Best Practices
                </h4>
                <MdxComponents.ul>
                  <MdxComponents.li>
                    Never expose private keys or client secrets in client-side
                    code
                  </MdxComponents.li>
                  <MdxComponents.li>
                    Always validate state parameters to prevent CSRF attacks
                  </MdxComponents.li>
                  <MdxComponents.li>
                    Use HTTPS in production environments
                  </MdxComponents.li>
                  <MdxComponents.li>
                    Implement proper session management and token storage
                  </MdxComponents.li>
                  <MdxComponents.li>
                    Regularly rotate your JWT signing keys
                  </MdxComponents.li>
                </MdxComponents.ul>
              </div>
            </div>
          </div>
        </section>

        {/* Examples */}
        <section id="examples" className="mb-12">
          <MdxComponents.h2>Examples</MdxComponents.h2>
          <MdxComponents.p>
            Ready-to-use examples for common integration scenarios.
          </MdxComponents.p>

          <div className="space-y-6">
            <div>
              <h4 className="text-white font-semibold mb-3">
                Basic Next.js Integration
              </h4>
              <CodeBlock
                language="typescript"
                filename="components/VerifyButton.tsx"
                code={`'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function VerifyButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleVerify = async () => {
    setIsLoading(true)
    try {
      // Redirect to verification endpoint
      window.location.href = '/api/auth/verify'
    } catch (error) {
      console.error('Verification failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleVerify}
      disabled={isLoading}
      className="bg-gradient-to-r from-blue-600 to-purple-600"
    >
      {isLoading ? 'Verifying...' : 'Verify with Fayda'}
    </Button>
  )
}`}
              />
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">
                React Hook for User Data
              </h4>
              <CodeBlock
                language="typescript"
                filename="hooks/useUser.ts"
                code={`import { useState, useEffect } from 'react'

interface User {
  sub: string
  name: string
  email?: string
  phone_number?: string
  verified: boolean
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = sessionStorage.getItem('access_token')
        if (!token) {
          setLoading(false)
          return
        }

        const response = await fetch('/api/userinfo', {
          headers: {
            'Authorization': \`Bearer \${token}\`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }

        const userData = await response.json()
        setUser({ ...userData, verified: true })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, loading, error }
}`}
              />
            </div>
          </div>
        </section>

        {/* Deployment */}
        <section id="deployment" className="mb-12">
          <MdxComponents.h2>Deployment</MdxComponents.h2>
          <MdxComponents.p>
            Deploy your FaydaPass application to various platforms with these
            configuration guides.
          </MdxComponents.p>

          <div className="space-y-6">
            <div>
              <h4 className="text-white font-semibold mb-3">
                Vercel Deployment
              </h4>
              <CodeBlock
                language="bash"
                code={`# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_CLIENT_ID
vercel env add PRIVATE_KEY
vercel env add NEXT_PUBLIC_REDIRECT_URI`}
              />
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">
                Docker Deployment
              </h4>
              <CodeBlock
                language="dockerfile"
                filename="Dockerfile"
                code={`FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]`}
              />
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section id="troubleshooting" className="mb-12">
          <MdxComponents.h2>Troubleshooting</MdxComponents.h2>
          <MdxComponents.p>
            Common issues and their solutions when integrating FaydaPass.
          </MdxComponents.p>

          <div className="space-y-6">
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <h4 className="text-white font-semibold mb-2">
                UserInfo 401 Error
              </h4>
              <p className="text-gray-400 text-sm mb-3">
                This error occurs when the access token is invalid or the
                request format is incorrect.
              </p>
              <div className="bg-gray-800 rounded p-3 text-sm">
                <p className="text-green-400 mb-2">✅ Solution:</p>
                <MdxComponents.ul>
                  <MdxComponents.li>
                    Ensure you're using POST request with form data
                  </MdxComponents.li>
                  <MdxComponents.li>
                    Verify the access token is valid and not expired
                  </MdxComponents.li>
                  <MdxComponents.li>
                    Check that the Authorization header is properly formatted
                  </MdxComponents.li>
                </MdxComponents.ul>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <h4 className="text-white font-semibold mb-2">
                Token Exchange Failed
              </h4>
              <p className="text-gray-400 text-sm mb-3">
                Issues with exchanging authorization code for access token.
              </p>
              <div className="bg-gray-800 rounded p-3 text-sm">
                <p className="text-green-400 mb-2">✅ Solution:</p>
                <MdxComponents.ul>
                  <MdxComponents.li>
                    Verify your client assertion JWT is properly signed
                  </MdxComponents.li>
                  <MdxComponents.li>
                    Check that the code_verifier matches the code_challenge
                  </MdxComponents.li>
                  <MdxComponents.li>
                    Ensure the authorization code hasn't expired
                  </MdxComponents.li>
                </MdxComponents.ul>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <h4 className="text-white font-semibold mb-2">
                State Parameter Mismatch
              </h4>
              <p className="text-gray-400 text-sm mb-3">
                CSRF protection error when state parameters don't match.
              </p>
              <div className="bg-gray-800 rounded p-3 text-sm">
                <p className="text-green-400 mb-2">✅ Solution:</p>
                <MdxComponents.ul>
                  <MdxComponents.li>
                    Ensure state is properly stored in session/localStorage
                  </MdxComponents.li>
                  <MdxComponents.li>
                    Check for race conditions in callback processing
                  </MdxComponents.li>
                  <MdxComponents.li>
                    Verify state generation uses cryptographically secure random
                    values
                  </MdxComponents.li>
                </MdxComponents.ul>
              </div>
            </div>
          </div>
        </section>

        {/* Support */}
        <section id="support" className="mb-12">
          <MdxComponents.h2>Support</MdxComponents.h2>
          <MdxComponents.p>
            Get help with FaydaPass integration, troubleshooting, and technical
            support.
          </MdxComponents.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">SDK Test Page</h4>
                  <p className="text-gray-400 text-sm">
                    Test your SDK integration with our interactive test page
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">Documentation</h4>
                  <p className="text-gray-400 text-sm">
                    Comprehensive guides and API reference
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">Dashboard Support</h4>
                  <p className="text-gray-400 text-sm">
                    Get help with dashboard features and usage
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">Error Handling</h4>
                  <p className="text-gray-400 text-sm">
                    Detailed error messages and troubleshooting guides
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">Best Practices</h4>
                  <p className="text-gray-400 text-sm">
                    Security guidelines and integration tips
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium">Community</h4>
                  <p className="text-gray-400 text-sm">
                    Join our community for discussions and updates
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-6 my-6">
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-400" />
              Get Help
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">
                    <a
                      href="/sdk-test"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      SDK Test Page
                    </a>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">
                    <a
                      href="/signup?plan=business"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Company Registration
                    </a>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">
                    <a
                      href="/dashboard"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Dashboard
                    </a>
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">
                    <a
                      href="mailto:support@faydapass.com"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Email Support
                    </a>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">
                    <a
                      href="https://github.com/CakeInTech/faydapass"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      GitHub Issues
                    </a>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">
                    <a
                      href="https://docs.faydapass.com"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Full Documentation
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center mt-8">
            <a
              href="/sdk-test"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              <Code className="w-5 h-5" />
              <span>Test Your SDK</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </DocsLayout>
      <Footer />
    </DocsBackgroundWrapper>
  );
}
